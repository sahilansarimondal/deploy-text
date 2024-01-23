/*eslint-disable*/
'use client';
import Card from '@/components/card/Card';
import MessageBox from '@/components/MessageBox';
import { UmschreibenBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  FormLabel,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoGraph, MdOutlineDraw, MdAutoFixHigh, MdAutoMode, MdOutlineColorLens, MdOutlineChildFriendly } from 'react-icons/md';
import { Box } from '@chakra-ui/layout';
import { useSession } from 'next-auth/react';

export default function Home() {
  //Auth
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Input States
  const [content, setContent] = useState<string>('');
  const [styleValue, setStyleValue] = useState<
    | ''
    | 'kinderleicht'
    | 'alltagsverständlich'
    | 'gemaessigtFachlich'
    | 'fachspezifisch'
    | 'expertenLevel'
  >('');

  const [varianceValue, setVarianceValue] = useState<
    | ''
    | 'Der Text soll sehr nah am Original bleiben und sich kaum verändern!'
    | 'Der Text soll nah am Original bleiben!'
    | ' '
    | 'Der Text darf sich leicht vom Original entfernen!'
    | 'Der Text darf sich sehr stark vom Original entfernen!'
  >('');

  useEffect(() => {
    handleVarianceChange(50); // grey the second slider from the beginning
    handleStyleChange(50);
  }, []);



  const getStyleIcon = (value: any) => {
    const iconProps = { color: 'col.200' };
    if (value == 'kinderleicht') return <MdOutlineChildFriendly {...iconProps} />;
    if (value == 'alltagsverständlich') return <MdOutlineColorLens {...iconProps} />;
    if (value == 'gemaessigtFachlich') return <MdAutoMode {...iconProps} />;
    if (value == 'fachspezifisch') return <MdAutoFixHigh {...iconProps} />;
    if (value == 'expertenLevel') return <MdAutoGraph {...iconProps} />;
    else return <MdAutoMode />;
  };

  // Response message
  const [outputCode, setOutputCode] = useState<string>('');

  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-4-1106-preview');

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // API Key
  const [apiKey, setApiKey] = useState<string>();
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const toast = useToast();

  // -------------- Main API Handler --------------
  const handleTranslate = async () => {
    const apiKey = localStorage.getItem('apiKey');
    const maxCodeLength = model === 'gpt-4-1106-preview' ? 2048 : 2048;

    // Chat post conditions(maximum number of characters, valid message etc.)

    if (!content) {
      alert('Bitte gib einen Text ein.');
      return;
    }

    if (content.length > maxCodeLength) {
      alert(
        `Bitte gib weniger als ${maxCodeLength} Zeichen ein. Du benutzt momentan ${content.length} Zeichen.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: UmschreibenBody = {
      content,
      styleValue,
      varianceValue,
      model,
    };

    // -------------- Fetch --------------
    const response = await fetch('../api/umschreibenAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      if (response) {
        alert(
          'Something went wrong went fetching from the API. Make sure to use a valid API key.',
        );
      }
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    copyToClipboard(code);
  };

  // -------------- Copy Response --------------
  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  // -------------- Input Value Handler --------------
  const handleChange = (Event: any) => {
    setContent(Event.target.value);
  };

  const handleStyleChange = (value: any) => {
    if (value >= 0 && value < 13) {
      setStyleValue('kinderleicht');
    } else if (value >= 13 && value < 38) {
      setStyleValue('alltagsverständlich');
    } else if (value >= 38 && value < 63) {
      setStyleValue('gemaessigtFachlich');
    } else if (value >= 63 && value < 88) {
      setStyleValue('fachspezifisch');
    } else if (value >= 88 && value <= 100) {
      setStyleValue('expertenLevel');
    }
  };

  const handleVarianceChange = (value: any) => {
    if (value >= 0 && value < 13) {
      setVarianceValue('Der Text soll sehr nah am Original bleiben und sich kaum verändern!');
    } else if (value >= 13 && value < 38) {
      setVarianceValue('Der Text soll nah am Original bleiben!');
    } else if (value >= 38 && value < 63) {
      setVarianceValue(' ');
    } else if (value >= 63 && value < 88) {
      setVarianceValue('Der Text darf sich leicht vom Original entfernen!');
    } else if (value >= 88 && value <= 100) {
      setVarianceValue('Der Text darf sich sehr stark vom Original entfernen!');
    }
  }

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      mt={{ base: '70px', md: '0px', xl: '0px' }}
    >
      <Flex
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        maxW="100%"
        justify="center"
        direction={{ base: 'column', md: 'row' }}
      >
        <Card
          minW={{ base: '100%', md: '40%', xl: '476px' }}
          maxW={{ base: '100%', md: '40%', xl: '476px' }}
          h="min-content"
          me={{ base: '0px', md: '20px' }}
          mb={{ base: '20px', md: '0px' }}
        >
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            {isAuthenticated
              ? "Eingabe"
              : "Bitte logge dich ein, um dieses Tool zu nutzen"}
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Dieses Tool ermöglicht das Umschreiben von Texten mit verschiedenen Schreibstilen.
          </Text>
          <Textarea
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            p="15px 20px"
            mb="28px"
            minH="324px"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={textColor}
            placeholder="Gib deinen Text ein..."
            _placeholder={placeholderColor}
            onChange={handleChange}
          />
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'type'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Stelle die Textkomplexität ein: Von kinderleicht bis Expertenniveau
          </FormLabel>
          <Slider
            aria-label='slider-ex-4'
            defaultValue={50}
            min={0}
            max={100}
            onChange={handleStyleChange}
            mb="24px">
            <SliderTrack bg='blue.100'>
              <SliderFilledTrack bg='col.200' />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color='col.200' as={() => getStyleIcon(styleValue)} />
            </SliderThumb>
          </Slider>
          <FormLabel
            display="flex"
            ms="10px"
            htmlFor={'type'}
            fontSize="md"
            color={textColor}
            letterSpacing="0px"
            fontWeight="bold"
            _hover={{ cursor: 'pointer' }}
          >
            Wie sehr darf sich der Text ändern?
          </FormLabel>
          <Slider
            aria-label='slider-ex-4'
            defaultValue={50}
            min={0}
            max={100}
            onChange={handleVarianceChange}
            mb="24px">
            <SliderTrack bg={varianceValue === (' ' || null) ? 'col.300' : 'blue.100'}>
              <SliderFilledTrack
                bg={varianceValue === (' ' || null) ? 'col.400' : 'col.200'}
              />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color={varianceValue === (' ' || null) ? 'col.300' : 'black'} as={MdOutlineDraw} />
            </SliderThumb>
          </Slider>
          <Button
            py="20px"
            px="16px"
            fontSize="md"
            variant="primarycustom"
            borderRadius="45px"
            w={{ base: '100%' }}
            h="54px"
            onClick={handleTranslate}
            isLoading={loading}
            isDisabled={!isAuthenticated}  // Disable the button if not authenticated
            _hover={{
              boxShadow: '0px 21px 27px -10px rgba(34, 116, 165, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #2274A5 26.3%, #35B3FC 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #2274A5 26.3%, #35B3FC 86.4%)',
              },
            }}
          >
            Umschreiben
          </Button>
        </Card>
        <Card maxW="100%" h="100%">
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            Ergebnis
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Dein neuer Text
          </Text>
          <MessageBox output={outputCode} />
          <Button
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            maxW="160px"
            ms="auto"
            fontSize="md"
            w={{ base: '300px', md: '420px' }}
            h="54px"
            onClick={() => {
              if (outputCode) navigator.clipboard.writeText(outputCode);
              toast({
                title: outputCode
                  ? `Essay succesfully copied!`
                  : `Generate an essay first!`,
                position: 'top',
                status: outputCode ? 'success' : `error`,
                isClosable: true,
              });
            }}
          >
            Kopieren
          </Button>
        </Card>
      </Flex>
    </Flex>
  );
}

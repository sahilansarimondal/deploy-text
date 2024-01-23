/*eslint-disable*/
'use client';
import Card from '@/components/card/Card';
import MessageBox from '@/components/MessageBox';
import { Genderv2Body, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  FormLabel,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  //Auth
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Input States
  const [content, setContent] = useState<string>('');
  const [genderType, setGenderType] = useState<
    | ''
    | 'Doppelnennung'
    | 'BinnenI'
    | 'Gendersternchen'
    | 'Doppelpunkt'
    | 'Schragstrich'
  >('');

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

    const body: Genderv2Body = {
      content,
      genderType,
      model,

    };

    // -------------- Fetch --------------
    const response = await fetch('../api/genderv2API', {
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
  const handleGenderType = (Event: any) => {
    setGenderType(Event.target.value);
  };
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
            Den Text den du gendern willst.
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
            Wähle die Gender-endung aus:
          </FormLabel>
          <Select
            border="1px solid"
            borderRadius={'10px'}
            borderColor={borderColor}
            h="60px"
            id="type"
            placeholder="Wähle aus den Beispielen"
            _focus={{ borderColor: 'none' }}
            mb="28px"
            onChange={handleGenderType}
          >
            <option value="Doppelnennung">Mitarbeiter und Mitarbeiterinnen</option>
            <option value="BinnenI">MitarbeiterInnen</option>
            <option value="Doppelpunkt">Mitarbeiter:innen</option>
            <option value="Schragstrich">Mitarbeiter/innen</option>
          </Select>
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
            Gendern
          </Button>
        </Card>
        <Card maxW="100%" h="100%">
          <Text fontSize={'30px'} color={textColor} fontWeight="800" mb="10px">
            Ergebnis
          </Text>
          <Text fontSize={'16px'} color="gray.500" fontWeight="500" mb="30px">
            Dein gegenderter Text
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

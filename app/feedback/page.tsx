// Importiere benötigte Komponenten von Chakra UI
'use client';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hier muss deine Logik zum Senden der E-Mail implementiert werden.
    // Du kannst z.B. eine Serverless-Funktion in Next.js oder einen externen E-Mail-Dienst verwenden.
    try {
      const response = await axios.post('/api/sendmail', { name, message });
      toast({
        title: 'Nachricht gesendet.',
        description:
          'Wir haben deine Nachricht erhalten und werden uns bald melden.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      // Formular zurücksetzen
      setName('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'Fehler beim Senden.',
        description: 'Es gab ein Problem beim Senden deiner Nachricht.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="message" isRequired mt={4}>
        <FormLabel>Nachricht</FormLabel>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormControl>

      <Button
        mt={4}
        colorScheme="teal"
        type="submit"
        py="20px"
        px="16px"
        fontSize="md"
        variant="primary"
        borderRadius="45px"
        w={{ base: '100%' }}
        h="54px"
        _hover={{
          boxShadow: '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
          bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
          _disabled: {
            bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
          },
        }}
      >
        Absenden
      </Button>
    </form>
  );
};

export default ContactForm;

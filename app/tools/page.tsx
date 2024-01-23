'use client';

// Chakra imports
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

import TemplateCard from '@/components/card/TemplateCard';

export default function Settings() {
  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <Text fontSize="xl" mb="4" fontWeight="bold">
        Alle Tools verwenden die neuste GPT-4 Turbo Version!
      </Text>
      <Text fontSize="l" mb="4" fontWeight="regular" marginBottom="40px">
        Falls dir Fehler auffallen oder du Verbesserungsvorschläge hast, einfach
        links auf Feedback klicken und uns eine Nachricht schreiben!
      </Text>
      <SimpleGrid minChildWidth="200px" spacing="40px">
        <TemplateCard
          link="/zusammenfassen"
          illustration="📄"
          name="Zusammenfassen"
          description="Erstellt kurze Zusammenfassungen von Texten."
        />
        <TemplateCard
          link="/genderv2"
          illustration="🎎"
          name="Gendern"
          description="Prüft Texte auf Gendering-Fehler und korrigiert diese."
        />
        <TemplateCard
          link="/umschreiben"
          illustration="🔁"
          name="Umschreiben"
          description="Lass deinen Text in verschiedenen stilen umschreiben. Von Kinderleicht bis zum Experten modus"
        />
        <TemplateCard
          link="/tools"
          illustration="📄"
          name="Hier entsteht was"
          description="Kommt bald..."
        />
      </SimpleGrid>
    </Box>
  );
}

import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (content: string, genderType: string) => {
  const data = (content: any, genderType: any) => {
    return endent`
    Ich benötige Hilfe um meinen Text richtig zu Gendern. (Geschlechtsneutral machen)
    Hier sind erst einmal die Regeln zum gendern:
    Es gibt verschiedene arten Geschlechtsneutral zu schreiben. Hier sind einige Beispiele, an denen du dich orientieren kannst:
    Singularform: "Die Person", "Der Mensch" etc. - sind bereits geschlechtsneutral.
    Pluralformen: "Die Mitarbeitenden" statt "Die Mitarbeiter "
    Partizip- und Adjektivformen: "herausgegeben von" statt "Herausgeber"
    Jetzt zum generellen gendern:

    Bitte verwende die folgende allgemeine Genderform, am Beispiel erklärt:
    Hier eine Beschreibung der Gendertypen im Singular:
    DoppelNennung: 	Patienten und Patientinnen | Mitarbeiter und Mitarbeiterinnen | Ärzte und Ärztinnen
    BinnenI:Der/Die PatientIn | MitarbeiterIn | ÄrztIn
    Doppelpunkt: Der:Die Patient:in | Der:Die Mitarbeiter:in | Der:Die Arzt/Ärztin
    Schragstrich: Der/Die Patient/in | Der/Die Mitarbeiter/innen | Der/Die Ärzt/in
    Bei Plural wird aus "in" in der Regel "innen".
    Denke bitte immer daran, vor den gegenderten Wörtern in dieser Form beide Artikel vorher zu setzen.
    Wenn es klar ist, dass sich eine Gruppe aus mehreren Geschlechtern zusammen setzt, 
    dann wird die Paarform benutzt, also "Die Mitarbeiter und Mitarbeiterinnen"
    Kontrolliere nun zuerst meinen Text auf korrektes Gendering und liste die Gendering-Fehler in einer kurzen Stichwortartigen Liste auf. Schreibe dazu dann jeweils die Version, wie es korrekt gegendert ist.
    Gender jetzt den folgenden Text und achte darauf, den Gender Typ ${genderType} zu verwenden.
    Bitte füge eine leere Zeile nach der Gendering-Fehlerliste ein.

    Hier der Text:
    ${content}
    `;
  };
  return data(content, genderType);
};

//removeable
const replaceItalics = (text: any) => {
  return text.replace(/\*/g, '\*');
};

export const OpenAIStream = async (
  content: string,
  genderType: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(content, genderType);

  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

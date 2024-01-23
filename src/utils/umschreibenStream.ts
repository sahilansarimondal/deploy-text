import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (content: string, styleValue: string, varianceValue: string) => {
  const data = (content: any, styleValue: any, varianceValue: any) => {
    return endent`
Du hast die Aufgabe einen Text Umzuschreiben. Dabei gibt es 5 verschiedene Stile. Ich werde zuerst die Stile Erklären, dir dann einen Stil zuweisen und die anschließend den Text, welchen du umschreiben sollst geben.

Kinderleicht: Der Text wird so umgeschrieben, dass er keinerlei Fachbegriffe enthält und in einer sehr einfachen, grundlegenden Sprache verfasst ist. Er ist so gestaltet, dass er sogar für Kinder verständlich ist.
Beispiel: Sehr einfache Sätze, begrenzter Wortschatz, keine Fachbegriffe.

Alltagsverständlich: Der Text enthält alltägliche Sprache und ist für die breite Öffentlichkeit verständlich. Es werden minimale Fachbegriffe verwendet, die im Alltag geläufig sind.
Beispiel: Einfache Sätze, leicht erweitertes Vokabular, bekannte Fachbegriffe aus dem Alltag.

Gemäßigt Fachlich: Der Text ist in einem gemäßigt fachlichen Stil verfasst. Er enthält einige Fachbegriffe, aber sie werden erklärt oder in einem Kontext verwendet, der für Nicht-Experten verständlich ist.
Beispiel: Mittlere Satzkomplexität, regelmäßige Verwendung von Fachbegriffen mit Erklärungen.

Fachspezifisch: Der Text verwendet häufig Fachbegriffe und ist für Personen mit Grundkenntnissen in dem betreffenden Gebiet gedacht. Weniger allgemeinverständlich, aber immer noch zugänglich für ein informiertes Publikum.
Beispiel: Komplexe Sätze, umfangreicher Gebrauch von Fachbegriffen, weniger Erklärungen.

Experten-Level: Der Text ist voll von Fachbegriffen und komplexen Konzepten, wie sie in Fachpublikationen oder von Experten auf dem Gebiet verwendet werden. Ideal für Fachleute oder Personen mit tiefgreifendem Verständnis des Themas.
Beispiel: Sehr komplexe Satzstrukturen, umfangreicher und spezialisierter Fachwortschatz, keine Erklärungen für Fachbegriffe.


Schreibe den Text im Stil ${styleValue} um. ${varianceValue}

Hier der Text:
${content}
    `;
  };
  return data(content, styleValue, varianceValue);
};

export const OpenAIStream = async (
  content: string,
  styleValue: string,
  varianceValue: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(content, styleValue, varianceValue);

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

import { EssayBody } from '@/types/types';
import { OpenAIStream } from '@/utils/essayStream';

export const config = {
  runtime: 'experimental-edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { topic, paragraphs, essayType, model, apiKey } =
      (await req.json()) as EssayBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.OPENAI_API_KEY;
    }
    const stream = await OpenAIStream(
      topic,
      essayType,
      paragraphs,
      model,
      apiKeyFinal,
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;

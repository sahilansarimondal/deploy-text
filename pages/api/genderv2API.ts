import { Genderv2Body } from '@/types/types';
import { OpenAIStream } from '@/utils/genderv2Stream';

export const config = {
  runtime: 'experimental-edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { content, genderType, model, apiKey } =
      (await req.json()) as Genderv2Body;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.OPENAI_API_KEY;
    }
    const stream = await OpenAIStream(
      content,
      genderType,
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

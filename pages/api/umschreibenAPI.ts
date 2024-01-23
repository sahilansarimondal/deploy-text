import { UmschreibenBody } from '@/types/types';
import { OpenAIStream } from '@/utils/umschreibenStream';

export const config = {
  runtime: 'experimental-edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { content, styleValue, varianceValue, model, apiKey } =
      (await req.json()) as UmschreibenBody;

    let apiKeyFinal;
    if (apiKey) {
      apiKeyFinal = apiKey;
    } else {
      apiKeyFinal = process.env.OPENAI_API_KEY;
    }
    const stream = await OpenAIStream(
      content,
      styleValue,
      varianceValue,
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

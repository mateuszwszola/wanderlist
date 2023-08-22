import OpenAI from 'openai';
import invariant from 'tiny-invariant';

invariant(process.env.OPENAI_API_KEY, "OPENAI_API_KEY must be set");

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generateCompletion() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Generate a random joke' }],
    model: 'gpt-3.5-turbo',
    temperature: 1,
  });

  return completion.choices;
}
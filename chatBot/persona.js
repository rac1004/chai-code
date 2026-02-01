import 'dotenv/config';
import { OpenAI } from 'openai';

const client = new OpenAI();

async function main() {
  // These api calls are stateless (Zero Shot)
  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
                You are an AI assistant who is Anuj. You are a persona of a developer named
                Anuj who is an amazing developer and codes in Java and Javascipt.

                Characteristics of Anuj
                - Full Name: Anuj Chaurasia
                - Age: 28 Years old
                - Date of birthday: 04th Nov, 1997

                Social Links:
                - LinkedIn URL: https://www.linkedin.com/in/anuj-chaurasia-ac1204/
                - X URL: 

                Examples of text on how Anirudh typically chats or replies:
                - Hey Piyush, Yes
                - This can be done.
                - Sure, I will do this
                
            `,
      },
      { role: 'user', content: 'Hey gpt, My name is Anuj Chaurasia' },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
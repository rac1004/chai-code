// import 'dotenv/config';
// import { OpenAI } from 'openai';

// const client = new OpenAI();

// async function main() {
//   // These api calls are stateless (Chain Of Thought)
//   const SYSTEM_PROMPT = `
//     You are an AI assistant who works on START, THINK and OUTPUT format.
//     For a given user query first think and breakdown the problem into sub problems.
//     You should always keep thinking and thinking before giving the actual output.
//     Also, before outputing the final result to user you must check once if everything is correct.

//     Rules:
//     - Strictly follow the output JSON format
//     - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT.
//     - After evey think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
//     - Always perform only one step at a time and wait for other step.
//     - Alway make sure to do multiple steps of thinking before giving out output.

//     Output JSON Format:
//     { "step": "START | THINK | EVALUATE | OUTPUT", "content": "string" }

//     Example:
//     User: Can you solve 3 + 4 * 10 - 4 * 3
//     ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
//     ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
//     ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" } 
//     ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
//     ASSISTANT: { "step": "EVALUATE", "content": "Alright, Going good" }  
//     ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
//   `;

//   const messages = [
//     {
//       role: 'system',
//       content: SYSTEM_PROMPT,
//     },
//     {
//       role: 'user',
//       content: 'Write a code in JS to find a prime number as fast as possible',
//     },
//   ];

//   while (true) {
//     const response = await client.chat.completions.create({
//       model: 'gpt-4.1-mini',
//       messages: messages,
//     });

//     const rawContent = response.choices[0].message.content;
//     const parsedContent = JSON.parse(rawContent);

//     messages.push({
//       role: 'assistant',
//       content: JSON.stringify(parsedContent),
//     });

//     if (parsedContent.step === 'START') {
//       console.log(`🔥`, parsedContent.content);
//       continue;
//     }

//     if (parsedContent.step === 'THINK') {
//       console.log(`\t🧠`, parsedContent.content);

//       // Todo: Send the messages as history to maybe gemini and ask for a review and append it to history
//       // LLM as a judge techniuqe
//       messages.push({
//         role: 'developer',
//         content: JSON.stringify({
//           step: 'EVALUATE',
//           content: 'Nice, You are going on correct path',
//         }),
//       });

//       continue;
//     }

//     if (parsedContent.step === 'OUTPUT') {
//       console.log(`🤖`, parsedContent.content);
//       break;
//     }
//   }

//   console.log('Done...');
// }

// main();

import 'dotenv/config';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function reviewWithJudge(history) {
  const prompt = `
You are an expert evaluator reviewing an AI's reasoning.

Rules:
- Respond ONLY in strict JSON
- No markdown, no explanations

JSON format:
{ "step": "EVALUATE", "content": "string" }

Conversation:
${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

async function main() {
  const SYSTEM_PROMPT = `
You are an AI assistant that works strictly in steps:
START → THINK → EVALUATE → OUTPUT

Rules:
- Output valid JSON only
- One step at a time
- Wait for EVALUATE after every THINK

Format:
{ "step": "START | THINK | EVALUATE | OUTPUT", "content": "string" }
`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: 'Write a code in JS to find a prime number as fast as possible',
    },
  ];

  while (true) {
    const res = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
    });

    const raw = res.choices[0].message.content;
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('❌ Invalid JSON:', raw);
      break;
    }

    messages.push({
      role: 'assistant',
      content: JSON.stringify(parsed),
    });

    if (parsed.step === 'START') {
      console.log('🔥 START:', parsed.content);
      continue;
    }

    if (parsed.step === 'THINK') {
      console.log('🧠 THINK:', parsed.content);

      const evaluation = await reviewWithJudge(messages);

      messages.push({
        role: 'developer',
        content: JSON.stringify(evaluation),
      });

      console.log('✅ EVALUATE:', evaluation.content);
      continue;
    }

    if (parsed.step === 'OUTPUT') {
      console.log('🤖 OUTPUT:', parsed.content);
      break;
    }
  }

  console.log('✅ Done.');
}

main();

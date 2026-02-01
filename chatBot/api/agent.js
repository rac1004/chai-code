import 'dotenv/config';
import { OpenAI } from 'openai';
import axios from 'axios';
import { exec } from 'child_process';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function executeCommand(cmd = '') {
  return new Promise((res) => {
    exec(cmd, (error, data) => {
      if (error) return res(`Error: ${error.message}`);
      res(data);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({ error: 'userPrompt is required' });
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are a helpful AI agent.' },
        { role: 'user', content: userPrompt },
      ],
    });

    res.status(200).json({
      success: true,
      output: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

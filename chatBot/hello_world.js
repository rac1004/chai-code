import 'dotenv/config';
import { OpenAI} from 'openai';

const client =new OpenAI({
    apiKey: "your gemini api key",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// these api calls are stateless(zero-shot)
async function main(){
 const response = await client.chat.completions.create({
    model:"gemini-3-flash-preview",
       // model: 'gpt-4.1-mini',
        //gpt-5-mini
        messages: [
            {"role": "system", content: `You have to tell me about only on Fitness and Exercise chart, 
                weekly plans on exercise and  not other then this. 
                if someone will ask about other thing then totally denied dont revert on this`},
            {role: 'user', content: 'Hey, GPT my name is anuj ?'},
            {role: 'user', content: 'What is my name ?'}
        ],
    });
    console.log(response.choices[0].message.content);    
}
main(); 

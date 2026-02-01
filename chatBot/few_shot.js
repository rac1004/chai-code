import 'dotenv/config';
import { OpenAI} from 'openai';

const client =new OpenAI();

// these api calls are stateless
async function main(){
 const response = await client.chat.completions.create({
        model: 'gpt-4.1-mini',
        //gpt-5-mini
        messages: [
            {"role": "system", content: `You have to tell me about only on Fitness and Exercise chart, 
                weekly plans on exercise and  not other then this. 
                if someone will ask about other thing then totally denied dont revert on this
                
                Example: 
                Q: Tell me about monday exercise ?
                A: Monday mostly we will go with chest and tricpes. Four exercise in chest and 2 in triceps.

                Q: What exercise I need to do in Leg?
                A: In Leg we can start with squats, then leg press, leg curl , leg externsion, calf raises etc.

                Q: Can I do back exercise with chest ?
                A: Yeah, you can but it's not recommendable pull with push.

                Q: Can you tell me what can i eat today ?
                A: Yes, I can but my work is to guide you on exercise not the diet.
                `},
            {role: 'user', content: 'Hey, GPT my name is anuj ?'},
            {role: 'user', content: 'What is my name ?'},
            {role: 'user', content: 'I was thinking what exercise i will do int the gym today ?'},
        ],
    });
    console.log(response.choices[0].message.content);    
}
main(); 
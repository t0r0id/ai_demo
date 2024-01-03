import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Bedrock } from "langchain/llms/bedrock";
import { ConversationMessageType } from "@/shared/types";
import { checkApiLimit, incrementApiCount } from "@/lib/api-limit";
 
 
const model = new Bedrock({
    model: "anthropic.claude-v2", // You can also do e.g. "anthropic.claude-v2"
    region: "us-east-1",
    // endpointUrl: "custom.amazonaws.com",
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
     },
     modelKwargs: {
      max_tokens_to_sample:15000
      ,temperature:0.1
     },
  });


function getPrompt(messages: ConversationMessageType[]){
    let prompt = "\n\n System: Your name is T0r0!d. You are a code generator. You must respond back only with markdown code snippets. Use code comments next to code for explanation. There should not be any text outside markdown. Do not respond with anything other than code. Politely decline any request that does not involve writing code. \n\n" + messages.map(message => {
        if (message.role === 'user') {
          return `Human: ${message.content}\n\n`;
        } else if (message.role === 'bot') {
          return `Assistant: ${message.content}\n\n`;
        } else {
          return '';
        }
      }).join('') + "Assistant:";
    return prompt;
}


export async function POST(req:Request){
    try{
        const { userId } = auth();
        const body = await req.json();
        const {messages} = body;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!messages){
            return new NextResponse("Missing messages", { status: 400 });
        }
        const freeTrial = await checkApiLimit();
        if (!freeTrial){
          return new NextResponse("You have exceeded the free trial limit. Please upgrade your account.", { status: 403 });
        }
        const prompt = getPrompt(messages);
        const response = await model.predict(prompt);
        await incrementApiCount();
        return NextResponse.json({role:"bot", content:response}, {status: 200});

    } catch (error){
        console.log('[CODE_ERROR]',error)
        return new NextResponse("Internal error", { status: 500 });
    }
}
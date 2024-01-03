import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { random } from "lodash";
import { checkApiLimit, incrementApiCount } from "@/lib/api-limit";
 


export const getImagesFromPrompt = async (prompt: string, value: number, resolution: string) => {
    const brt = new BedrockRuntimeClient({
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        region: 'us-east-1'});

    const commands: InvokeModelCommand[] = Array.from({length: value}, () => new InvokeModelCommand({
        body: JSON.stringify({
            text_prompts: [
                { text: prompt, weight: 1 },
                { text: "poorly rendered", weight: -1 },
                { text: "poor background details", weight: -1 },
                { text: "poorly drawn", weight: -1 },
            ],
            steps: 50, // Number of iterations to generate the image
            cfg_scale: 10, // The creativity of the model
            width: +resolution.split('x')[0],
            height: +resolution.split('x')[1],
            seed: random(0, 10000) // generate a random seed between 0 and 10000
        }),
        modelId: "stability.stable-diffusion-xl-v1", // The model ID
        contentType: "application/json",
        accept: "application/json"
    }));
    
    const responses = await Promise.all(commands.map(command => brt.send(command)));


    const textDecoder = new TextDecoder("utf-8");
    const image_buffers = responses.map(response => {
      const jsonString = textDecoder.decode(response.body.buffer);

      const output = JSON.parse(jsonString);

      return output.artifacts[0].base64;
    });

    const data = image_buffers[0].replace(/^data:image\/\w+;base64,/, "");

    return image_buffers;
}





export async function POST(req:Request){
    try{
        const { userId } = auth();
        
        const body = await req.json();
        const {prompt, amount = 1, resolution = "512x512"} = body;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!prompt){
            return new NextResponse("Missing prompt", { status: 400 });
        }
        const freeTrial = await checkApiLimit();
        if (!freeTrial){
          return new NextResponse("You have exceeded the free trial limit. Please upgrade your account.", { status: 403 });
        }
        const image_buffers = await getImagesFromPrompt(prompt, amount, resolution);
        await incrementApiCount();
        return NextResponse.json({images: image_buffers}, {status: 200});

    } catch (error){
        console.log('[IMAGE_ERROR]',error)
        return new NextResponse("Internal error", { status: 500 });
    }
}
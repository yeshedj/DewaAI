import { NextResponse } from 'next/server';
import Together from "together-ai";

const systemPrompt = `
You are MindfulAI, an AI assistant focused on mental health. Your job is to help users with tips and advice on improving their mood and mental health in connection with Buddhist teachings and mantra. Here’s how you should assist users:

1. Greet users and understand their needs.
2. Offer the Dalai Lama, Rinchope, and other religious leader's teachings and sayings.
3. Offer tips and guidance on how to improve mental health for daily life with mantras/prayers/teachings
4. Answer common questions about Buddhist teachings for healing and relaxing the mind
5. Offer information on Buddhist traditional/medicinal treatments
6. Maintain a positive, supportive tone to encourage healthy behaviors and moods
7. Make sure to offer resources like YouTube videos and articles.

Focus on clear, concise, and helpful responses.

`;


export async function POST(req) {
  try {
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });

    const data = await req.json(); 

    const completion = await together.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    });

    const content = completion.choices[0]?.message?.content.trim();
    const formattedContent = content.replace(/\\n/g, '\n');
    
    return NextResponse.json({ content: formattedContent });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
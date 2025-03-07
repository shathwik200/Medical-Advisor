import { body, validationResult } from 'express-validator';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const userMessage = req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a medical advisor. Provide helpful and accurate medical advice based on the user's input. Always remind users to consult a healthcare professional for serious concerns." },
                { role: "user", content: userMessage }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1
        });

        res.json({ response: chatCompletion.choices[0]?.message?.content || 'I am here to provide general medical advice. For serious concerns, please consult a healthcare professional.' });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

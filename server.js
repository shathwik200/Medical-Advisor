import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Groq from 'groq-sdk';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/chat', [
    body('message').trim().escape().notEmpty().withMessage('Message is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userMessage = req.body.message;
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
});

const PORT = process.env.PORT || 5000; // Allow port to be configurable via environment variables
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

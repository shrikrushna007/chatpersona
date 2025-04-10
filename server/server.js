import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 5000;

// Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAnPrpumDs-PjZKRN2gqMhxMvtZVoUB28g");

app.use(cors());
app.use(express.json());

let chatHistory = [];

app.post('/api/chat', async (req, res) => {
  const { persona, message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Append user's message
    chatHistory.push({
      role: 'user',
      parts: [{ text: `As ${persona}, ${message}` }]
    });

    const result = await model.generateContent({
      contents: chatHistory,
    });

    const response = result.response.text();

    // Append bot's response
    chatHistory.push({
      role: 'model',
      parts: [{ text: response }]
    });

    res.json({ response });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Failed to get response from Gemini API.' });
  }
});

app.post('/api/reset', (req, res) => {
  chatHistory = [];
  res.json({ message: 'Chat reset successful.' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = 3000;


app.use(cors()); 
app.use(express.json());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post('/summarize', async (req, res) => {
  const { text, mode } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided.' });
  }

  let prompt = '';

  switch (mode) {
    case 'child':
      prompt = `Summarize the following text in a simple way that a young child could understand:\n\n${text}`;
      break;
    case 'detailed':
      prompt = `Provide a detailed summary of the following text:\n\n${text}`;
      break;
    case 'bullet':
      prompt = `Summarize the following text using concise bullet points:\n\n${text}`;
      break;
    case 'simple':
      prompt = `Summarize the following text simply and clearly:\n\n${text}`;
      break;
    case 'technical':
      prompt = `Summarize the following text using technical language appropriate for experts:\n\n${text}`;
      break;
    case 'funny':
      prompt = `Summarize the following text with humor and wit:\n\n${text}`;
      break;
    case 'formal':
      prompt = `Summarize the following text in a formal and professional tone:\n\n${text}`;
      break;
    case 'poetic':
      prompt = `Summarize the following text poetically, using expressive language:\n\n${text}`;
      break;
    case 'story':
      prompt = `Summarize the following text as a short engaging story:\n\n${text}`;
      break;
    case 'best':
    default:
      prompt = `Summarize this text as clearly and accurately as possible:\n\n${text}`;
      break;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800, 
    });    

    const summary = completion.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to summarize text.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
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
    prompt = `Explain the following text in a super simple and friendly way, like you're talking to a 6-year-old:\n\n${text}`;
    break;
  case 'detailed':
    prompt = `Write a thorough and comprehensive summary of the following text. Include all key points, important details, and supporting ideas:\n\n${text}`;
    break;
  case 'bullet':
    prompt = `Summarize the following text using short, clear bullet points. Highlight the most important facts and main ideas:\n\n${text}`;
    break;
  case 'simple':
    prompt = `Write a clear and easy-to-understand summary of the following text using plain language:\n\n${text}`;
    break;
  case 'technical':
    prompt = `Summarize the following text using technical terminology and formal phrasing suitable for a professional or academic audience in the relevant field:\n\n${text}`;
    break;
  case 'funny':
    prompt = `Create a funny and witty summary of the following text. Use clever humor, jokes, or sarcasm where appropriate:\n\n${text}`;
    break;
  case 'formal':
    prompt = `Provide a formal and professional summary of the following text, suitable for business or academic use:\n\n${text}`;
    break;
  case 'poetic':
    prompt = `Summarize the following text in a poetic and artistic way, using expressive language, metaphors, or rhythm:\n\n${text}`;
    break;
  case 'story':
    prompt = `Turn the following text into a short, engaging story with a beginning, middle, and end. Make it entertaining but still faithful to the main points:\n\n${text}`;
    break;
  case 'best':
  default:
    prompt = `Summarize the following text as accurately, clearly, and naturally as possible. Focus on clarity, balance, and relevance:\n\n${text}`;
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

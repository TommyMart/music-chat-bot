const express = require('express');
const OpenAI = require('openai'); // Ensure you're using the correct version
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key directly
const openai = new OpenAI({
  organization: 'org-MAhDwIILgeL56i5hrHTPOsmz',
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from the environment variable
});

const MAX_CHARACTER_LIMIT = 300; // Set your desired character limit

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Call OpenAI API without streaming
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model
      messages: [
        { 
          role: 'system', 
          content: "Your purpose is to help Gen Z learn to produce electronic music with Ableton live. You can assume they have limited music theory knowledge and aim to make genres such as techno, electro, drum and bass, and house. Please communicate like you are Gen Z." 
        },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
    });

    // Log the response to see its structure
    console.log('OpenAI Response:', response);

    // Ensure response.choices exists and grab the first choice
    if (response && response.choices && response.choices.length > 0) {
      const reply = response.choices[0].message.content; // Adjust this line based on the actual response structure

      // Check if the reply exceeds the character limit
      if (reply.length > MAX_CHARACTER_LIMIT) {
        res.json({ response: reply.slice(0, MAX_CHARACTER_LIMIT) });
      } else {
        res.json({ response: reply });
      }
    } else {
      res.status(400).json({ error: 'No response from OpenAI' });
    }

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

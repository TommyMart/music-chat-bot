const express = require('express');
const OpenAI = require('openai'); // Adjust import for v4.x
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key directly
const openai = new OpenAI({
  organization: 'org-MAhDwIILgeL56i5hrHTPOsmz',
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARACTER_LIMIT = 300; // Set your desired character limit

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  let accumulatedReply = ''; // Initialize the accumulated reply

  try {
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
      stream: true // Enable streaming
    });

    // Handle the streaming response
    response.on('data', (data) => {
      const messagePart = data.choices[0].delta.content || ''; // Get the content part of the streamed response

      // Accumulate the reply
      accumulatedReply += messagePart;

      // Check if the accumulated reply exceeds the character limit
      if (accumulatedReply.length > MAX_CHARACTER_LIMIT) {
        // Trim to the maximum character limit
        accumulatedReply = accumulatedReply.slice(0, MAX_CHARACTER_LIMIT);
        
        // Optionally send the accumulated reply back to the client
        res.json({ response: accumulatedReply });
        response.destroy(); // Stop streaming
      }

      // Log the current part
      console.log('Streaming Response:', accumulatedReply);
    });

    response.on('end', () => {
      // Final processing when streaming ends
      console.log('Final Reply:', accumulatedReply);
      // Send the final accumulated reply to the client
      res.json({ response: accumulatedReply });
    });

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

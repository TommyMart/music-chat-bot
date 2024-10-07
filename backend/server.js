const express = require('express');
const OpenAI = require('openai'); // Ensure you're using the correct version
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key directly
const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from the environment variable
});

const MAX_CHARACTER_LIMIT = 5000; // Set your desired character limit

app.post('/api/chat', async (req, res) => {
  const { message, messages, name, age, experienceLevel, genre, method, currentModel } = req.body;
//   console.log(currentModel, "currentModel")
const MAX_MESSAGES = 5;
const newMessage = { role: 'user', content: message };
const fullMessages = [
  {
    role: 'system',
    content: `Please help ${name === '' ? 'user' : name}, get better at producing electronic ${genre} music using ${method}. They have ${experienceLevel} experience level. Please communicate like you are age ${age}.`
  },
  ...messages.slice[-MAX_MESSAGES], // Previous messages
  newMessage // Add the new user message
];
  try {
    // Call OpenAI API without streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4o", //`${currentModel}`, // Model from client
      messages: fullMessages,
      max_tokens: 400,
      
    });

    // Log the response to see its structure
    // console.log('OpenAI Response:', response);

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

app.get('/api/models', async (req, res) => {
    try {
        // Fetch available models using the correct method for v4 API
        const response = await openai.models.list(); 
        
        // Assuming response.data contains the models
        console.log(response.data); // Log the actual models data
        
        res.json({
            models: response.data // Ensure to return models as an array
        });
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Failed to retrieve models' });
    }
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

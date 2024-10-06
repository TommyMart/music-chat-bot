import './normal.css';
import './App.css';
import robot from './assets/robot2.png';
import record from './assets/record.png'
import { useState, useEffect } from 'react';
// use effect runs once when app loads


function App() {

  useEffect(() => {
    getEngines();
    
  }, [])

  const EXPERIENCE_LEVELS = [ 'beginner', 'intermediate', 'advanced' ]

  const [messages, setMessages] = useState([]); // State for chat messages
  const [input, setInput] = useState(''); // State for input text
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
  const [experienceLevel, setExperienceLevel] = useState('');

  function clearChat() {
    setMessages([]);
  } 

  function getEngines() {
    fetch("http://localhost:5001/api/models")
        .then(res => res.json())
        .then(data => {
            console.log("Fetched models data:", data); // Log the entire response
            console.log("Models array:", data.models); // Log the models specifically
            setModels(data.models.data); // Ensure this is an array
        })
        .catch(err => console.error("Error fetching models:", err));
}
  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return; // Prevent empty messages

    // Add user's message to chat log
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);

    // Send message to backend
    const response = await fetch('http://localhost:5001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input, currentModel }),
    });

    const data = await response.json();

    // Add bot's response to chat log
    setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    setInput(''); // Clear input after sending
  };

  return (
    <div className='App'>
      
      <aside className='sideMenu'>
      <img src={robot} alt='record' className='logo-record' />
      
        <div className='side-menu-btn' onClick={clearChat}>
        <div className='expLevel'>
        <select onChange={(e) => setExperienceLevel(e.target.value)} value={experienceLevel}>
        <option value="" disabled>Select your experience level</option>
        {EXPERIENCE_LEVELS.map((level, index) => (
          <option key={index} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
          </select>

        </div>
          <div className='models'>
          <select onChange={(e) => {
              setCurrentModel(e.target.value);
          }}>
              {Array.isArray(models) && models.length > 0 ? (
                  models.map((model, index) => (
                      <option key={index} value={model.id}>
                          {model.id}
                      </option>
                  ))
              ) : (
                  <option disabled>No models available</option>
              )}
          </select>
            
          </div>
          <span>+</span>
          New Chat
        </div>

      </aside>

      <section className='chatbox'>
        <div className='chat-log'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === 'bot' ? 'chat-bot' : ''}`}
            >
              <div className='chat-message-center'>
                <div className={`avatar ${msg.sender === 'bot' ? 'chat-bot' : ''}`}>
                  {msg.sender === 'bot' ? (
                    <img src={robot} alt='AI Bot' className='robot' />
                    
                  ) : (
                    <img src={record} alt='AI Bot' className='user-avatar' />
                  )}
                </div>

                <div className='message'>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='chat-input-textarea'
              placeholder='Type your question here...'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevent a new line from being added
                  handleSubmit(e); // Call the submit handler
                }
              }}
            />
            <button type='submit' className='send-btn'>
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;

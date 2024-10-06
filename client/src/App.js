import './normal.css';
import './App.css';
import robot from './assets/robot2.png';
import record from './assets/record.png'
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]); // State for chat messages
  const [input, setInput] = useState(''); // State for input text

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
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    // Add bot's response to chat log
    setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    setInput(''); // Clear input after sending
  };

  return (
    <div className='App'>
      
      <aside className='sideMenu'>
      <img src={record} alt='record' className='logo-record' />
        <div className='side-menu-btn'>
          
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

import './normal.css';
import './App.css';
import robot from './assets/robot2.png';
import record from './assets/record.png'
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';



function App() {

  useEffect(() => {
    getEngines();
    
  }, [])

  // useEffect(() => {
  //   setMessages("Hi, and welcome to Electronic Music Tutorial! Please select your experience and what you'd like to make from the left hand drop downs menus before we get started.")
  //   setAge('')
  // }, [])

  const EXPERIENCE_LEVELS = [ 'beginner', 'intermediate', 'advanced' ]
  const GENRES = [ 'Deep House', 'Techno', 'Electro', 'Breaks', 'Dub', 'Beats', 'Drum & Bass']
  const METHODS = [ 'Ableton', 'Logic Pro', 'FL Studio', 'Hardware', 'Eurorack', 'MPC', 'Elektron' ]
  const AGES = [ '15 or younger', '16 to 20', '21 to 28', '29 to 35', '36 and older']
  const TUTORIALS = [ 'Drums', 'Bass', 'Chords', 'Leads', 'Breaks', 'FXs', 'Mixing', 'Mastering' ]

  const [messages, setMessages] = useState([
    { text: "Hi, and welcome to Electronic Music Tutorial! Please select your experience level and what genre you'd like to make from the left-hand drop-down menu before getting started. Type ready to begin!", sender: 'bot' }
  ]); 
  const [input, setInput] = useState(''); 
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("gpt-4o");
  const [experienceLevel, setExperienceLevel] = useState('');
  const [genre, setGenre] = useState('');
  const [method, setMethod] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorial, setTutorial] = useState('');
  

  // New messages display in screen above text-input-holder
  const chatLogRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatLogRef.current) {
      setTimeout(() => {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      }, 100); // Short delay to ensure the content is rendered
    }
  };

  // Function for new chat 
  function clearChat() {
    setMessages([]);
  } 

  // Function to get all the OpenAI models for selection
  function getEngines() {
    fetch("http://localhost:5001/api/models")
        .then(res => res.json())
        .then(data => {
            console.log("Fetched models data:", data); 
            console.log("Models array:", data.models); 
            setModels(data.models.data); 
        })
        .catch(err => console.error("Error fetching models:", err));
}
  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return; // Prevent empty messages

    const API_URL = process.env.NODE_ENV === 'production'
      ? 'https://shielded-waters-45389-481cac9f7ffe.herokuapp.com'
      : 'http://localhost:5001';

    // Add user's message to messages state
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setLoading(true); // Disables user submit

    // Send message to backend
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input, messages, name, age, experienceLevel, genre, method, tutorial, currentModel }),
    });

    const data = await response.json();

    // Add bot's response to messages state
    setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    setInput(''); // Clear input after sending
    setLoading(false); // Enables user submit

    
  };

  return (
    <div className='App'>
      
      <aside className='sideMenu'>
      
      <img src={robot} alt='record' className='logo-record' />
      <h1 className='header'>ELECTRONIC MUSIC TUTORIAL</h1>
      
      <div className='sideBtnContainer'>
        <div className='side-menu-btn' onClick={clearChat}>
        
          <span>+</span>
          New Chat
        </div>
        </div>
        <div className='sideBtnContainer'>
        <div className='side-menu-btn' >
        
        <input 
        typeof='text'
        placeholder='Enter Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='name-input'
        ></input>
        </div>
        </div>
        <div className='expLevel'>
      
        <select onChange={(e) => setAge(e.target.value)} value={age}>
        <option value="" disabled>Age</option>
        {AGES.map((age, index) => (
          <option key={index} value={age}>
            {age.charAt(0).toUpperCase() + age.slice(1)}
          </option>
        ))}
          </select>

        </div>

        <div className='expLevel'>
      
        <select onChange={(e) => setExperienceLevel(e.target.value)} value={experienceLevel}>
        <option value="" disabled>Level</option>
        {EXPERIENCE_LEVELS.map((level, index) => (
          <option key={index} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
          </select>

        </div>
        
        <div className='expLevel'>
      
        <select onChange={(e) => setGenre(e.target.value)} value={genre}>
        <option value="" disabled>Genre</option>
        {GENRES.map((genre, index) => (
          <option key={index} value={genre}>
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </option>
        ))}
          </select>

        </div>
        <div className='expLevel'>
      
        <select onChange={(e) => setMethod(e.target.value)} value={method}>
        <option value="" disabled>Method</option>
        {METHODS.map((method, index) => (
          <option key={index} value={method}>
            {method.charAt(0).toUpperCase() + method.slice(1)}
          </option>
        ))}
          </select>

        </div>

        <div className='expLevel'>
      
        <select onChange={(e) => setMethod(e.target.value)} value={tutorial}>
        <option value="" disabled>Tutorial</option>
        {TUTORIALS.map((tutorial, index) => (
          <option key={index} value={tutorial}>
            {tutorial.charAt(0).toUpperCase() + tutorial.slice(1)}
          </option>
        ))}
          </select>

        </div>

          {/* <div className='models'>
          
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
            
          </div> */}

      </aside>


      <section className='chatbox'>
        <div className='chat-log' ref={chatLogRef}>
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
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            {loading ? ( 
              <textarea
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='chat-input-textarea'
                placeholder={'Type your question here...'}
                disabled
              />
            ) : (
              <textarea
                rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='chat-input-textarea'
                placeholder='Type your question here...'
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); 
                    handleSubmit(e); 
                  }
                }}
              />
            )}
            <button type='submit' className='send-btn'>
              Submit!
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;

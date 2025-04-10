// App.jsx
import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [persona, setPersona] = useState('');
  const [inputPersona, setInputPersona] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const startChat = () => {
    if (!inputPersona.trim()) return;
    setPersona(inputPersona.trim());
  };

  const sendMessage = async () => {
    if (!message.trim() || !persona) return;

    const userMsg = message.trim();
    setChat((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, message: userMsg }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: 'bot', text: 'Server error.' }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = async () => {
    await fetch('http://localhost:5000/api/reset', { method: 'POST' });
    setChat([]);
    setPersona('');
    setInputPersona('');
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  return (
    <div className="app">
      <div className="header">
        🤖 Role Chatbot
        {persona && (
          <button onClick={resetChat} className="reset-btn">
            Reset
          </button>
        )}
      </div>

      {!persona && (
        <div className="persona-input">
          <input
            type="text"
            placeholder="Start chatting as (e.g., Sherlock Holmes)..."
            value={inputPersona}
            onChange={(e) => setInputPersona(e.target.value)}
          />
          <button onClick={startChat} className="start-chat-btn">
            Start Chat
          </button>
        </div>
      )}

      {persona && (
        <>
          <div className="chat-window">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot">Typing<span className="dots">...</span></div>
            )}
            <div ref={chatRef}></div>
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

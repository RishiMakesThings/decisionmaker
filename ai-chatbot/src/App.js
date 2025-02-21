import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('What can you do??!?!!');
  const [loading, setLoading] = useState(false);

  /*
  && (
            <div class="rhombus">
            <div class="circle1"></div>
            <div class="circle2"></div>
        </div>
          )

  */

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        console.log(input)
        const response = await axios.post("https://decisionbot.netlify.app/.netlify/functions/generateResponse", { input });
        console.log("response", response);
        const botResponse = response.data.response;
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-red-950 to-blue-900">
      <h1 className="mb-8 font-bold text-[3rem] drop-shadow-lg text-blue-50">💜 Rhea DecisionMaker9000  💜</h1>
      <div className="bg-white w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.user ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`rounded-lg p-2 shadow-md overflow-x-hidden flex flex-wrap ${msg.user ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="loading-hearts">
              <span className="heart">♥</span>
              <span className="heart">♥</span>
              <span className="heart">♥</span>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Ask about a choice!"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleSendMessage}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
      <h2 className="absolute bottom-1 mt-2 text-[10px] text-blue-50">
  The DecisionMaker9000 is extremely powerful and should only be used when your local Rishi is not available. Terms and conditions apply.
</h2>
    </div>
  );
}

export default App;

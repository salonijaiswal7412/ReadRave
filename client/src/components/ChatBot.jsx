import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';



const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/start');
      const data = await response.json();
      
      if (data.success) {
        setMessages([{
          id: 1,
          text: data.response,
          sender: 'bot'
        }]);
      }
    } catch (error) {
      console.error('Start conversation error:', error);
      setMessages([{
        id: 1,
        text: "Hi! I'm here to help you find great books. What are you looking for?",
        sender: 'bot'
      }]);
    }
  };

  const parseBookRecommendations = (text) => {
    // Try to parse JSON format first
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const books = JSON.parse(jsonMatch[0]);
        if (Array.isArray(books) && books.length > 0) {
          return books;
        }
      }
    } catch (e) {
      // If JSON parsing fails, continue with text parsing
    }

    // Parse text format
    const books = [];
    const lines = text.split('\n');
    let currentBook = {};

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Look for title patterns
      const titleMatch = line.match(/^\d+\.\s*[*"']?([^*"']+)[*"']?\s*by\s+([^-]+)/i) ||
                        line.match(/^[*•-]\s*[*"']?([^*"']+)[*"']?\s*by\s+([^-]+)/i) ||
                        line.match(/^Title:\s*[*"']?([^*"']+)[*"']?/i);
      
      const authorMatch = line.match(/^Author:\s*([^-]+)/i) ||
                         line.match(/by\s+([^-\n]+)/i);
      
      const descMatch = line.match(/^(?:Description|Summary|Reason):\s*(.+)/i);

      if (titleMatch) {
        if (currentBook.title) {
          books.push({ ...currentBook });
          currentBook = {};
        }
        currentBook.title = titleMatch[1].trim();
        if (titleMatch[2]) {
          currentBook.author = titleMatch[2].trim().replace(/[-–—].*$/, '').trim();
        }
      } else if (authorMatch && !currentBook.author) {
        currentBook.author = authorMatch[1].trim().replace(/[-–—].*$/, '').trim();
      } else if (descMatch) {
        currentBook.description = descMatch[1].trim();
      } else if (line.includes('**') || line.includes('*')) {
        // Handle bold formatted titles
        const boldMatch = line.match(/\*\*([^*]+)\*\*/);
        if (boldMatch && !currentBook.title) {
          currentBook.title = boldMatch[1].trim();
        }
      } else if (currentBook.title && !currentBook.description && line.length > 20) {
        // Likely a description
        currentBook.description = line.replace(/^[-–—]\s*/, '').trim();
      }
    }

    if (currentBook.title) {
      books.push(currentBook);
    }

    return books.length > 0 ? books : null;
  };

  const getBookEmoji = (index) => {
    const emojis = ['📖', '📚', '📕', '📗', '📘', '📙', '📔'];
    return emojis[index % emojis.length];
  };

  const formatMessage = (text) => {
    const books = parseBookRecommendations(text);
    
    if (books && books.length > 0) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
           
            <p className="text-pink-800 text-md font-semibold">Here's what I'm recommending for you:</p>
            
          </div>
          
          {books.map((book, index) => (
            <div key={index} className="relative">
            
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#d91c7d] rounded-l-lg shadow-sm"></div>
              
              <div className="bg-white rounded-lg ml-2 p-4 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 ">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#d91c7d] rounded-full flex items-center justify-center shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-300">
                      <span className="text-4xl text-white font-bold m-auto">{getBookEmoji(index)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0">
                      <h3 className="text-xl font-bold text-[#d91c7d] leading-tight pr-2">
                        {book.title || 'Untitled'}
                      </h3>
                      
                    </div>
                    
                    {book.author && (
                      <div className="flex items-center space-x-2 mb-3">
                        
                        <p className="text-base font-semibold text-gray-500">
                          -{book.author}
                        </p>
                      </div>
                    )}
                    
                    {book.description && (
                      <div className="bgwhite bg-opacity-60 rounded-lg p-3 border border-pink-200 ">
                        <p className="text-sm text-pink-800 leading-relaxed italic">
                          "{book.description}"
                        </p>
                      </div>
                    )}
                    
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-1 pb-2 text-gray-500">
            Ready to explore these amazing books?
          </div>
        </div> 
      );
    }

    return (
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    );
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.map(m => `${m.sender === 'user' ? 'User' : 'Bot'}: ${m.text}`)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.error || "Sorry, something went wrong. Please try again.",
          sender: 'bot'
        }]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: 'bot'
      }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className=" mx-auto p-4 w-[80%]  mt-6">
      <Navbar/>
   
      <div className="mt-6 bg-white rounded-xl overflow-hidden shadow-[0_0_1rem] shadow-gray-400 border border-pink-200">
        {/* Header */}
        <div className="bg-[#d91c7d] text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">ReadRave Buddy</h2>
              <p className="text-sm text-pink-100">Finding your next perfect read! </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 bg-pink-100 overflow-y-auto p-4 space-y-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%]`}>
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-sm">🤖</span>
                  </div>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg shadow-md ${
                    message.sender === 'user'
                      ? 'bg-[#d91c7d] text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-pink-200 rounded-bl-md'
                  }`}
                >
                  {message.sender === 'bot' ? formatMessage(message.text) : (
                    <p className="leading-relaxed">{message.text}</p>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-sm">👤</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg rounded-bl-md shadow-md border border-pink-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-pink-700">Finding perfect reads...</span>
                    <span className="text-sm">🔍</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-2 border-t border-pink-200 bg-[#d91c7d] ">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for book recommendations..."
              className="flex-1 px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-white focus:border-white text-blue-400 bg-white"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-white to-pink-600 text-[#d91c7d] font-bold  px-4 py-2 rounded-full disabled:opacity-70 transition-all duration-200 shadow-[0_0_0.3rem] shadow-gray-600 hover:shadow-[0_0_0.7rem]  flex items-center space-x-1 cursor-pointer"
            >
              <span>Send</span>
              
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
import React, { useState, useRef, useEffect } from 'react';
import startIcon from '../assets/images/start.svg';
import { ArrowUp, Mic } from 'lucide-react';
import PoweredBy from './PoweredBy';

const ChatMessages = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [language, setLanguage] = useState('en');  // Default language is English
    const messagesEndRef = useRef(null);
    const serverUrl = 'https://leapthelimit-1057493174729.me-west1.run.app';

    const scrollToBottom = () => {
        if (messages?.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(scrollToBottom, [messages]);

    // Function to detect language based on input text
    const detectLanguage = (text) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        const hebrewRegex = /[\u0590-\u05FF]/;
        if (arabicRegex.test(text)) {
            return 'ar';
        } else if (hebrewRegex.test(text)) {
            return 'he';
        } else {
            return 'en';  // Default to English
        }
    };

    // Function to send message to the chat API and update the state with the response
    const handleSend = async () => {
        if (inputMessage.trim()) {
            const newUserMessage = { text: inputMessage, sender: 'user' };
            setMessages([...messages, newUserMessage]);
            setInputMessage('');

            // Detect language of the message
            const detectedLanguage = detectLanguage(inputMessage);
            setLanguage(detectedLanguage);  // Set language state based on detection

            try {
                // Send the user message to the chat API
                const response = await fetch(`${serverUrl}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: inputMessage,
                        language: detectedLanguage,  // Pass the detected language to the API
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const newFinlixMessage = { text: data.response, sender: 'Finlix' };
                setMessages((prevMessages) => [...prevMessages, newFinlixMessage]);

                // Save user message to the chat history
                await fetch(`${serverUrl}/save-chat-message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: inputMessage,  // User message
                        category: 'user',  // User category
                    }),
                });

                // Save bot response to the chat history
                await fetch(`${serverUrl}/save-chat-message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: data.response,  // Bot response
                        category: 'bot',  // Bot category
                    }),
                });

            } catch (error) {
                console.error('Error in chat API:', error);
                const errorMessage = { text: 'There was an error processing your request.', sender: 'Finlix' };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col md:h-full h-full bg-black text-white items-center">
            <div className='mb-3'>
                <PoweredBy />
            </div>
            <div className="overflow-y-auto scrollbar-none w-full h-[450px] md:h-[450px]">
                <div className="space-y-2 overflow-y-auto scrollbar-none h-[450px] md:h-[450px] md:pb-4 relative z-[10]">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'Finlix' && (
                                <div className="w-10 me-2">
                                    <img src={startIcon} alt='startIcon' />
                                </div>
                            )}
                            <div className={`rounded-xl px-4 py-2 max-w-[80%] font-medium ${message.sender === 'user' ? 'bg-[#C736D9] text-white rounded-br-none' : 'bg-[#E9E9EB] text-black my-2'
                                }`}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} className='h-[50px]' />
                </div>
            </div>
            <div className="fixed z-20 md:relative bottom-[130px] md:bottom-0 left-0 right-0 w-[85%] md:w-full mx-auto flex items-center bg-white rounded-xl p-1">
                <div className="flex-1 flex items-center">
                    <button className="p-2">
                        <Mic color='#828282' />
                    </button>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message..."
                        className="bg-transparent outline-none p-1 text-[#828282] text-sm flex-1"
                    />
                </div>
                {inputMessage.trim() && (
                    <button className="bg-black rounded-full p-1" onClick={handleSend}>
                        <ArrowUp />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatMessages;

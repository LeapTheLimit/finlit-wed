import React, { useState, useRef, useEffect } from 'react';
import startIcon from '../assets/images/start.svg';
import { ArrowUp, Mic } from 'lucide-react';
import PoweredBy from './PoweredBy';
import Header from './Header';  // Importing the Header component
import PromptSuggestions from './PromptSuggestions';  // Correct import statement

const ChatMessages = ({ pastConversation = [], setCurrentView, isHistory = false }) => {
    const [messages, setMessages] = useState(pastConversation || []);  // Initialize with pastConversation if provided
    const [inputMessage, setInputMessage] = useState('');
    const [listening, setListening] = useState(false);  // Track if the mic is listening
    const [showSuggestions, setShowSuggestions] = useState(!pastConversation.length); // Show suggestions only if there are no past messages
    const messagesEndRef = useRef(null);
    const serverUrl = 'https://leapthelimit-1057493174729.me-west1.run.app';

    // Scroll to the latest message
    const scrollToBottom = () => {
        if (messages?.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(scrollToBottom, [messages]);

    // Detect language based on the input text
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

    // Send message to the server and update state with the response
    const handleSend = async () => {
        if (inputMessage.trim()) {
            const newUserMessage = { text: inputMessage, sender: 'user' };
            setMessages([...messages, newUserMessage]);
            setInputMessage('');
            setShowSuggestions(false);  // Hide suggestions after the first message

            const detectedLanguage = detectLanguage(inputMessage);  // Detect language

            try {
                // Send user message to API
                const response = await fetch(`${serverUrl}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: inputMessage,
                        language: detectedLanguage,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const newFinlixMessage = { text: data.response, sender: 'Finlix' };
                setMessages((prevMessages) => [...prevMessages, newFinlixMessage]);

                // Save the entire conversation (user + bot)
                await fetch(`${serverUrl}/save-chat-message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversation: [
                            { message: inputMessage, category: 'user' },
                            { message: data.response, category: 'bot' },
                        ],
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

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        setShowSuggestions(false);  // Hide suggestions when a suggestion is clicked
    };

    // Speech recognition function
    const startSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error(`Speech recognition error: ${event.error}`);
            alert('An error occurred with speech recognition: ' + event.error);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
        setListening(true);
    };

    return (
        <div className="flex flex-col md:h-full h-full bg-black text-white items-center">
            {/* Show header when in past conversation view */}
            {isHistory && <Header setCurrentView={setCurrentView} />}
            <div className='mb-3'>
                <PoweredBy />
            </div>
            <div className="overflow-y-auto scrollbar-none w-full h-[450px] md:h-[450px]">
                {/* Show suggestions only if there are no messages yet */}
                {showSuggestions && messages.length === 0 && (
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">Suggestions:</h3>
                        <PromptSuggestions onSelectPrompt={handleSuggestionClick} />
                    </div>
                )}
                <div className="space-y-2 overflow-y-auto scrollbar-none h-[450px] md:h-[450px] md:pb-4 relative z-[10]">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'Finlix' && (
                                <div className="w-10 me-2">
                                    <img src={startIcon} alt='startIcon' />
                                </div>
                            )}
                            <div className={`rounded-lg px-3 py-2 max-w-[75%] font-medium ${message.sender === 'user' ? 'bg-[#C736D9] text-white rounded-br-none' : 'bg-[#E9E9EB] text-black my-1 rounded-bl-none'
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
                    <button className="p-2" onClick={startSpeechRecognition}>
                        {listening ? (
                            <Mic color='#C736D9' />  // Change color while listening
                        ) : (
                            <Mic color='#828282' />
                        )}
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

import React, { useState, useEffect, useRef } from 'react';
import { AudioLines, Globe, Keyboard, MicIcon } from 'lucide-react';
import Header from './Header';
import TimedAnimatedCircles from './TimedAnimatedCircles';
import micBg from '../assets/images/circleDiv.svg';

const VoiceChat = ({ setCurrentView }) => {
    const [speaking, setSpeaking] = useState(false);
    const [spokenText, setSpokenText] = useState('');
    const [showLanguages, setShowLanguages] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('EN');
    const [botResponse, setBotResponse] = useState('What do you know about Finance?');
    const [responseWords, setResponseWords] = useState([]);  
    const [currentWordIndex, setCurrentWordIndex] = useState(0); 
    const [audioPlaying, setAudioPlaying] = useState(false);
    const recognitionRef = useRef(null); 
    const audioInstanceRef = useRef(null); 
    const serverUrl = 'https://leapthelimit-1057493174729.me-west1.run.app'; 
    const wordsPerBatch = 7;  
    const responseUpdateInterval = 2500;  

    // Set up speech recognition (webkitSpeechRecognition for Chrome)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = selectedLanguage === 'EN' ? 'en-US' : selectedLanguage === 'عر' ? 'ar-SA' : 'he-IL';

            recognition.onstart = () => {
                if (audioInstanceRef.current) {
                    audioInstanceRef.current.pause();
                    audioInstanceRef.current = null;
                }
                setSpeaking(true);
                setBotResponse('Listening...');
                document.querySelectorAll('.circle').forEach(circle => {
                    circle.classList.add('circle-listening');
                });
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event);
                setBotResponse('Error occurred while listening.');
                document.querySelectorAll('.circle').forEach(circle => {
                    circle.classList.remove('circle-listening');
                });
                setSpeaking(false);
            };

            recognition.onend = () => {
                setBotResponse('Generating...');
                document.querySelectorAll('.circle').forEach(circle => {
                    circle.classList.remove('circle-listening');
                });
                setSpeaking(false);
            };

            recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                setSpokenText(transcript);
                setBotResponse('');
                await handleUserMessage(transcript);
            };

            recognitionRef.current = recognition;
        } else {
            alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
        }
    }, [selectedLanguage]);

    const startListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            setBotResponse('Listening...');
        }
    };

    const toggleSpeaking = () => {
        setSpeaking(!speaking);
        if (!speaking) setSpokenText('');
    };

    // Fix for missing function: toggleLanguages
    const toggleLanguages = () => {
        setShowLanguages(!showLanguages);
    };

    const getLanguageCode = () => {
        switch (selectedLanguage) {
            case 'EN': return 'en';
            case 'عر': return 'ar';
            case 'עב': return 'he';
            default: return 'en';
        }
    };

    const handleUserMessage = async (message) => {
        try {
            const chatResponse = await fetch(`${serverUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, language: getLanguageCode() })
            });
            const chatData = await chatResponse.json();
            const botReply = chatData.response;

            await fetch(`${serverUrl}/save-chat-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message, category: 'user'
                })
            });

            await fetch(`${serverUrl}/save-chat-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: botReply, category: 'bot'
                })
            });

            const ttsResponse = await fetch(`${serverUrl}/synthesize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: botReply, language_code: getLanguageCode() })
            });
            const ttsData = await ttsResponse.json();
            const audioContent = ttsData.audioContent;

            setResponseWords(botReply.split(' '));  
            setCurrentWordIndex(0);  

            if (audioInstanceRef.current) {
                audioInstanceRef.current.pause();
            }
            audioInstanceRef.current = new Audio(`data:audio/mp3;base64,${audioContent}`);
            audioInstanceRef.current.play();
        } catch (error) {
            console.error('Error handling user message:', error);
            setBotResponse('Error occurred while processing your message.');
        }
    };

    useEffect(() => {
        if (responseWords.length > 0 && currentWordIndex < responseWords.length) {
            const timer = setTimeout(() => {
                const wordsToShow = responseWords.slice(currentWordIndex, currentWordIndex + wordsPerBatch).join(' ');
                setBotResponse(wordsToShow); 
                setCurrentWordIndex((prevIndex) => prevIndex + wordsPerBatch);
            }, responseUpdateInterval);

            return () => clearTimeout(timer);
        }
    }, [currentWordIndex, responseWords]);

    return (
        <>
            <Header setCurrentView={setCurrentView} />
            <div className="bg-black h-full w-full flex flex-col items-center justify-start text-white relative overflow-hidden">
                <div className='h-[50%] w-full flex justify-center items-center'>
                    <TimedAnimatedCircles isListening={speaking || audioPlaying} />
                </div>

                <div className='h-[40%] flex items-center justify-center'>
                    <p className="text-2xl font-medium mb-4 px-4 text-center">
                        {botResponse.split(' ').map((word, index) => (
                            <span key={index} className='text-white'>{word} </span>
                        ))}
                    </p>
                </div>

                <div className="absolute bottom-14 left-0 right-0 flex justify-between items-center px-4">
                    <div className="flex space-x-4">
                        <button className="p-2 rounded-full bg-[#272626]">
                            <Keyboard />
                        </button>
                    </div>
                    <button onClick={startListening} className="p-4 rounded-full" style={{ background: `url(${micBg})`, backgroundSize: 'cover' }}>
                        {speaking ? <AudioLines size={30} /> : <MicIcon size={30} />}
                    </button>
                    <div className="relative">
                        <button onClick={toggleLanguages} className="p-2 rounded-full bg-[#272626]">
                            <Globe size={24} />
                        </button>
                        {showLanguages && (
                            <div className="absolute bottom-full right-1 mb-2 flex flex-col space-y-2">
                                {['עב', 'عر', 'EN'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className={`p-2 rounded-full text-xs flex items-center justify-center ${selectedLanguage === lang ? 'bg-purple-600' : 'bg-[#272626]'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VoiceChat;

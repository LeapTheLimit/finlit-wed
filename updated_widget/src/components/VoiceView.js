import React, { useState, useEffect, useRef } from 'react';
import { Mic, AudioLines } from 'lucide-react';
import PoweredBy from '../components/PoweredBy';
import Header from './Header';
import TimedAnimatedCircles from './TimedAnimatedCircles';

const VoiceView = ({ setCurrentView }) => {
    const [isListening, setIsListening] = useState(false); // State to track if mic is listening
    const [recognizedText, setRecognizedText] = useState(''); // Store recognized speech text
    const [synthesizing, setSynthesizing] = useState(false); // Track if the app is synthesizing speech
    const recognitionRef = useRef(null);
    const [audio, setAudio] = useState(null); // State to store and control audio
    const serverUrl = 'https://leapthelimit-1057493174729.me-west1.run.app'; // API base URL

    // SpeechRecognition initialization
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSpeechRecognitionSupported = !!SpeechRecognition;

    useEffect(() => {
        if (isSpeechRecognitionSupported) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US'; // Default language is English, can be changed dynamically

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setRecognizedText(transcript);
                console.log('Recognized text:', transcript);
                handleSendToAPI(transcript); // Send recognized text to API
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event);
                alert(`Speech recognition error: ${event.error}`);
                setIsListening(false);
            };

            recognition.onend = () => {
                console.log('Speech recognition stopped');
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn('Speech Recognition API is not supported in this browser.');
        }
    }, [isSpeechRecognitionSupported]);

    // Function to send recognized speech to the chat API and get response
    const handleSendToAPI = async (text) => {
        try {
            const response = await fetch(`${serverUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    language: 'en', // Default to English, you can change this based on detected language
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const apiResponseText = data.response;
            synthesizeSpeech(apiResponseText); // Call the synthesize API for speech response
        } catch (error) {
            console.error('Error in chat API:', error);
            alert('Error processing your request.');
        }
    };

    // Function to call the /synthesize API and play the audio response
    const synthesizeSpeech = async (text) => {
        setSynthesizing(true); // Indicate that speech synthesis is in progress
        try {
            const response = await fetch(`${serverUrl}/synthesize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    language_code: 'en', // You can dynamically set this based on the language
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const audioContent = data.audioContent;
            const newAudio = new Audio(`data:audio/mp3;base64,${audioContent}`);

            if (audio) {
                audio.pause(); // Stop any currently playing audio
            }

            setAudio(newAudio); // Set the new audio
            newAudio.play();

            newAudio.onended = () => {
                setSynthesizing(false); // Reset state when audio finishes playing
            };
        } catch (error) {
            console.error('Error in speech synthesis API:', error);
            alert('Error in speech synthesis. Please try again later.');
        }
    };

    const toggleListening = () => {
        if (!isSpeechRecognitionSupported) {
            alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop(); // Stop listening
        } else {
            setRecognizedText(''); // Clear previous text
            recognitionRef.current.start(); // Start listening
        }
        setIsListening(!isListening);
    };

    return (
        <div className="flex-1 flex flex-col">
            <Header setCurrentView={setCurrentView} />
            <div className="flex-1 flex flex-col items-center justify-center">
                <TimedAnimatedCircles isListening={isListening || synthesizing} />
                <p className="text-3xl font-bold mb-12 text-center">
                    {recognizedText || 'Click the mic and speak...'}
                </p>
                <button
                    className={`bg-purple-500 p-6 rounded-full ${isListening ? 'animate-pulse' : ''}`}
                    onClick={toggleListening}  // Toggle listening on click
                >
                    {isListening ? <AudioLines size={32} /> : <Mic size={32} />}
                </button>
            </div>
            <PoweredBy />
        </div>
    );
};

export default VoiceView;

import React, { useState, useEffect } from 'react';
import micIcon from '../assets/images/mic.svg';
import chatIcon from '../assets/images/chat.svg';
import gameIcon from '../assets/images/game.svg';

export const getIcon = (type) => {
    switch (type) {
        case 'voice':
            return <img src={micIcon} alt="Mic Icon" />;
        case 'chat':
            return <img src={chatIcon} alt="Chat Icon" />;
        case 'game':
            return <img src={gameIcon} alt="Game Icon" />;
        default:
            return <img src={micIcon} alt="Mic Icon" />;
    }
};

export default function History({ setCurrentView }) {
    const [historyItems, setHistoryItems] = useState([]);

    // Function to group the conversations into pairs of (user + bot)
    const groupConversations = (history) => {
        const conversations = [];
        let currentConversation = { userMessage: '', botResponse: '' };

        history.forEach((message) => {
            if (message.category === 'user') {
                // If it's a user message, set it in the current conversation
                currentConversation.userMessage = message.message;
            } else if (message.category === 'bot') {
                // If it's a bot message, pair it with the user message
                currentConversation.botResponse = message.message;

                // Push the conversation pair to the list
                conversations.push(currentConversation);

                // Reset for the next conversation
                currentConversation = { userMessage: '', botResponse: '' };
            }
        });

        return conversations;
    };

    // Fetch the chat history from the backend API
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch('https://leapthelimit-1057493174729.me-west1.run.app/chat-history');
                if (!response.ok) {
                    throw new Error('Failed to fetch chat history');
                }
                
                const data = await response.json();
                console.log('API Response Data:', data); // Log the data to understand its structure

                // Extract the history array from the response object
                const { history } = data;
                
                if (Array.isArray(history)) {
                    // Group the messages into conversations
                    const conversations = groupConversations(history);

                    // Create summarized history items
                    const summarizedHistory = conversations.map((conversation, index) => {
                        const summary = conversation.userMessage || 'Conversation summary not available';
                        return {
                            type: 'chat', // or 'voice' depending on how you categorize it
                            text: `Conversation about: ${summary.substring(0, 50)}...`, // First 50 characters of the user's message
                        };
                    });

                    setHistoryItems(summarizedHistory);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-md font-medium">History</h2>
                <button onClick={() => setCurrentView('history_list')} className="text-gray-400 text-sm">See all</button>
            </div>
            <div className="space-y-2">
                {historyItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="bg-zinc-800 p-3 rounded-lg flex items-center justify-start space-x-3">
                        {getIcon(item.type)}
                        <span className="text-gray-300 text-xs">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

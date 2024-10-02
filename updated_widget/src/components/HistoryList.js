import React, { useState, useEffect } from 'react';
import { getIcon } from './History';
import Header from './Header';

const HistoryList = ({ setCurrentView }) => {
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
                console.log('API Response Data:', data);

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

    // Render the grouped history items
    return (
        <div>
            <Header setCurrentView={setCurrentView} isHistory={true} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-medium">Messages History</h2>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[630px] mb-12 scrollbar-none">
                {historyItems.map((item, index) => (
                    <button
                        key={index}
                        className="bg-[#272727] p-3 rounded-2xl flex items-center justify-start space-x-3 w-full"
                    >
                        {getIcon(item.type)}
                        <span className="text-gray-300 text-xs">{item.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;

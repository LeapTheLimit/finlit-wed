import React, { useState, useEffect } from 'react';
import { getIcon } from './History';
import Header from './Header';

// Function to format the date as "YYYY-MM-DD HH"
const formatDateToHour = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
};

const HistoryList = ({ setCurrentView, setConversation }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [conversations, setConversations] = useState([]);  // Store conversations separately

  // Function to group the conversations by hour
  const groupConversationsByHour = (history) => {
    const grouped = {};
    history.forEach((message) => {
      const hour = formatDateToHour(message.timestamp);
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(message);
    });

    return Object.entries(grouped).map(([time, messages]) => ({
      time,
      messages,
    }));
  };

  // Fetch the chat history from the backend API
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          'https://leapthelimit-1057493174729.me-west1.run.app/chat-history'
        );
        if (!response.ok) throw new Error('Failed to fetch chat history');

        const data = await response.json();
        const { history } = data;

        if (Array.isArray(history)) {
          const groupedConversations = groupConversationsByHour(history);

          const summarizedHistory = groupedConversations.map(
            (conversationBlock, index) => {
              const summary =
                conversationBlock.messages[0].message ||
                'Conversation summary not available';
              return {
                type: 'chat',
                text: `Conversation at: ${conversationBlock.time}`,
                conversation: conversationBlock.messages,
              };
            }
          );

          setConversations(groupedConversations);  // Store full conversations
          setHistoryItems(summarizedHistory);  // Store summarized items
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  // Handle clicking a past conversation
  const handleConversationClick = (index) => {
    const selectedConversation = conversations[index];
    if (selectedConversation) {
      // Pass selected conversation to App.js and switch to chat view
      setConversation(
        selectedConversation.messages.map((msg) => ({
          text: msg.message,
          sender: msg.category === 'user' ? 'user' : 'Finlix',
        }))
      );
      setCurrentView('chat');
    }
  };

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
            onClick={() => handleConversationClick(index)}  // Handle click
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

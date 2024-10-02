import React from 'react';
import { MessageCircle } from 'lucide-react';

const MessageInput = ({ inputText, setInputText, handleSendMessage }) => (
    <div className="p-4 flex">
        <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-black p-3 rounded-l-lg"
            placeholder="Type your message..."
        />
        <button
            onClick={handleSendMessage}
            className="bg-purple-500 p-3 rounded-r-lg"
        >
            <MessageCircle size={24} />
        </button>
    </div>
);

export default MessageInput;

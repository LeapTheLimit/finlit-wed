import React from 'react';
import ChatMessages from '../components/ChatMessages';
import Header from './Header';

const TextView = ({ messages, setCurrentView }) => (
    <div className="flex-1 flex flex-col">
        <Header setCurrentView={setCurrentView} />
        <ChatMessages messages={messages} />
    </div>
);

export default TextView;

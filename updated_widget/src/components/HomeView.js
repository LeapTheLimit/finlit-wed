import React from 'react';
import PoweredBy from '../components/PoweredBy';
import HomeButtons from '../components/HomeButtons';
import Header from './Header';
import History from './History';

const HomeView = ({ setCurrentView }) => (
    <div className="flex-1 flex flex-col h-full justify-between">
        <Header setCurrentView={setCurrentView} path={'welcome'} />
        <div className='overflow-y-auto max-h-[80%] scrollbar-none flex flex-col h-full justify-between'>
            <h2 className="text-3xl md:text-xl font-medium mb-4">How may I help you today!</h2>
            <HomeButtons setCurrentView={setCurrentView} />
            {/* History */}
            <History setCurrentView={setCurrentView} />
        </div>

        {/* Footer */}
        <div className='text-center mt-10'>
            <PoweredBy />
        </div>
    </div>
);

export default HomeView;

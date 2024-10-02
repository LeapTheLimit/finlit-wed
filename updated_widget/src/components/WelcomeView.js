import React from 'react';
import startIcon from '../assets/images/start.svg';
import LogoPoweredBy from './LogoPoweredBy';

const WelcomeView = ({ setCurrentView }) => (
    <div className="flex-1 flex flex-col items-center justify-between px-2 py-3 gap-2 min-h-full overflow-y-auto">
        <LogoPoweredBy />
        <div className="flex-1 flex flex-col items-center justify-evenly gap-5 md:justify-center md:my-5 h-[30%]">
            <div className="md:my-2 flex flex-col gap-2 items-center">
                <p className="text-white text-sm pb-4 text-center">Your AI Finance Buddy</p>

                <img
                    src={startIcon}
                    alt="loading"
                    className="sm:h-[100px] md:h-40 w-auto"
                />
            </div>
            <h1 className="text-3xl md:text-2xl font-medium text-center my-5 w-[90%] flex items-center">
                Hey there! I&apos;m Finlix!
            </h1>
        </div>
        <button
            className="bg-white text-black px-4 py-3 rounded-xl text-base font-medium w-[90%]"
            onClick={() => setCurrentView('home')}
        >
            Get Started
        </button>
    </div>
);

export default WelcomeView;

import { useState } from 'react';

const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSwitcher = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative flex items-center justify-center h-screen">
            {/* Globe Icon */}
            <div
                onClick={toggleSwitcher}
                className="cursor-pointer bg-gray-800 p-4 rounded-full"
            >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {/* Simple globe icon */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6h3v-2h-2zm-4 8.5l1.5-1.5V12H7v2h1.5v2zm6.5-2V12h-1.5v3.5l-1.5-1.5V10h-3v4l-1.5 1.5V18h3v-2h3v-1.5z" />
                </svg>
            </div>

            {/* Language Circles */}
            {isOpen && (
                <div className="absolute top-0 flex space-x-6 mt-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
                    <div className="w-16 h-16 bg-blue-300 rounded-full"></div>
                    <div className="w-16 h-16 bg-green-400 rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;

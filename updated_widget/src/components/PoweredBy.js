import React from 'react';

const PoweredBy = () => {
    const handleNavigate = () => {
        window.open('https://leapthelimit.com/', '_blank');
    };

    return (
        <div className="text-gray-500 text-xs cursor-pointer" onClick={handleNavigate}>
            Powered by LeapTheLimit
        </div>
    )
};

export default PoweredBy;

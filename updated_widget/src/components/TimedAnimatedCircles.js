import React, { useState, useEffect } from 'react';
import '../App.css'
const TimedAnimatedCircles = ({ isListening = false }) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (isListening) {
            setIsAnimating(true)
        } else {
            setIsAnimating(false)
        }
    }, [isListening])

    return (
        <>
            {
                isAnimating ?
                    <div className="shape-container">
                        <div className="shape">
                            <div className={`circle purple-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle blue-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle green-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle gray-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                    </div> :
                    <div className="shape-container">
                        <div className="shape">
                            <div className={`circle purple-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle blue-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle green-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                        <div className="shape">
                            <div className={`circle gray-circle ${isAnimating ? 'circle-listening' : ''}`} aria-hidden="true"></div>
                        </div>
                    </div>
            }
        </>


    );
};

export default TimedAnimatedCircles;

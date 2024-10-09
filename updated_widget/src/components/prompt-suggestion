import React from 'react';

const PromptSuggestions = ({ onSelectPrompt }) => {
    const suggestions = [
        "What is a savings account?",
        "How can I save money?",
        "What is a budget?",
        "What are the best financial practices?",
        "How do I plan for retirement?",
        "Explain compound interest.",
        "How can I invest in stocks?",
        "Tell me more about cryptocurrencies.",
        "What is financial freedom?",
        "How do I create a personal budget?"
    ];

    // Randomly pick 3 suggestions each time
    const randomSuggestions = suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);

    return (
        <div className="space-y-2">
            {randomSuggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onSelectPrompt(suggestion)}
                    className="bg-[#C736D9] text-white px-4 py-2 rounded-lg w-full text-sm"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};

export default PromptSuggestions;

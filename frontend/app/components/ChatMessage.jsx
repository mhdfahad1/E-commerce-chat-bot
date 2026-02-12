import React from 'react';

/**
 * Renders a single chat message bubble (user or bot).
 */
export default function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`chatbot-message ${isUser ? 'chatbot-message-user' : 'chatbot-message-bot'} ${message.isError ? 'chatbot-message-error' : ''}`}>
            <div className="chatbot-message-bubble">
                {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

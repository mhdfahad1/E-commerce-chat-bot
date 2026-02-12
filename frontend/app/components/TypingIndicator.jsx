/**
 * Animated "Bot is typing…" indicator.
 */
export default function TypingIndicator() {
    return (
        <div className="chatbot-message chatbot-message-bot">
            <div className="chatbot-typing-indicator">
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
                <span className="chatbot-typing-dot" />
            </div>
        </div>
    );
}

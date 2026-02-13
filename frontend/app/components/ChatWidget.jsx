'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './ChatWidget.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(API_URL, "api url");

/**
 * Generate a UUID v4 for session tracking.
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Get or create a persistent session ID in localStorage.
 */
function getSessionId() {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('chatbot_session_id');
    if (!id) {
        id = generateUUID();
        localStorage.setItem('chatbot_session_id', id);
    }
    return id;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimerRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    /**
     * Send the message to the backend API using axios.
     */
    const sendMessageToAPI = useCallback(async (messageText) => {
        const sessionId = getSessionId();

        try {
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: messageText,
                sessionId
            });

            return response.data.reply;
        } catch (error) {
            console.error('Chat API error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Server error';
            throw new Error(errorMessage);
        }
    }, []);


    /**
     * Handle message submission with 300ms debounce.
     */
    const handleSend = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || isSending) return;

        // Clear any pending debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Debounce: wait 300ms before actually sending
        debounceTimerRef.current = setTimeout(async () => {
            setIsSending(true);

            // Immediately show user message in chat
            const userMessage = { role: 'user', text: trimmed, id: Date.now() };
            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            setIsTyping(true);

            try {
                const reply = await sendMessageToAPI(trimmed);
                const botMessage = { role: 'bot', text: reply, id: Date.now() + 1 };
                setMessages((prev) => [...prev, botMessage]);
            } catch {
                const errorMessage = {
                    role: 'bot',
                    text: 'Sorry, something went wrong. Please try again.',
                    id: Date.now() + 1,
                    isError: true,
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsTyping(false);
                setIsSending(false);
            }
        }, 300);
    }, [input, isSending, sendMessageToAPI]);

    /**
     * Handle Enter key press.
     */
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const toggleChat = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return (
        <>
            {/* Floating chat button */}
            <button
                className="chatbot-toggle-btn"
                onClick={toggleChat}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className="chatbot-panel">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <span className="chatbot-header-dot" />
                            <h3>Store Assistant</h3>
                        </div>
                        <button className="chatbot-close-btn" onClick={toggleChat}>
                            ✕
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="chatbot-messages">
                        {messages.length === 0 && (
                            <div className="chatbot-welcome">
                                <p>👋 Hi! I&apos;m your shopping assistant.</p>
                                <p>Ask me about products, prices, or orders!</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="chatbot-input-area">
                        <input
                            ref={inputRef}
                            type="text"
                            className="chatbot-input"
                            placeholder="Type a message…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isSending}
                        />
                        <button
                            className="chatbot-send-btn"
                            onClick={handleSend}
                            disabled={!input.trim() || isSending}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

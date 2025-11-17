import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../../services/authService'; // We will use our secure axios client
import './Chatbot.css';

const SYSTEM_INSTRUCTION = `You are "Ayuzen Assist", a friendly and helpful AI assistant for the Ayuzen Clinic, a healthcare platform in Lucknow. Your primary goal is to answer patient questions about the clinic's services, doctors, and general health topics.
You MUST follow these rules:
1.  **NEVER provide a medical diagnosis, treatment advice, or interpret medical results.** This is for real doctors only.
2.  If a user asks for a diagnosis or medical advice (e.g., "I have a bad cough, what should I do?"), you MUST politely decline and recommend they book an appointment with a doctor through the platform.
3.  Be polite, empathetic, and professional.
4.  You can answer general health knowledge questions (e.g., "What is a cardiologist?"), but always add a disclaimer that this is not medical advice.
5.  If you don't know an answer, say so. Do not make up information about the clinic.`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'model', text: 'Hi! I am Ayuzen Assist. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // --- THIS IS THE FIX ---
            // 1. The API key is GONE.
            // 2. The URL now points to our OWN backend.
            const apiUrl = '/chat'; 
            
            const apiMessages = messages.map(msg => ({
                role: msg.sender,
                parts: [{ text: msg.text }]
            }));
            apiMessages.push({ role: 'user', parts: [{ text: input }] });

            const payload = {
                contents: apiMessages,
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }
            };

            // 3. We use our 'apiClient' which already has the user's auth token.
            const response = await apiClient.post(apiUrl, payload);
            
            // The response.data from our backend is the full JSON response from Gemini
            const modelResponse = response.data.candidates[0].content.parts[0].text;
            
            setMessages(prev => [...prev, { sender: 'model', text: modelResponse }]);
        
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { sender: 'model', text: 'Sorry, I seem to be having trouble right now. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* ... The rest of your JSX (chat window, icon) remains exactly the same ... */}
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <header className="chat-header">
                    <h2>Ayuzen Assist</h2>
                    <button onClick={() => setIsOpen(false)}>&times;</button>
                </header>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message model typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>Send</button>
                </form>
            </div>

            <button className="chat-icon-button" onClick={() => setIsOpen(!isOpen)} aria-label="Open chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
        </div>
    );
};

export default Chatbot;
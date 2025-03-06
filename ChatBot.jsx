import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";
import { FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
    const [input, setInput] = useState("");  
    const [messages, setMessages] = useState([]);  
    const chatBoxRef = useRef(null); 

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const apiKey = "AIzaSyBwcsjRgKXXT-H6ARPRX0J3sNg6Kz-8j8o";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            
            const res = await axios.post(url, {
                contents: [{ parts: [{ text: input }] }] 
            });

            console.log("API Response:", res.data);

            const botResponse = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot";

            const cleanedResponse = botResponse.replace(/\*/g, "");
            
            const responsePoints = botResponse.split("\n").filter(line => line.trim() !== "");
            
            const botMessages = responsePoints.map(point => ({ sender: "bot", text: point }));

            setMessages((prevMessages) => [...prevMessages, ...botMessages]);

        } 
           catch (error) {
            console.error("Error fetching response:", error);
        }

        setInput("");
    };

    useEffect(() => {
        chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
                <div ref={chatBoxRef}></div>
            </div>
            <div className="chat-input">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;

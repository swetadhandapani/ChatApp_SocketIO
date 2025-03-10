import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const backEndUrl = "http://localhost:8000";

const Chat = () => {
    const [user, setUser] = useState("");
    const [room, setRoom] = useState("");
    const [socket, setSocket] = useState(null);
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState("");
    const messagesEndRef = useRef(null); // Ref to track message container end

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const name = searchParams.get("name")?.trim() || "Anonymous";
        const roomParam = searchParams.get("room")?.trim() || "General";

        setUser(name);
        setRoom(roomParam);

        const newSocket = io(backEndUrl, { transports: ["websocket"], reconnection: true });

        newSocket.on("connect", () => {
            newSocket.emit("joinRoom", { name, room: roomParam }, (response) => {
                if (response?.error) {
                    console.error("Join Room Error:", response.error);
                } else {
                    console.log("Joined Room Successfully");
                }
            });
        });

        newSocket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
            setTypingUser("");
        });

        newSocket.on("typing", (typingName) => {
            if (typingName !== name) {
                setTypingUser(`${typingName} is typing...`);
                setTimeout(() => setTypingUser(""), 2000);
            }
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!msg.trim()) return;

        const timestamp = new Date().toLocaleTimeString();
        socket.emit("sendMsg", { user, text: msg, timestamp }, () => setMsg(""));
    };

    const handleTyping = () => {
        socket.emit("typing", user);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", padding: "10px", borderRadius: "8px", fontFamily: "Arial, sans-serif", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
            {/* Room Name */}
            <h2 style={{ textAlign: "center", backgroundColor: "#007bff", color: "white", padding: "10px", borderRadius: "5px 5px 0 0", margin: "0" }}>
                Room: {room}
            </h2>

            {/* Messages Container */}
            <div style={{ height: "300px", overflowY: "auto", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "0 0 5px 5px", display: "flex", flexDirection: "column" }}>
                {messages.map((message, idx) => {
                    const isUserMessage = message.user.toLowerCase() === user.toLowerCase();

                    return (
                        <div key={idx} style={{
                            display: "flex",
                            justifyContent: isUserMessage ? "flex-end" : "flex-start",
                            marginBottom: "10px"
                        }}>
                            <div style={{
                                maxWidth: "70%",
                                padding: "10px",
                                borderRadius: "10px",
                                backgroundColor: isUserMessage ? "#007bff" : "#ddd",
                                color: isUserMessage ? "white" : "black",
                                textAlign: "left",
                                alignSelf: isUserMessage ? "flex-end" : "flex-start",
                            }}>
                                <strong>{isUserMessage ? "You" : message.user}</strong>: {message.text}
                                <div style={{ fontSize: "0.8em", color: "gray", textAlign: "right" }}>{message.timestamp}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUser && <p style={{ color: "gray", fontSize: "0.9em", textAlign: "left", padding: "5px" }}>{typingUser}</p>}

            {/* Input Field and Send Button */}
            <div style={{ display: "flex", marginTop: "10px" }}>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={handleTyping}
                    style={{ flex: "1", padding: "10px", border: "1px solid #ccc", borderRadius: "4px 0 0 4px", outline: "none" }}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} style={{ padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "0 4px 4px 0", cursor: "pointer" }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;

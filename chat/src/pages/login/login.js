import React, { useState } from "react";
import { Link } from "react-router-dom";
const Login = () => {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div
      style={{
        background: "#214a80",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "30px",
          borderRadius: "10px",
          background: "#fff",
          width: "350px",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#214a80", marginBottom: "20px" }}>Join Chat</h2>
        <form>
          <div style={{ marginBottom: "15px" }}>
            <input
              onChange={(e) => setUser(e.target.value)}
              type="text"
              name="username"
              placeholder="Username"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              name="room"
              placeholder="Room"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>
          <Link onClick={(e) => (!user || !room ? e.preventDefault() : null)} to={`/chat?name=${user}&room=${room}`}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                background: "#214a80",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#1a3a66")}
              onMouseOut={(e) => (e.target.style.background = "#214a80")}
            >
              Join Room
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

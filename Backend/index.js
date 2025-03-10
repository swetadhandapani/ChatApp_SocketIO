const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./entity');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.get('/', (req, res) => {
    res.json("API is working");
});

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // Handle user joining a room
    socket.on("joinRoom", ({ name, room }, callback) => {
        if (!name || !room) {
            return callback?.({ error: "Name and Room are required" });
        }

        const { user, error } = addUser(socket.id, name, room);
        if (error) {
            return callback?.({ error });
        }

        socket.join(user.room);
        socket.emit("message", { user: "admin", text: `Welcome ${user.name} to room ${user.room}` });
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} has joined!` });
        io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });

        callback?.();
    });

    // Handle user sending a message
    socket.on("sendMsg", ({ text, timestamp }, callback) => {
        const user = getUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", { user: user.name, text, timestamp });
            callback?.();
        }
    });

    // Handle typing event
    socket.on("typing", (name) => {
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.room).emit("typing", name);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", { user: "admin", text: `${user.name} has left the chat.` });
            io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
        }
        console.log("User Disconnected:", socket.id);
    });
});

server.listen(8000, () => console.log("Server started on port 8000"));

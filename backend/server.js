require('dotenv').config();

const app = require('./src/app');

const connectDB = require('./src/config/db');

const http = require('http');

const { Server } = require('socket.io');

connectDB();

const server = http.createServer(app);

const io = new Server(server, {

    cors: {
        origin: "*"
    }

});

global.io = io;

io.on('connection', (socket) => {

    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {

        console.log('User disconnected');

    });

});

server.listen(3000, () => {

    console.log('Server is running on port 3000');

});
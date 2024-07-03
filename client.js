const express = require('express');
const {Server} = require('socket.io');
const ioClient = require('socket.io-client');

const app = express();
const port = 3001;

const server = app.listen(port, () => {
    console.log(`Server1 is running on port ${port}`);
});

const io = new Server(server, {
    path: '/socket',
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

const server2Socket = ioClient.connect('http://localhost:3002', {
    reconnection: true,
    path: '/socket'
});

io.on('connection', (socket) => {
    console.log('Client connected to Server1:', socket.id);

    socket.on('toFirstServer', (data) => {
        console.log('Received data from Server3:', data);
    });

    socket.on('message', (data) => {
        console.log('Received message from client:', data);
        server2Socket.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from Server1:', socket.id);
    });
});

server2Socket.on('connect', () => {
    console.log('Connected to Server2');
});

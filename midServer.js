const express = require('express');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');

const app = express();
const port = 3002;

const server = app.listen(port, () => {
    console.log(`Server2 is running on port ${port}`);
});

const io = new Server(server, {
    path: '/socket',
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

const server3Socket = ioClient.connect('http://localhost:3003', {
    reconnection: true,
    path: '/socket'
});

io.on('connection', (socket) => {
    console.log('Client connected to Server2:', socket.id);

    socket.on('message', (data) => {
        setTimeout(function() {
            console.log('translating....');
        }, 2000);

        const translatedMessage = translateWord(data);
        server3Socket.emit('translatedMessage', { id: socket.id, message: translatedMessage });

        setTimeout(function() {
            console.log('done !');
        }, 2500);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from Server2:', socket.id);
    });
});

server3Socket.on('connect', () => {
    console.log('Connected to Server3');
});

server3Socket.on('error', (error) => {
    console.error('Server3 connection error:', error);
});

function translateWord(word) {
    switch (word.toLowerCase()) {
        case 'apple':
            return 'سیب';
        case 'banana':
            return 'موز';
        case 'orange':
            return 'پرتقال';
        case 'carrot':
            return 'هویج';
        case 'dog':
            return 'سگ';
        case 'cat':
            return 'گربه';
        case 'house':
            return 'خانه';
        case 'book':
            return 'کتاب';
        case 'computer':
            return 'کامپیوتر';
        case 'phone':
            return 'تلفن';
        case 'chair':
            return 'صندلی';
        case 'table':
            return 'میز';
        case 'pen':
            return 'قلم';
        case 'pencil':
            return 'مداد';
        case 'school':
            return 'مدرسه';
        case 'student':
            return 'دانش‌آموز';
        case 'teacher':
            return 'معلم';
        case 'friend':
            return 'دوست';
        case 'family':
            return 'خانواده';
        case 'food':
            return 'غذا';
        case 'water':
            return 'آب';
        case 'sun':
            return 'خورشید';
        case 'moon':
            return 'ماه';
        case 'star':
            return 'ستاره';
        case 'flower':
            return 'گل';
        case 'tree':
            return 'درخت';
        case 'sky':
            return 'آسمان';
        case 'earth':
            return 'زمین';
        case 'fire':
            return 'آتش';
        case 'snow':
            return 'برف';
        default:
            return 'ترجمه موجود نیست';
    }
}

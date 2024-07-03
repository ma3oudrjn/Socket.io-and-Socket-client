const express = require('express');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const mongoose = require('mongoose');
const Message = require('./model/message'); // Ensure the path is correct
const swaggerDocs = require('./swagger/index');
const app = express();
const port = 3003;
const host = "localhost";
let final_message;

const server1Socket = ioClient.connect('http://localhost:3001', {
    reconnection: true,
    path: '/socket'
});

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const server = app.listen(port, () => {
    console.log(`Server3 is running on port ${port}`);
    swaggerDocs(app, port, host)

});

const io = new Server(server, {
    path: '/socket',
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('Client connected to Server3:', socket.id);

    socket.on('translatedMessage', (translatedData) => {
        console.log('Received translated message from Server2:', translatedData);

        server1Socket.emit('toFirstServer', translatedData.message);

        const message = new Message({
            userId: translatedData.id,
            message: translatedData.message,
        });

        message.save()
            .then(savedMessage => {
                console.log('Message saved in MongoDB:', savedMessage);
                final_message = savedMessage;
            })
            .catch(err => {
                console.error('Error saving message:', err);
            });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from Server3:', socket.id);
    });
});

app.get('/messages',async (req, res) => {
    try{
        const messages = await Message.find({});
        res.status(201).json(messages);
    }catch(err){
        res.status(500).send(err)
    }

})


app.get('/messages/get/:id',async (req, res) => {
    try{
        const userId = req.params.id;
        const messages = await Message.find({userId});
        res.status(201).json(messages);
    }catch(err){
        res.status(500).send(err)
    }

})
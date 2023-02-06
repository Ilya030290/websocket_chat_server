const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const getConnectionToMongoDB = require('./helpers/connectToMongoDB');
require('dotenv').config({ path: './.env' });
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const { addUser, getUser, removeUser } = require('./helpers/functions');
const authRouter = require('./routes/auth');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

getConnectionToMongoDB();

app.use(authRouter);

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`);
  Chat.find().then((result) => {
    socket.emit('output-chats', result);
  });

  socket.on('create-chat', (name) => {
    const chat = new Chat({ name });
    chat.save().then((result) => {
      io.emit('chat-created', result);
    });
  });

  socket.on('join', ({ name, chat_id, user_id }) => {
    const { error, user } = addUser({
      socket_id: socket.id,
      name: name,
      user_id: user_id,
      chat_id: chat_id,
    });
    socket.join(chat_id);
    if (error) {
      console.log('join error', error);
    } else {
      console.log('join user ', user);
    }
  });

  socket.on('sendMessage', (message, chat_id, callback) => {
    const user = getUser(socket.id);
    const messageToStore = {
      name: user.name,
      user_id: user.user_id,
      chat_id,
      text: message,
    };
    const msg = new Message(messageToStore);
    msg.save().then((result) => {
      io.to(chat_id).emit('message', result);
      callback();
    });
  });

  socket.on('get-messages-history', (chat_id) => {
    Message.find({ chat_id }).then((result) => {
      socket.emit('output-messages', result);
    });
  });

  socket.on('delete-chat', (chat_id) => {
    Chat.findByIdAndRemove(chat_id).then(() => {
      Chat.find().then((result) => {
        socket.emit('output-chats', result);
      });
    });
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server start on port: ${process.env.PORT}`);
});

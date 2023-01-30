const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;

const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/realtimechatapp')
const messageSchema = new mongoose.Schema({ 
  id: { type: String, required: true },
  message: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
  // status: { type: 'SENDING' | 'SENT' | 'RECEIVED', required: true },
  uid: { type: String, required: true } 
});
const Message = mongoose.model('Message', messageSchema); 
module.exports = Message
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/realtimechatapp')
const messageSchema = new mongoose.Schema({ 
  image: { type: String, required: true },
  name: { type: String, required: true },
  timmer: { type: Number, required: true },
  acceptedOn: { type: Number },
  playOn: { type: Number },
  buyerNotification: { type: String },
  sellerNotification: { type: String }
});
const Product = mongoose.model('Product', messageSchema); 
module.exports = Product
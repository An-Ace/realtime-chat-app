const amqp = require('amqplib/callback_api')
const express = require("express");
const Product = require("./schemas/product");
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { socketUrl } = require('./var');
const exchange = 'delayed_exchange';
const queue = 'delay_queue';
const queueBinding = 'delay_exchange_queue_binding';
app.use(express.json());
app.use(cors());
const io = require("socket.io")(4000, {
    cors: {
        origin: [socketUrl]
    }
})

io.on('connection', socket => {
  amqp.connect('amqp://localhost', (err0, connection) => {
      if (err0) {
          throw err0
      }
      connection.createChannel((err, channel) => {
          if (err) {
              throw err
          }
          socket.on('PLAY', message => {
            const now = Date.now()
            Product.updateOne({ _id: message._id }, { playOn: now }).
            then(() => {
              if (err != null) bail(err);
              const headers = { 'x-delay': message.timmer * 1000 }; ///10 second delay
              channel.publish(exchange, queueBinding, new Buffer.from(JSON.stringify({ ...message, playOn: now })), { headers });
              io.emit('PLAYED', {...message, playOn: now})
            })
          })
          socket.on('ACCEPT', message => {
            Product.updateOne({ _id: message._id }, { acceptedOn: Date.now(), playOn: 0, buyerNotification: 'ACCEPTED' })
            .then(() => {
              io.emit('ACCEPTED', { ...message, acceptedOn: Date.now(), playOn: 0, buyerNotification: 'ACCEPTED' }) 
            })
          })
          // socket.on('SUBSCRIBE', message => {
          channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
          channel.assertQueue(queue, { durable: true });
          channel.bindQueue(queue, exchange, queueBinding);
          channel.consume(queue, async function (msg) {
            if (msg !== null) {
              try {
                const content = JSON.parse(msg.content.toString())
                const product = await Product.findOne({ _id: content._id }).exec()
                if (!product.acceptedOn) { // acceptedOn = 0 EXPIRED
                  await Product.updateOne({ _id: product._id }, { playOn: 0, acceptedOn: 0, buyerNotification: 'EXPIRED', sellerNotification: 'EXPIRED' })
                  io.emit('EXPIRED', { ...content, playOn: 0, acceptedOn: 0, buyerNotification: 'EXPIRED', sellerNotification: 'EXPIRED' })
                } else {
                  await Product.updateOne({ _id: product._id }, { playOn: 0, acceptedOn: 0 })
                }
              } catch (error) {
                
              }
            }
          }, { noAck: true });
          // })
      })
  })
})

app.get("/products", async (req, res) => {
  const products = await Product.find().exec();
  const resolve = products.map(product => ({ ...product._doc }))
  return res.status(200).json(resolve);
});
app.post("/notification", async (req, res) => {
  const { ids, role } = req.body
  const roleView = role === 'BUYER' ? { buyerNotification: '' } : { sellerNotification: '' }
  const product = await Product.updateMany({ _id: { $in: ids.map((id) => id )} }, roleView);
  return res.status(200).json(product);
});
app.post("/product", async (req, res) => {
  const { image, name, timmer, playOn } = req.body
  const product = await Product.create({ image, name, timmer, playOn });
  return res.status(200).json(product);
});
app.listen(5000)
const amqp = require('amqplib/callback_api')
const express = require("express");
const Message = require("./schemas/message");
const app = express();
const cors = require('cors');
const { socketUrl } = require('./var');

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
        connection.createChannel((err1, channel) => {
            if (err1) {
                throw err1
            }
            const QUEUE_1 = 'PUSH'
            const QUEUE_2 = 'PULL'
            channel.assertQueue(QUEUE_1)
            channel.assertQueue(QUEUE_2)
            socket.on('PUBLISH', message => {
                // console.log(message)
                const data = {
                    ...message,
                    id: socket.id
                }
                setTimeout(() => {
                // console.log('Timer completed. Processing message...');
                    channel.sendToQueue(QUEUE_1, Buffer.from(JSON.stringify(data)))
                    io.emit('SUBSCRIBE', {...data, status: 'SENT'})
                }, 2000);
                
                // console.log({...data, status: 'SENT'})

            })
            channel.consume(QUEUE_1, async (message) => {
                const data = JSON.parse(message.content.toString())
                setTimeout(async () => {
                // console.log('Timer completed. Processing message...');
                    await Message.create({ id: data.id, message: data.message, name: data.name, createdAt: data.createdAt, uid: data.uid })
                    io.emit('SUBSCRIBE', {...data, status: 'RECEIVED'})
                }, 2000);
                
            }, { noAck: true, })
        })
    })
})

app.get("/", async (req, res) => {
  const messages = (await Message.find().exec()).map(message => ({ ...message._doc, status: 'RECEIVED' }));
  return res.status(200).json(messages);
});
app.listen(5000)
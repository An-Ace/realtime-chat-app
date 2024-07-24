const exchange = 'delayed_exchange';
const queue = 'delay_queue';
const queueBinding = 'delay_exchange_queue_binding';

require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) miscue(err);
        var ok = conn.createChannel(function(err,ch){
            ch.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
            ch.assertQueue(queue, { durable: true });
            ch.bindQueue(queue, exchange, queueBinding);
            ch.consume(queue, function (msg) {
                if (msg !== null) {
                    console.log(msg.content.toString());
                    ch.ack(msg);
                }
            });
        });
    });

function miscue(err) {
    console.error(err);
    process.exit(1);
}
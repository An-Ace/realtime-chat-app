const exchange = 'delayed_exchange';
const queue = 'delay_queue';
const queueBinding = 'delay_exchange_queue_binding';


require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        if (err != null) miscue(err);
        conn.createChannel( function(err,ch){
            if (err != null) bail(err);
            const headers = { 'x-delay': 10000 }; ///10 second delay
            ch.publish(exchange, queueBinding, new Buffer.from('hello 10sn from past'), { headers });
            console.log('PUBLISH')
        });
    });

    require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
        console.log('Connect')
        if (err != null) miscue(err);
        console.log('MISCUE')
        var ok = conn.createChannel(function(err,ch){
            console.log('createChannel')
            ch.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
            console.log('assertExchange')
            ch.assertQueue(queue, { durable: true });
            console.log('assertQueue')
            ch.bindQueue(queue, exchange, queueBinding);
            console.log('Bind')
            ch.consume(queue, function (msg) {
                console.log('Consume')
                if (msg !== null) {
                    console.log(msg.content.toString());
                    ch.ack(msg);
                }
            }, { noAck: true, });
        });
    });

function miscue(err) {
    console.error(err);
    process.exit(1);
}

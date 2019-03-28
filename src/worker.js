const amqp = require('amqplib/callback_api')
const Email = require('./email/Email')
const sendEmail = require('./email/sendEmail')

const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `./profile/${process.env.ENVIRONMENT}.env`)})

amqp.connect(`amqp://${process.env.SERVER_QUEUE}`, (err, conn) => {
    if(err) console.error(err)

    conn.createChannel((err, ch) => {
        if(err) console.error(err)

        const queue = process.env.SERVER_NAME_QUEUE

        ch.assertQueue(queue, { durable: false });
        ch.prefetch(1)

        ch.consume(queue, msg => {
            const email = new Email(JSON.parse(msg.content.toString()))
            sendEmail(email).then(emailSending => {
                console.log(emailSending)
                ch.ack(msg)
            }).catch(err => {
                console.error(err)
                ch.nack(msg)
            })
            
        },  {noAck: false})
    })
})
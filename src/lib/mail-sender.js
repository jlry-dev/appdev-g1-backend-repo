import FormData from 'form-data' // form-data v4.0.1
import Mailgun from 'mailgun.js' // mailgun.js v11.1.0
require('dotenv').config()

async function sendSimpleMessage() {
    const mailgun = new Mailgun(FormData)
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_KEY,
    })
    try {
        const data = await mg.messages.create(
            'sandbox56c5326407d24b8ca94f1676d1c0e7ae.mailgun.org',
            {
                from: 'Mailgun Sandbox <postmaster@sandbox56c5326407d24b8ca94f1676d1c0e7ae.mailgun.org>',
                to: ['Jealry Pulpul <personal.jlry@gmail.com>'],
                subject: 'Hello Jealry Pulpul',
                text: 'Congratulations Jealry Pulpul, you just sent an email with Mailgun! You are truly awesome!',
            }
        )

        console.log(data) // logs response data
    } catch (error) {
        console.log(error) //logs any error
    }
}

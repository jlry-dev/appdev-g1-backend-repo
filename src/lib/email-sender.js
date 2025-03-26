const { CourierClient } = require('@trycourier/courier')

require('dotenv').config()

const courier = new CourierClient({
    authorizationToken: process.env.COURIER_AUTH_KEY,
})

async function emailSender(recieverEmail, username, token, expiration) {
    const { requestId } = await courier.send({
        message: {
            to: {
                email: recieverEmail,
            },
            template: process.env.COURIER_TEMPLATE,
            data: {
                username: username,
                verification_url: `${
                    process.env.SIGNUP_VERIFICATION_ROUTE
                }?token=${encodeURIComponent(token)}`,
                expire_date: expiration,
            },
            routing: {
                method: 'single',
                channels: ['email'],
            },
        },
    })

    return requestId
}

module.exports = emailSender

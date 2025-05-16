const express = require('express')
require('./config/database')

const routes = require('./routes/index-route')
const errorMiddleware = require('./middlewares/error-middleware')

const verifyToken = require('./middlewares/jwt-verifier-middleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/sign-up', routes.signUpRouter)
app.use('/log-in', routes.loginRouter)
app.use('/movies', routes.moviesRouter)

app.get('/test/protected', verifyToken, (req, res) => {
    res.json({
        status: 'Can access this protected route.',
        payload: req.body.payload,
    })
})

app.use(errorMiddleware)

module.exports = app

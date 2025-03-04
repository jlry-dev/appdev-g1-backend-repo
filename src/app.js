const express = require('express')

const routes = require('./routes/index-route')
const errorMiddleware = require('./middlewares/error-middleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/sign-up', routes.signUpRouter)

app.use(errorMiddleware)

module.exports = app

const { Router } = require('express')

const controller = require('../controllers/verify-controllers')

const verifyRouter = Router()

// prefix '/verify'
verifyRouter.get('/', controller.verifyTokenByQuery)

module.exports = verifyRouter

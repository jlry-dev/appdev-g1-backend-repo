const { Router } = require("express")

const verifyToken = require('../middlewares/jwt-verifier-middleware')
const controller = require("../controllers/movies-controller")

const moviesRouter = Router()

moviesRouter.use(verifyToken)
// prefix movies/
moviesRouter.get("/search", controller.getMoviesBySearch)
moviesRouter.get("/collection/:genre", controller.getMoviesByGenre)
moviesRouter.get("/details/:id", controller.getMovieDetails)

module.exports = moviesRouter
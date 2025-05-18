const { Router } = require("express")

const verifyToken = require('../middlewares/jwt-verifier-middleware')
const controller = require("../controllers/movies-controller")

const moviesRouter = Router()

moviesRouter.use(verifyToken)
// prefix movies/
moviesRouter.get("/search", controller.getMoviesBySearch)
moviesRouter.get("/collection/:genre", controller.getMoviesByGenre)
moviesRouter.get("/details/:id", controller.getMovieDetails)
moviesRouter.get("/trending", controller.getTrendingMovies)

// TO DO: Add validation for movieID and userID.
moviesRouter.get("/favourites", controller.getFavorites)
moviesRouter.post("/favourites/add", controller.postAddFavorites)
moviesRouter.post("/favourites/remove", controller.postRemoveFavorites)

module.exports = moviesRouter
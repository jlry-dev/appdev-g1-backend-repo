const asyncHandler = require('express-async-handler')
require("dotenv").config()

const genreJSON = require('../genre-id.json').genres
const favouritesModel = require('../models/favourites-model')

const BadRequestError = require('../errors/bad-request-error')
const NotFoundError = require('../errors/not-found-error')

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.MOVIEDB_ACCESS_TOKEN}`
    }
}

class MoviesController {
    getMoviesByGenre = asyncHandler( async function(req, res) {
        const parsedGenre = req.params["genre"].toLowerCase()
        const genre = parsedGenre.charAt(0).toUpperCase() + parsedGenre.slice(1)
        let page = req.query["page"]

        if (!genre) {
            throw new BadRequestError('Query invalid.')
        }

        // TO DO: add a check for age.

        let genreID 
        genreJSON.forEach((g) => {
            if (g.name == genre){
                genreID = g.id
            }
        })


        // genre not found
        if (!genreID){
            throw new NotFoundError('Genre not found.')
        }
        
        const data = await fetch(`${process.env.MOVIEDB_BASE_URL}discover/movie?with_genres${encodeURIComponent(genreID)}&page=${encodeURIComponent(page ? page : 1)}`, 
                                    options)
        const json = await data.json()

        if (json["results"].length === 0) {
            throw new NotFoundError('No movies found.')
        }

        const result = json["results"].map((val) => {
            return {
                id: val["id"],
                "poster_path": val["poster_path"],
                "title": val["original_title"]
            }
        })

        res.status(202)
        res.json({
            result
        })
    })

    getMovieDetails = asyncHandler(async function(req, res) {
        const movieID = req.params["id"]
        const userID = req["body"]["payload"]["user_id"]

        if (!movieID){
            throw new BadRequestError('Query invalid.')
        }

        const data = await fetch(`${process.env.MOVIEDB_BASE_URL}movie/${encodeURIComponent(movieID)}?append_to_response=credits,reviews`, options)
        let json = await data.json()

        json = {...json, credits: json["credits"]["cast"].slice(0,9)}
        const isFavourite = await favouritesModel.checkFavourite(userID, movieID)

        res.status(202)
        res.json({
            ...json,
            isFavourite: isFavourite
        })
    })

    getMoviesBySearch = asyncHandler(async function (req, res) {
        const query = req.query["query"]
        const page = req.query["page"]

        if (!query) {
            throw new BadRequestError('Query invalid.')
        }

        // TO DO: add a check for age.

        const data = await fetch(`${process.env.MOVIEDB_BASE_URL}search/movie?query=${encodeURIComponent(query)}&page=${encodeURIComponent(page ? page : 1)}`, options)
        let json = await data.json()

        res.status(202)
        res.json({
            results: json["results"]
        })
    })

    postAddFavorites = asyncHandler(async function(req, res) {
        const movieID = req["body"]["movie_id"]
        const userID = req["body"]["payload"]["user_id"]

        if (!movieID || !userID) {
            throw new BadRequestError('Query invalid.')
        }

        const isFavourite = await favouritesModel.checkFavourite(userID, movieID)

        if (isFavourite) {
            throw new ConflictError('Movie already in favourites.')
        }

        await favouritesModel.addFavourite(userID, movieID)

        res.status(202)
        res.json({
            message: 'Movie added to favourites.',
        })
    })

    postRemoveFavorites = asyncHandler(async function(req, res) {
        const movieID = req["body"]["movie_id"]
        const userID = req["body"]["payload"]["user_id"]

        if (!movieID || !userID) {
            throw new BadRequestError('Query invalid.')
        }

        const isFavourite = await favouritesModel.checkFavourite(userID, movieID)

        if (!isFavourite) {
            throw new NotFoundError('Movie not in favourites.')
        }

        await favouritesModel.removeFavourite(userID, movieID)

        res.status(202)
        res.json({
            message: 'Movie removed from favourites.',
        })
    })

    getFavorites = asyncHandler(async function(req, res) {
        const userID = req["body"]["payload"]["user_id"]

        if (!userID) {
            throw new BadRequestError('Query invalid.')
        }

        const favourites = await favouritesModel.retrieveFavourites(userID)

        const favouriteList = []
        for (const favourite of favourites) {
            const movie = await getMovieDetails(favourite["movie_id"])
            favouriteList.push({
                id: movie["id"],
                "poster_path": movie["poster_path"],
                "title": movie["original_title"]
            })
        }

        res.status(202)
        res.json({
            favourites: favouriteList
        })
    })

    getTrendingMovies = asyncHandler(async function(req, res) {
        const data = await fetch(`${process.env.MOVIEDB_BASE_URL}trending/movie/day`, options)
        let json = await data.json()

        res.status(202)
        res.json({
            id: json["id"],
            "poster_path": json["poster_path"],
            "title": json["original_title"]
        })
    })
}

// * Helper function to get movie details.
async function getMovieDetails(movieID) {
    const data = await fetch(`${process.env.MOVIEDB_BASE_URL}movie/${encodeURIComponent(movieID)}?append_to_response=credits,reviews`, options)
    let json = await data.json()
    return json
}

module.exports = new MoviesController()
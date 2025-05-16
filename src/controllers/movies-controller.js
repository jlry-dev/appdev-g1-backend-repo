const asyncHandler = require('express-async-handler')
require("dotenv").config()

const genreJSON = require('../genre-id.json').genres

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
        
        const data = await fetch(`${process.env.MOVIEDB_URL}discover/movie?with_genres${encodeURIComponent(genreID)}&page=${encodeURIComponent(page ? page : 1)}`, 
                                    options)
        const json = await data.json()

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

        if (!movieID){
            throw new BadRequestError('Query invalid.')
        }

        const data = await fetch(`${process.env.MOVIEDB_URL}movie/${encodeURIComponent(movieID)}?append_to_response=credits,reviews`, options)
        let json = await data.json()

        json = {...json, credits: json["credits"]["cast"].slice(0,9)}

        res.status(202)
        res.json(json)
    })

    getMoviesBySearch = asyncHandler(async function (req, res) {
        const query = req.query["query"]
        const page = req.query["page"]

        if (!query) {
            throw new BadRequestError('Query invalid.')
        }

        // TO DO: add a check for age.

        const data = await fetch(`${process.env.MOVIEDB_URL}search/movie?query=${encodeURIComponent(query)}&page=${encodeURIComponent(page ? page : 1)}`, options)
        let json = await data.json()

        res.status(202)
        res.json({
            results: json["results"]
        })
    })
}

module.exports = new MoviesController()
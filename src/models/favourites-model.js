const pool = require('../config/database')

class FavouritesModel {
    async addFavourite(userID, movieID) {
        await pool.query('INSERT INTO favourites (user_id, movie_id) VALUES ($1, $2)', 
            [userID, movieID])
    }

    async removeFavourite(userID, movieID) {
        await pool.query('DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2', 
            [userID, movieID])
    }

    async checkFavourite(userID, movieID) {
        const { rows } = await pool.query('SELECT * FROM favourites WHERE user_id = $1 AND movie_id = $2', 
            [userID, movieID])

        if (rows.length > 0) { 
            return true
        }

        return false
    }

    async retrieveFavourites(userID) {
        const { rows } = await pool.query('SELECT * FROM favourites WHERE user_id = $1', 
            [userID])

        return rows
    }
}

module.exports = new FavouritesModel()
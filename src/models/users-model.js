const pool = require('../config/database')

class UsersModel {
    async insertUser(email, username, password) {
        await pool.query(
            `INSERT INTO "users" (email, username, password) VALUES ($1, $2, $3)`,
            [email, username, password]
        )
    }
}

module.exports = new UsersModel()

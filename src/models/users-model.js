const pool = require('../config/database')

class UsersModel {
    // Checks if a credential is present in the users table, returns true if it is present and false otherwise.
    async checkUser(email, username) {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE email = $1 OR username = $2`,
            [email, username]
        )

        if (rows.length > 0) {
            return true
        }

        return false
    }

    async insertUser(email, username, password) {
        await pool.query(
            `INSERT INTO "users" (email, username, password) VALUES ($1, $2, $3)`,
            [email, username, password]
        )
    }

    async retrieveUserByUsername(username) {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        )

        const user = rows[0]

        return user
    }

    async retrieveUserByEmail(email) {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        const user = rows[0]

        return user
    }
}

module.exports = new UsersModel()

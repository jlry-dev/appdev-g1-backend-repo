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

    async insertUser(email, username, bdate, password) {
        await pool.query(
            `INSERT INTO "users" (email, username, bdate, password) VALUES ($1, $2, $3, $4)`,
            [email, username, bdate, password]
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


    async retrieveUserByID(userID) {
        const { rows } = await pool.query(
            `SELECT * FROM users WHERE "user_id" = $1`,
            [userID]
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

    async updatePassword(newPassword, userID) {
        await pool.query(`UPDATE users SET password = $1 WHERE "user_id" = $2`,
            [newPassword, userID]
        )
    }

    // This is for updating the username, email, and date (MM-DD-YYYY)
    async updateInfo(username, email, bdate, userID) {
        await pool.query(`UPDATE users SET username = $1, email = $2, bdate = $3 WHERE "user_id" = $4`,
            [username, email, bdate, userID]
        )
    }

    async deleteAccount(userID) {
        await pool.query(`DELETE FROM users WHERE "user_id" = $1`,
            [userID]
        )
    }
    
}

module.exports = new UsersModel()

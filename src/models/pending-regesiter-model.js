const pool = require('../config/database')

class PendingRegistrationModel {
    // Check if a user credential is on pending registration.
    async checkPending(email, username) {
        const { rows } = await pool.query(
            'SELECT * FROM "pending_registration" WHERE email = $1 OR username = $2',
            [email, username]
        )

        if (rows.length > 0) {
            return true
        }

        return false
    }

    // Check if a user credential is on pending.
    // Returns a boolean if token matches in the database or not
    async checkPendingByToken(token) {
        const { rows } = await pool.query(
            `SELECT * FROM pending_registration WHERE verification_token = $1`,
            [token]
        )

        if (rows.length > 0) {
            return true
        }

        return false
    }

    async insertUser(email, username, bdate, password, verificationToken, expiration) {
        await pool.query(
            `INSERT INTO "pending_registration" (email, username, bdate, password, verification_token, verification_expiration) VALUES ($1, $2, $3, $4, $5, $6)`,
            [email, username, bdate, password, verificationToken, expiration]
        )
    }

    async retrieveUserByToken(token) {
        const { rows } = await pool.query(
            `SELECT * FROM pending_registration WHERE verification_token = $1`,
            [token]
        )

        const user = rows[0]

        return user
    }

    async retrieveUserByUsername(username) {
        const { rows } = await pool.query(
            `SELECT * FROM pending_registration WHERE username = $1`,
            [username]
        )

        const user = rows[0]

        return user
    }

    async retrieveUserByEmail(email) {
        const { rows } = await pool.query(
            `SELECT * FROM pending_registration WHERE email = $1`,
            [email]
        )

        const user = rows[0]

        return user
    }

    async deleteUserByToken(token) {
        await pool.query(
            `DELETE FROM pending_registration WHERE verification_token = $1`,
            [token]
        )
    }
}

module.exports = new PendingRegistrationModel()

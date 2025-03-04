const pool = require('../config/database')

class PendingRegistrationModel {
    async checkPending(email, username) {
        const { rows } = await pool.query(
            'SELECT * FROM "pending_registration" WHERE email = $1 OR username = $2',
            [email, username]
        )

        if (rows.length > 0) {
            // user is pending for verification
            return true
        }

        return false
    }

    async insertUser(email, username, password, verificationToken, expiration) {
        await pool.query(
            `INSERT INTO "pending_registration" (email, username, password, verification_token, verification_expiration) VALUES ($1, $2, $3, $4, $5)`,
            [email, username, password, verificationToken, expiration]
        )
    }
}

module.exports = new PendingRegistrationModel()

const pool = require('../config/database')

class PasswordRecoveryModel {
    async insert(code, email, expiration) {
        await pool.query("INSERT INTO password_recovery (code, email, expiration) VALUES ($1, $2, $3)", 
            [code, email, expiration])
    }

    async delete(email) {
        await pool.query("DELETE FROM password_recovery WHERE email = $1", 
            [email])
    }

    async incrementTries(email) {
        await pool.query("UPDATE password_recovery SET tries = tries + 1 WHERE email = $1", 
            [email])
    }

    async retrieveCodeInfo(email){
        const rows = await pool.query("SELECT * FROM password_recovery WHERE email = $1", [email])

        const info = rows[0]
        return info
    }
}

module.exports = new PasswordRecoveryModel()

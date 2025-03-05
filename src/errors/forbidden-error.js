class ForbiddenError extends Error {
    constructor(message, name) {
        super(message)
        this.statusCode = 403
        this.name = name || 'ForbiddenError'
    }
}

module.exports = ForbiddenError

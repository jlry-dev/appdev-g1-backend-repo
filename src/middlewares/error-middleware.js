function errorHandler(err, req, res, next) {
    console.log(err)

    if (err.statusCode) {
        res.status(err.statusCode)
        res.json({
            message: err.message,
            status: 'error',
        })

        return
    }

    res.status(500).json({
        message: 'Internal Server Error',
        status: 'error',
    })
}

module.exports = errorHandler

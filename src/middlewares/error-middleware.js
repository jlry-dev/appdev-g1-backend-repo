function errorHandler(err, req, res, next) {
    console.log(err)

    if (err.statusCode) {
        res.status(err.statusCode)
        res.json({
            message: err.message,
        })

        return
    }

    res.status(500).json({
        message: 'Internal Server Error',
    })
}

module.exports = errorHandler

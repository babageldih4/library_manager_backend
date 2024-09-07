const sendError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err);
    sendError(err, res);
};
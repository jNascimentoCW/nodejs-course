const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((ele) => ele.message);
    console.log(`errors: ${errors}`);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        //Programming or other unknown error: don't leak error details
    } else {
        //1) Log error
        console.log('ERROR 💥', err);

        //2) Send generic error
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

//Suing 4 parameters, express knows that this is a handling error middleware
module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err };
        let error = Object.create(err);
        // error.errmsg = err.errmsg;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }
};

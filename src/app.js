const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const { checkOverload } = require('./utils/check.connect');
const router = require('./routes');

const app = express();  

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
require("./dbs/init.mongodb")
// checkOverload()
// init router 
app.use('/', router)

// handle error 
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error', 
        code: statusCode, 
        message: err.message || "Internal Server Error"
    })
})

module.exports = app
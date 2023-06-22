const express = require("express");
const ExpressError = require("./expressError");

const itemsRoutes = require("./routes/itemsRoutes");

const app = express();
app.use(express.json())

app.use('/items', itemsRoutes)

app.use((resquest, response, next) => {
    const error = new ExpressError("Page Not Found", 404)
    next(error)
})


app.use((error, request, response, next) => {

    let status = error.status || 500
    let message = error.message

    return response.status(status).json({error: {message, status}})

})


module.exports = app
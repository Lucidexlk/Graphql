const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require('morgan');
const mongoose = require("mongoose");
const app = express();
app.use(morgan("dev"));

const grapqlHttp = require('express-graphql')

//define server running port
let port = 4000;

// import db
const dbConfig = require('./app/config/db.config')

// import graphql schema
const graphQlSchema = require('./app/graphql/schema/schema')

// import grapgql resolver
const graphqlResolvers = require('./app/graphql/resolvers/resolver')
// import routes
const mainRoutes = require('./app/route/main.routes');


// import middleware

const isAuth = require('./app/middlewares/is-auth.middleware') 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(isAuth)
app.use('/main', mainRoutes)
app.use('/grapgql', grapqlHttp({
    schema: graphQlSchema,
    rootValue: graphqlResolvers,
    graphiql: true

}));

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    console.log(error);

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});


// Connecting to the database
mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database now");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// open server
app.listen(port, () => {
    console.log("Server is up and running on port numner " + port);
});

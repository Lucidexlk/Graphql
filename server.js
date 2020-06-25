const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require('morgan');
const mongoose = require("mongoose");
const app = express();
app.use(morgan("dev"));

const grapqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

//define server running port
let port = 4000;

// import db
const dbConfig = require('./app/config/db.config')

// import routes
const mainRoutes = require('./app/route/main.routes')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/main', mainRoutes)

app.use('/grapgql', grapqlHttp({
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String) : String
        }
        schema {
            query:RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {

    }

}))



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

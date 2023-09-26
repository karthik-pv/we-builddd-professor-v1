require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ConnectToMongoDB = require('./config/MongoDB');
const professor_route = require('./Routes/professor_routes');

const app = express();

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

const startApp = async() => {

    //middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //mongodb connection
    await ConnectToMongoDB(MONGO_URL,"Professor");

    // routing
    app.use('/api/v1/professor',professor_route);

    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
        console.log(`${process.env.HOST}:${process.env.PORT}`);
    })
}

startApp();
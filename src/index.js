const express = require('express');
var bodyParser = require('body-parser');
const dotenv = require("dotenv")
dotenv.config({path:'./config.env'})
require('./db/conn')
const multer = require('multer')
const route = require('./route/route.js');

const app = express();

const PORT = process.env.PORT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());


app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
console.log('Express app running on port ' + (process.env.PORT || 3000))
});
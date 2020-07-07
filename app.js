//Import packages 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
var db = require('./models/index.js');
const bodyParser = require('body-parser');
const app = express();
const authCheckMiddleware = require('./middleware/auth/isAuthenticated')
/****************Import Routes*****************/
const todoRoute = require('./routes/todo');
const authRoute = require('./routes/auth');

/****************Middleware*****************/
app.use(bodyParser.json());
app.use(cors());
app.use('/api', authCheckMiddleware);

app.use('/auth',authRoute);
app.use('/api',todoRoute);

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`server running on port ${port}`)
});
//Import packages 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const bodyParser = require('body-parser');
const app = express();

/****************Import Routes*****************/
const todoRoute = require('./routes/todo');

/****************Middleware*****************/
app.use(bodyParser.json());
app.use(cors());
app.use('/todo',todoRoute);

/****************Home Page Route ****************/
app.get('/', (req,res)=>{
    console.log('home page');
    res.send('home page');
})

/****************Connect DB ****************/

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true,useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected…'))
        .catch(err => console.log(err))

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`server running on port ${port}`)
});
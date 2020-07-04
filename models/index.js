var mongoose = require('mongoose');

/****************Connect DB ****************/
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true,useUnifiedTopology: true})
        .then(() => console.log('MongoDB Connected…'))
        .catch(err => console.log(err))

module.exports.Todo = require('./Todo');
module.exports.User = require('./User');
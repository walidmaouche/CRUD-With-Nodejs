const mongoose = require('mongoose');


const TodoSchema = mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    priority : {
        type: String,
        required : false
    },
    created_by : {
        type: Number,
        required : true
    },
    associated_to : {
        type: Number,
        required : false
    },
    created_at : {
        type : Date,
       default: Date.now(),
    }
})

module.exports = mongoose.model('Todo', TodoSchema)
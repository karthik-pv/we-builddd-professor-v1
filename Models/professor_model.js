const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String,
    },
    subjects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'subjects'
    }]
})

professorSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        return ret
    }
})

const professorModel = mongoose.model('professor',professorSchema);

module.exports = professorModel;
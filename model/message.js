const mongoose = require('mongoose');
const messages = new mongoose.Schema({
    userId :{
        type:String,
    },
    message : String,

}, { timestamps: true }
)
const schema = mongoose.model('messages', messages);

module.exports = schema

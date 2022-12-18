const mongoose = require('mongoose');

const CoverSchema = new mongoose.Schema({
    option:  String,
    content:String,
    brand:String,
    price:String
})
module.exports = mongoose.model('cover',CoverSchema);
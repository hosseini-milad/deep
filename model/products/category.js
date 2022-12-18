const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title:  String, // String is shorthand for {type: String}
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
    body:   String,
    color: String,
    imageUrl: String,
    date: { type: Date, default: Date.now }
    
})
module.exports = mongoose.model('categories',CategorySchema);
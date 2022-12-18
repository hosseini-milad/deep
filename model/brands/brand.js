const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const BrandSchema = new Schema({
    title:  String,
    enTitle:String,
    lenzIndex:[String],
    material: [String],
    Coating:[String],
    
    imageUrl: String,
    
})
module.exports = mongoose.model('brands',BrandSchema);
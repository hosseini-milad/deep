const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    sku: String,
    enTitle:String,
    description:String,
    fullDesc:String,
    uploadImage:String,
    imageUrl: {
        type:String
    },
    imgGallery:String,
    imgGalleryUrl:{
        type:String 
    },
    price:String,
    categories:{type: Schema.Types.ObjectId, ref: 'categories'}
})
module.exports = mongoose.model('Product',ProductSchema);
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const reportSchema = new Schema({
    title:  String,
    enTitle:String,
    date:Date,
})
module.exports = mongoose.model('report',reportSchema);
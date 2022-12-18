const mongoose = require("mongoose");

const ManSchema = new mongoose.Schema({
  facoryName: {type: String},
  brandName: {type: String},
  lenzType:{type: String},
  lenzDesign:{type: String},
  lenzIndex: { type: String },
  material: { type: String },
  coridor: { type: String },
  dia: { type: String },
  
  sku:{ type: String , unique: true},

  lenzPrice: { type: String },
  lenzDiscount:{ type: String },
});

module.exports = mongoose.model("manufactures", ManSchema);
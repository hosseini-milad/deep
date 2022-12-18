const mongoose = require("mongoose");

const sepidarStockSchema = new mongoose.Schema({
  brandName: {type: String},
  lenzIndex: { type: String },
  material: { type: String },
  coating: { type: String },

  sku:{ type: String , unique: true},

  sph:{ type: String },
  cyl:{ type: String },
  dia: { type: String },
  add: { type: String },
  align: { type: String },
  design: { type: String },
  
  price: { type: String },
});

module.exports = mongoose.model("sepidarStock", sepidarStockSchema);
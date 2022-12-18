const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  stockId: {type: mongoose.Schema.Types.ObjectId, ref: 'stocks'},
  manageId: {type: String},
  //frameShape: { type: String },
  stockOrderNo:{type:String},

  stockOrderPrice:{type:String},
  stockFaktor:[{type:Object}],

  /*stockCount:{type:String},
  count:{ type: String },
  odIPD: { type: String },
  odFH: { type: String },
  osIPD: { type: String },
  osFH: { type: String },
  framePrice:{ type: String },

  colorCode:{ type: String },
  colorPrice:{ type: String },

  coverCode:{ type: String },
  coverPrice:{ type: String },

  mirrorCode:{ type: String },
  mirrorPrice:{ type: String },

  extraInformation: { type: String },

  warrantyPrice:{ type: String },
  extraPrice:{ type: String },
  lenzPrice:{ type: String },
  totalDiscount:{ type: String },
  totalPrice:{ type: String },
  */
  status:{ type: String },
  date:{ type: Date },
});

module.exports = mongoose.model("orders", OrdersSchema);
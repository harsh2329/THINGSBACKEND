

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const deviceSchema = new Schema({ 

// name:{
//     type:String,     
//     required:true,
// },
// label:{
//     type:String,
//     required:true,
// },
// deviceProfile:{
//     type:String,
//     enum: ['default', 'Air Qulaity Sensor ' , 'Charging Port' , 'Heat Sensor' , 'sand Filter' ,'Valve', 'Water sensor', 'PH sensor'],
//     required:true,
// },
// isGateway:{
//     type:Boolean,
//    default: false
// },
//  customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Customer',
//     required: false
//   },
//  description: {
//     type: String,
//     trim: true,
//     maxlength: 500
//   },

// });

// module.exports = mongoose.model('Device', deviceSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  deviceProfile: {
    type: String,
    enum: ['default','Air Quality Sensor','Charging Port','Heat Sensor','sand Filter','Valve','Water sensor','PH sensor'],
    required: true
  },
  isGateway: { type: Boolean, default: false },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
  description: { type: String, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);

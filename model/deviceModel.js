

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
const Schema = mongoose.Schema;

const deviceSchema = new Schema({ 
  name: {
    type: String,     
    required: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  deviceProfile: {
    type: String,
    enum: [
      'default', 
      'Air Qulaity Sensor ',  // Keep the typo to match existing data
      'Charging Port', 
      'Heat Sensor', 
      'sand Filter',
      'Valve', 
      'Water sensor', 
      'PH sensor'
    ],
    required: true,
    default: 'default'
  },
  isGateway: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true  // This adds createdAt and updatedAt fields automatically
});

// Add indexes for better performance
deviceSchema.index({ name: 1 });
deviceSchema.index({ deviceProfile: 1 });
deviceSchema.index({ customerId: 1 });
deviceSchema.index({ isGateway: 1 });

module.exports = mongoose.model('Device', deviceSchema);
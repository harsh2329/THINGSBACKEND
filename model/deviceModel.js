const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  label: {
    type: String,
    trim: true,
    maxlength: 100
  },
  deviceProfile: {
    type: String,
    required: true,
    enum: ['default', 'Valve', 'Water sensor', 'PH sensor'],
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
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields that might be useful
  deviceId: {
    type: String,
    unique: true,
    sparse: true
  },
  firmware: {
    type: String,
    trim: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    trim: true
  },
  macAddress: {
    type: String,
    trim: true
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for customer details
deviceSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true
});

// Index for better query performance
deviceSchema.index({ name: 1 });
deviceSchema.index({ customerId: 1 });
deviceSchema.index({ deviceProfile: 1 });
deviceSchema.index({ isActive: 1 });

// Pre-save middleware to generate deviceId if not provided
deviceSchema.pre('save', function(next) {
  if (!this.deviceId) {
    this.deviceId = `DEV_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
  next();
});

// Instance method to check if device is online (based on lastSeen)
deviceSchema.methods.isOnline = function() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  return this.lastSeen > fifteenMinutesAgo;
};

// Static method to find devices by customer
deviceSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customerId, isActive: true }).populate('customer');
};

// Static method to find gateway devices
deviceSchema.statics.findGateways = function() {
  return this.find({ isGateway: true, isActive: true });
};

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Customer title is required'],
        trim: true,
        maxLength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'Description cannot exceed 500 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxLength: [50, 'Country cannot exceed 50 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxLength: [50, 'City cannot exceed 50 characters']
    },
    state: {
        type: String,
        trim: true,
        maxLength: [50, 'State cannot exceed 50 characters']
    },
    zipCode: {
        type: String,
        trim: true,
        maxLength: [20, 'Zip code cannot exceed 20 characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxLength: [200, 'Address cannot exceed 200 characters']
    },
    address2: {
        type: String,
        trim: true,
        maxLength: [200, 'Address 2 cannot exceed 200 characters']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                // Basic phone validation - allows international formats
                return !v || /^[\+]?[0-9\s\-\(\)]{10,20}$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    // Additional fields that might be useful
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
    let address = this.address;
    if (this.address2) address += ', ' + this.address2;
    if (this.city) address += ', ' + this.city;
    if (this.state) address += ', ' + this.state;
    if (this.zipCode) address += ' ' + this.zipCode;
    if (this.country) address += ', ' + this.country;
    return address;
});

// Index for better query performance
customerSchema.index({ email: 1 });
customerSchema.index({ name: 1 });
customerSchema.index({ country: 1, city: 1 });
customerSchema.index({ createdAt: -1 });

// Pre-save middleware to set name from title if name is not provided
customerSchema.pre('save', function(next) {
    if (!this.name && this.title) {
        this.name = this.title;
    }
    next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
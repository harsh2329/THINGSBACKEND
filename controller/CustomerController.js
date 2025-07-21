const Customer = require('../model/CustomerModel');

// Create a new customer
const createCustomer = async (req, res) => {
    try {
        const {
            title,
            description,
            country,
            city,
            state,
            zipCode,
            address,
            address2,
            phone,
            email,
            name
        } = req.body;

        // Check if customer with email already exists
        const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
        if (existingCustomer) {
            return res.status(400).json({
                message: "Customer with this email already exists",
                error: "Duplicate email"
            });
        }

        const customer = new Customer({
            title,
            description,
            country,
            city,
            state,
            zipCode,
            address,
            address2,
            phone,
            email: email.toLowerCase(),
            name: name || title, // Use name if provided, otherwise use title
            isActive: true
        });

        const savedCustomer = await customer.save();

        res.status(201).json({
            message: "Customer created successfully",
            data: savedCustomer
        });

    } catch (error) {
        console.error('Error creating customer:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation error",
                error: errors.join(', ')
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Customer with this email already exists",
                error: "Duplicate email"
            });
        }

        res.status(500).json({
            message: "Error creating customer",
            error: error.message
        });
    }
};

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, country, city, isActive } = req.query;

        // Build filter object
        const filter = {};
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ];
        }

        if (country) {
            filter.country = { $regex: country, $options: 'i' };
        }

        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get customers with pagination
        const customers = await Customer.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .lean();

        // Get total count for pagination
        const totalCount = await Customer.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / parseInt(limit));

        res.status(200).json({
            message: "Customers fetched successfully",
            data: customers,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            message: "Error fetching customers",
            error: error.message
        });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer fetched successfully",
            data: customer
        });

    } catch (error) {
        console.error('Error fetching customer:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid customer ID format"
            });
        }

        res.status(500).json({
            message: "Error fetching customer",
            error: error.message
        });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;

        // If email is being updated, check for duplicates
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase();
            const existingCustomer = await Customer.findOne({ 
                email: updateData.email, 
                _id: { $ne: id } 
            });
            
            if (existingCustomer) {
                return res.status(400).json({
                    message: "Customer with this email already exists",
                    error: "Duplicate email"
                });
            }
        }

        const customer = await Customer.findByIdAndUpdate(
            id, 
            updateData, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer updated successfully",
            data: customer
        });

    } catch (error) {
        console.error('Error updating customer:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Validation error",
                error: errors.join(', ')
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid customer ID format"
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Customer with this email already exists",
                error: "Duplicate email"
            });
        }

        res.status(500).json({
            message: "Error updating customer",
            error: error.message
        });
    }
};

// Delete customer (soft delete by setting isActive to false)
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent } = req.query; // ?permanent=true for hard delete

        if (permanent === 'true') {
            // Hard delete
            const customer = await Customer.findByIdAndDelete(id);
            
            if (!customer) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.status(200).json({
                message: "Customer permanently deleted successfully",
                data: customer
            });
        } else {
            // Soft delete
            const customer = await Customer.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            if (!customer) {
                return res.status(404).json({
                    message: "Customer not found"
                });
            }

            res.status(200).json({
                message: "Customer deactivated successfully",
                data: customer
            });
        }

    } catch (error) {
        console.error('Error deleting customer:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid customer ID format"
            });
        }

        res.status(500).json({
            message: "Error deleting customer",
            error: error.message
        });
    }
};

// Restore customer (reactivate)
const restoreCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer restored successfully",
            data: customer
        });

    } catch (error) {
        console.error('Error restoring customer:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid customer ID format"
            });
        }

        res.status(500).json({
            message: "Error restoring customer",
            error: error.message
        });
    }
};

// Get customer statistics
const getCustomerStats = async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();
        const activeCustomers = await Customer.countDocuments({ isActive: true });
        const inactiveCustomers = await Customer.countDocuments({ isActive: false });

        // Get customers by country
        const customersByCountry = await Customer.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get recent customers
        const recentCustomers = await Customer.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email city country createdAt');

        res.status(200).json({
            message: "Customer statistics fetched successfully",
            data: {
                totalCustomers,
                activeCustomers,
                inactiveCustomers,
                customersByCountry,
                recentCustomers
            }
        });

    } catch (error) {
        console.error('Error fetching customer statistics:', error);
        res.status(500).json({
            message: "Error fetching customer statistics",
            error: error.message
        });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    restoreCustomer,
    getCustomerStats
};
const Device = require('../models/Device');
const Customer = require('../models/Customer'); // Assuming you have a Customer model

// @desc    Get all devices
// @route   GET /api/devices
// @access  Public
const getDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.customerId) filter.customerId = req.query.customerId;
    if (req.query.deviceProfile) filter.deviceProfile = req.query.deviceProfile;
    if (req.query.isGateway !== undefined) filter.isGateway = req.query.isGateway === 'true';
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { label: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const devices = await Device.find(filter)
      .populate('customer', 'title email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Device.countDocuments(filter);

    res.json({
      success: true,
      data: devices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Public
const getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id).populate('customer', 'title email');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create device
// @route   POST /api/devices
// @access  Private
const createDevice = async (req, res) => {
  try {
    const {
      name,
      label,
      deviceProfile,
      isGateway,
      customerId,
      description,
      isPublic,
      isActive
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Device name is required'
      });
    }

    // Validate customer if provided
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customer ID'
        });
      }
    }

    // Check if device name already exists
    const existingDevice = await Device.findOne({ name: name.trim() });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        message: 'Device with this name already exists'
      });
    }

    const device = await Device.create({
      name: name.trim(),
      label: label?.trim(),
      deviceProfile,
      isGateway: isGateway || false,
      customerId: customerId || null,
      description: description?.trim(),
      isPublic: isPublic || false,
      isActive: isActive !== undefined ? isActive : true
    });

    // Populate customer data before sending response
    await device.populate('customer', 'title email');

    res.status(201).json({
      success: true,
      data: device,
      message: 'Device created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private
const updateDevice = async (req, res) => {
  try {
    const {
      name,
      label,
      deviceProfile,
      isGateway,
      customerId,
      description,
      isPublic,
      isActive
    } = req.body;

    // Check if device exists
    let device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Device name is required'
      });
    }

    // Validate customer if provided
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customer ID'
        });
      }
    }

    // Check if device name already exists (excluding current device)
    const existingDevice = await Device.findOne({ 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        message: 'Device with this name already exists'
      });
    }

    // Update device
    device = await Device.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        label: label?.trim(),
        deviceProfile,
        isGateway: isGateway || false,
        customerId: customerId || null,
        description: description?.trim(),
        isPublic: isPublic || false,
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true, runValidators: true }
    ).populate('customer', 'title email');

    res.json({
      success: true,
      data: device,
      message: 'Device updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    await Device.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle device active status
// @route   PATCH /api/devices/:id/toggle-status
// @access  Private
const toggleDeviceStatus = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    device.isActive = !device.isActive;
    await device.save();

    res.json({
      success: true,
      data: device,
      message: `Device ${device.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get devices by customer
// @route   GET /api/devices/customer/:customerId
// @access  Public
const getDevicesByCustomer = async (req, res) => {
  try {
    const devices = await Device.findByCustomer(req.params.customerId);

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get gateway devices
// @route   GET /api/devices/gateways
// @access  Public
const getGatewayDevices = async (req, res) => {
  try {
    const devices = await Device.findGateways();

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  toggleDeviceStatus,
  getDevicesByCustomer,
  getGatewayDevices
};
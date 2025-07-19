const express = require('express');
const router = express.Router();
const {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  toggleDeviceStatus,
  getDevicesByCustomer,
  getGatewayDevices
} = require('../controllers/deviceController');

// Import middleware (adjust paths as needed)
const { protect } = require('../middleware/auth'); // Authentication middleware
const { authorize } = require('../middleware/auth'); // Authorization middleware

// Public routes
router.get('/', getDevices);
router.get('/gateways', getGatewayDevices);
router.get('/customer/:customerId', getDevicesByCustomer);
router.get('/:id', getDevice);

// Protected routes (require authentication)
router.post('/', protect, createDevice);
router.put('/:id', protect, updateDevice);
router.delete('/:id', protect, deleteDevice);
router.patch('/:id/toggle-status', protect, toggleDeviceStatus);

module.exports = router;
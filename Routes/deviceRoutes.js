// const express = require('express');
// const router = express.Router();
// const DeviceController = require('../controller/deviceController');

// // File upload route
// router.post('/devicewithfile', DeviceController.addDeviceWithFile);

// // Specific routes (more specific routes should come first)
// router.get('/gateway/all', DeviceController.getGatewayDevices);
// router.get('/profile/:profile', DeviceController.getDevicesByProfile);
// router.get('/customer/:customerId', DeviceController.getAllDevicesByCustomerId);

// // CRUD operations
// router.post('/add', DeviceController.addDevice);
// router.get('/all', DeviceController.getAllDevices);

// // ID-based routes (should be last to avoid conflicts)
// router.get('/:id', DeviceController.getDeviceById);
// router.put('/:id', DeviceController.updateDevice);
// router.delete('/:id', DeviceController.deleteDevice);

// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controller/deviceController');

router.post('/add', controller.addDevice);
router.get('/all', controller.getAllDevices);
router.get('/:id', controller.getDeviceById);
router.put('/:id', controller.updateDevice);
router.delete('/:id', controller.deleteDevice);

module.exports = router;

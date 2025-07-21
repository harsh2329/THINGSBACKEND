// const DeviceModel = require('../model/deviceModel');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }).single('file');

// const addDevice = async (req, res) => {
//     try {
//         const savedDevice = await DeviceModel.create(req.body);
//         res.status(201).json({
//             message: "Device added successfully",
//             data: savedDevice,
//         });
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// const getAllDevices = async (req, res) => {
//     try {
//         const devices = await DeviceModel.find();
//         if (devices.length === 0) {
//             res.status(404).json({
//                 message: "No devices found"
//             });
//         } else {
//             res.status(200).json({
//                 message: "All devices fetched successfully",
//                 data: devices,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// const getAllDevicesByCustomerId = async (req, res) => {
//     try {
//         const devices = await DeviceModel.find({ customerId: req.params.customerId }).populate("customerId");
//         if (devices.length === 0) {
//             res.status(404).json({
//                 message: "No devices found for this customer"
//             });
//         } else {
//             res.status(200).json({
//                 message: "All devices fetched successfully",
//                 data: devices,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// const getDeviceById = async (req, res) => {
//     try {
//         const device = await DeviceModel.findById(req.params.id).populate("customerId");
//         if (!device) {
//             res.status(404).json({
//                 message: "Device not found"
//             });
//         } else {
//             res.status(200).json({
//                 message: "Device fetched successfully",
//                 data: device,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// const updateDevice = async (req, res) => {
//     try {
//         if (!req.params.id || req.params.id === ':id') {
//             return res.status(400).json({
//                 message: "Invalid ID provided",
//                 error: "You must provide a valid MongoDB ID"
//             });
//         }

//         const updatedDevice = await DeviceModel.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         ).populate("customerId");

//         if (!updatedDevice) {
//             return res.status(404).json({
//                 message: "Device not found"
//             });
//         }

//         res.status(200).json({
//             message: "Device updated successfully",
//             data: updatedDevice
//         });
//     } catch (err) {
//         console.error("Update error:", err);
//         res.status(500).json({
//             message: "Error updating device",
//             error: err.message
//         });
//     }
// };

// const deleteDevice = async (req, res) => {
//     console.log("Delete request received with ID:", req.params.id);

//     try {
//         if (!req.params.id || req.params.id === ':id') {
//             return res.status(400).json({
//                 message: "Invalid ID provided",
//                 error: "You must provide a valid MongoDB ID"
//             });
//         }

//         const deletedDevice = await DeviceModel.findByIdAndDelete(req.params.id);

//         if (!deletedDevice) {
//             return res.status(404).json({
//                 message: "Device not found"
//             });
//         }

//         res.status(200).json({
//             message: "Device deleted successfully",
//             deletedId: req.params.id
//         });
//     } catch (err) {
//         console.error("Delete error:", err);
//         res.status(500).json({
//             message: "Error deleting device",
//             error: err.message
//         });
//     }
// };

// const addDeviceWithFile = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(500).json({
//                 message: err.message
//             });
//         }

//         try {
//             console.log(req.body);

//             // Check for required fields based on Device schema
//             const requiredFields = ['name', 'label', 'deviceProfile'];

//             const missingFields = [];

//             requiredFields.forEach(field => {
//                 if (req.body[field] === undefined || req.body[field] === '') {
//                     missingFields.push(field);
//                 }
//             });

//             if (missingFields.length > 0) {
//                 return res.status(400).json({
//                     message: `Missing required fields: ${missingFields.join(', ')}`
//                 });
//             }

//             // Validate deviceProfile enum
//             const validProfiles = [
//                 'default', 'Air Quality Sensor', 'Charging Port', 
//                 'Heat Sensor', 'sand Filter', 'Valve', 
//                 'Water sensor', 'PH sensor'
//             ];

//             if (!validProfiles.includes(req.body.deviceProfile)) {
//                 return res.status(400).json({
//                     message: `Invalid device profile. Valid profiles are: ${validProfiles.join(', ')}`
//                 });
//             }

//             // Handle file upload if needed (you can uncomment and modify this section if you need file upload)
//             /*
//             if (req.file) {
//                 const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
//                 console.log("Cloudinary upload response:", cloudinaryResponse);
                
//                 req.body.imagePath = cloudinaryResponse.secure_url;
//                 console.log("Image path being saved:", req.body.imagePath);
//             }
//             */

//             // Create device in database
//             const createdDevice = await DeviceModel.create(req.body);

//             res.status(201).json({
//                 message: "Device created successfully",
//                 data: createdDevice
//             });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({
//                 message: "Error adding device",
//                 data: err.message
//             });
//         }
//     });
// };

// // Get devices by device profile
// const getDevicesByProfile = async (req, res) => {
//     try {
//         const devices = await DeviceModel.find({ deviceProfile: req.params.profile }).populate("customerId");
//         if (devices.length === 0) {
//             res.status(404).json({
//                 message: `No devices found with profile: ${req.params.profile}`
//             });
//         } else {
//             res.status(200).json({
//                 message: "Devices fetched successfully by profile",
//                 data: devices,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// // Get gateway devices
// const getGatewayDevices = async (req, res) => {
//     try {
//         const devices = await DeviceModel.find({ isGateway: true }).populate("customerId");
//         if (devices.length === 0) {
//             res.status(404).json({
//                 message: "No gateway devices found"
//             });
//         } else {
//             res.status(200).json({
//                 message: "Gateway devices fetched successfully",
//                 data: devices,
//             });
//         }
//     } catch (err) {
//         res.status(500).json({
//             message: err.message
//         });
//     }
// };

// module.exports = {
//     addDevice,
//     getAllDevices,
//     getAllDevicesByCustomerId,
//     getDeviceById,
//     updateDevice,
//     deleteDevice,
//     addDeviceWithFile,
//     getDevicesByProfile,
//     getGatewayDevices
// };

const DeviceModel = require('../model/deviceModel');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('file');

const addDevice = async (req, res) => {
    try {
        console.log('Received device data:', req.body);
        
        // Validate required fields
        const { name, label, deviceProfile } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Device name is required"
            });
        }
        
        if (!label || !label.trim()) {
            return res.status(400).json({
                message: "Device label is required"
            });
        }

        if (!deviceProfile) {
            return res.status(400).json({
                message: "Device profile is required"
            });
        }

        // Validate deviceProfile enum
        const validProfiles = [
            'default', 
            'Air Qulaity Sensor ',  // Keep the typo to match schema
            'Charging Port', 
            'Heat Sensor', 
            'sand Filter',
            'Valve', 
            'Water sensor', 
            'PH sensor'
        ];

        if (!validProfiles.includes(deviceProfile)) {
            return res.status(400).json({
                message: `Invalid device profile. Valid profiles are: ${validProfiles.join(', ')}`
            });
        }

        // Validate customerId if provided
        if (req.body.customerId && req.body.customerId.trim()) {
            if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
                return res.status(400).json({
                    message: "Invalid customer ID format"
                });
            }
        }

        // Clean the data
        const deviceData = {
            name: name.trim(),
            label: label.trim(),
            deviceProfile: deviceProfile,
            isGateway: req.body.isGateway || false,
            description: req.body.description ? req.body.description.trim() : ''
        };

        // Only add customerId if it's provided and valid
        if (req.body.customerId && req.body.customerId.trim()) {
            deviceData.customerId = req.body.customerId.trim();
        }

        console.log('Creating device with data:', deviceData);
        
        const savedDevice = await DeviceModel.create(deviceData);
        
        console.log('Device created successfully:', savedDevice);
        
        res.status(201).json({
            message: "Device added successfully",
            data: savedDevice,
        });
    } catch (err) {
        console.error('Error creating device:', err);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                message: "Validation error",
                errors: errors
            });
        }
        
        // Handle duplicate key errors
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Device with this information already exists"
            });
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const getAllDevices = async (req, res) => {
    try {
        const devices = await DeviceModel.find().populate("customerId", "name email");
        
        res.status(200).json({
            message: "All devices fetched successfully",
            data: devices,
            count: devices.length
        });
    } catch (err) {
        console.error('Error fetching devices:', err);
        res.status(500).json({
            message: "Error fetching devices",
            error: err.message
        });
    }
};

const getAllDevicesByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                message: "Invalid customer ID format"
            });
        }
        
        const devices = await DeviceModel.find({ customerId: customerId }).populate("customerId");
        
        res.status(200).json({
            message: "Customer devices fetched successfully",
            data: devices,
            count: devices.length
        });
    } catch (err) {
        console.error('Error fetching devices by customer:', err);
        res.status(500).json({
            message: "Error fetching devices by customer",
            error: err.message
        });
    }
};

const getDeviceById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid device ID format"
            });
        }
        
        const device = await DeviceModel.findById(id).populate("customerId");
        
        if (!device) {
            return res.status(404).json({
                message: "Device not found"
            });
        }
        
        res.status(200).json({
            message: "Device fetched successfully",
            data: device,
        });
    } catch (err) {
        console.error('Error fetching device:', err);
        res.status(500).json({
            message: "Error fetching device",
            error: err.message
        });
    }
};

const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid device ID format"
            });
        }

        // Validate customerId if provided
        if (req.body.customerId && req.body.customerId.trim()) {
            if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
                return res.status(400).json({
                    message: "Invalid customer ID format"
                });
            }
        }

        const updatedDevice = await DeviceModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate("customerId");

        if (!updatedDevice) {
            return res.status(404).json({
                message: "Device not found"
            });
        }

        res.status(200).json({
            message: "Device updated successfully",
            data: updatedDevice
        });
    } catch (err) {
        console.error("Update error:", err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                message: "Validation error",
                errors: errors
            });
        }
        
        res.status(500).json({
            message: "Error updating device",
            error: err.message
        });
    }
};

const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log("Delete request received with ID:", id);
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid device ID format"
            });
        }

        const deletedDevice = await DeviceModel.findByIdAndDelete(id);

        if (!deletedDevice) {
            return res.status(404).json({
                message: "Device not found"
            });
        }

        res.status(200).json({
            message: "Device deleted successfully",
            deletedId: id
        });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({
            message: "Error deleting device",
            error: err.message
        });
    }
};

const addDeviceWithFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({
                message: "File upload error: " + err.message
            });
        }

        try {
            console.log('Received data:', req.body);

            // Use the same validation logic as addDevice
            const { name, label, deviceProfile } = req.body;
            
            if (!name || !name.trim()) {
                return res.status(400).json({
                    message: "Device name is required"
                });
            }
            
            if (!label || !label.trim()) {
                return res.status(400).json({
                    message: "Device label is required"
                });
            }

            // Validate deviceProfile enum
            const validProfiles = [
                'default', 
                'Air Qulaity Sensor ',
                'Charging Port', 
                'Heat Sensor', 
                'sand Filter',
                'Valve', 
                'Water sensor', 
                'PH sensor'
            ];

            if (!validProfiles.includes(deviceProfile)) {
                return res.status(400).json({
                    message: `Invalid device profile. Valid profiles are: ${validProfiles.join(', ')}`
                });
            }

            // Handle file upload if needed
            // if (req.file) {
            //     // Add file handling logic here
            // }

            const createdDevice = await DeviceModel.create(req.body);

            res.status(201).json({
                message: "Device created successfully",
                data: createdDevice
            });
        } catch (err) {
            console.error('Error in addDeviceWithFile:', err);
            
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(error => error.message);
                return res.status(400).json({
                    message: "Validation error",
                    errors: errors
                });
            }
            
            res.status(500).json({
                message: "Error adding device",
                error: err.message
            });
        }
    });
};

// Get devices by device profile
const getDevicesByProfile = async (req, res) => {
    try {
        const { profile } = req.params;
        const devices = await DeviceModel.find({ deviceProfile: profile }).populate("customerId");
        
        res.status(200).json({
            message: "Devices fetched successfully by profile",
            data: devices,
            count: devices.length
        });
    } catch (err) {
        console.error('Error fetching devices by profile:', err);
        res.status(500).json({
            message: "Error fetching devices by profile",
            error: err.message
        });
    }
};

// Get gateway devices
const getGatewayDevices = async (req, res) => {
    try {
        const devices = await DeviceModel.find({ isGateway: true }).populate("customerId");
        
        res.status(200).json({
            message: "Gateway devices fetched successfully",
            data: devices,
            count: devices.length
        });
    } catch (err) {
        console.error('Error fetching gateway devices:', err);
        res.status(500).json({
            message: "Error fetching gateway devices",
            error: err.message
        });
    }
};

module.exports = {
    addDevice,
    getAllDevices,
    getAllDevicesByCustomerId,
    getDeviceById,
    updateDevice,
    deleteDevice,
    addDeviceWithFile,
    getDevicesByProfile,  
    getGatewayDevices
};
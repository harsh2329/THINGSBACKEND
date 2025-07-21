const express = require('express');
const router = express.Router();
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    restoreCustomer,
    getCustomerStats
} = require('../controller/CustomerController');

// Customer CRUD routes
router.post('/add', createCustomer);                    // POST /customer/add
router.get('/all', getAllCustomers);                    // GET /customer/all
router.get('/stats', getCustomerStats);                 // GET /customer/stats
router.get('/:id', getCustomerById);                    // GET /customer/:id
router.put('/:id', updateCustomer);                     // PUT /customer/:id
router.delete('/:id', deleteCustomer);                  // DELETE /customer/:id
router.patch('/:id/restore', restoreCustomer);          // PATCH /customer/:id/restore

module.exports = router;
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');

// Route 1: Create a oder-medicine using: POST "/api/order/medicine". Login required
router.post("/medicine", [
    // adding validators
    body('medicineName', 'Enter a valid medicine name').isLength({ min: 2 }),
    body('quantity', 'Enter a valid quantity of min 1').isInt({ min: 1 }),
    body('address', 'Address is required').notEmpty(),
    body('mobileNumber', 'Enter a valid mobile number').matches(/^[0-9]{10,15}$/), // Validates a 10 to 15 digit mobile number
    body('additionalInfo', 'Additional info must be a string').optional().isString(),
], fetchuser, async (req, res) => {

    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    let success = true;
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { medicineName, quantity, address, mobileNumber, additionalInfo } = req.body; // destructuring the body of the request

        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const order = new Order({
            medicineName,
            quantity,
            address,
            mobileNumber,
            additionalInfo,
            user: req.user.id // associating the order with the user
        });

        const savedOrder = await order.save();
        success = true;
        res.json({ success, savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }


});

// Route 2: Get all orders of the logged-in user using: GET "/api/order/myorders". Login required
router.get('/myorders', fetchuser, async (req, res) => {
    try {
        // Get all orders of the logged-in user
        const orders = await Order.find({ user: req.user.id });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }
});

// Add fields to your Order model for billing and payment info as needed

// router.post('/complete', fetchuser, async (req, res) => {
//     try {
//         const { medicineName, quantity, address, mobileNumber, additionalInfo, billingInfo, paymentInfo } = req.body;

//         // Optionally: verify paymentInfo with Razorpay here

//         const order = new Order({
//             medicineName,
//             quantity,
//             address,
//             mobileNumber,
//             additionalInfo,
//             billingInfo,   // add this field to your schema if needed
//             paymentInfo,   // add this field to your schema if needed
//             user: req.user.id
//         });

//         const savedOrder = await order.save();
//         res.json({ success: true, savedOrder });
//     } catch (error) {
//         res.status(500).send("Internal server Error");
//     }
// });

// {
//     "medicineName": "Paracetamol",
//         "quantity": 2,
//             "address": "123 Main St",
//                 "mobileNumber": "9876543210",
//                     "additionalInfo": "",
//                         "billing": {
//         "fullName": "John Doe",
//             "email": "john@example.com",
//                 "address": "123 Main St",
//                     "city": "Delhi",
//                         "state": "Delhi",
//                             "zip": "110001"
//     },
//     "payment": {
//         "paymentId": "pay_123456",
//             "orderId": "order_123456",
//                 "signature": "abc123",
//                     "amount": 200,
//                         "method": "card",
//                             "status": "success"
//     }
// }

module.exports = router;


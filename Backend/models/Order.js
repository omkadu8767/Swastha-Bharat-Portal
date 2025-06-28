const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const OrderSchema = new Schema({
    medicineName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    address: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10,15}$/  // Validates a 10 to 15 digit mobile number
    },
    additionalInfo: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

// const BillingSchema = new Schema({
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     zip: { type: String, required: true }
// }, { _id: false });

// const PaymentSchema = new Schema({
//     paymentId: { type: String, required: true }, // Razorpay payment ID
//     orderId: { type: String, required: true }, // Razorpay order ID
//     signature: { type: String },                 // Razorpay signature (optional)
//     amount: { type: Number, required: true },
//     method: { type: String, required: true }, // e.g., 'card', 'upi'
//     status: { type: String, required: true }  // e.g., 'success', 'failed'
// }, { _id: false });

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
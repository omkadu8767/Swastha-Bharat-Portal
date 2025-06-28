const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const BookSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true,
        minLength: 10,
        match: /^[0-9]{10,15}$/  // Validates a 10 to 15 digit mobile number

    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: Date,  //yyyy-mm-dd format
        required: true,
    },
    time: {
        type: String,
        required: true,
        // Optionally, add a regex to validate format
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/i  // HH:MM format
    },
    info: {
        type: String,
        default: 'Patient Booking Appointment for General Checkup',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;
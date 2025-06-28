const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


// Route 1: Create a book-appointment using: POST "/api/book/appointment". Login required
router.post('/appointment', [
    // adding validators
    // body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('number', 'Enter a valid number of min 10 char').isLength({ min: 10 }),
    // body('email', 'Enter a valid email').isEmail(),
    body('date', 'Enter a valid date').isDate(), // yyyy-mm-dd format
    body('time', 'Enter a valid time in HH:MM format').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i), // HH:MM format
    body('info', 'Info must be a string').optional().isString(),
], fetchuser, async (req, res) => {

    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    success = true;
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether the appointment date exists already
    try {
        const { name, number, email, date, time, info } = req.body; // destructuring the body of the request

        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check for existing appointment
        const existing = await Book.findOne({ user: req.user.id, date: req.body.date });
        if (existing) {
            return res.status(400).json({ success: false, error: "You already have an appointment on this date." });
        }

        const book = new Book({
            name: user.name,
            number,
            email: user.email,
            date,
            time,
            info,
            user: req.user.id // associating the appointment with the user
        })
        const savedBook = await book.save();
        success = true;
        res.json({ success, savedBook });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }

}
);

// Route 2: Get all the appointments of a user using: GET "/api/book/appointments". Login required
router.get('/appointments', fetchuser, async (req, res) => {
    try {
        const appointments = await Book.find({ user: req.user.id });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }
}
);

// Route 3: Edit an appointment using: PUT "/api/book/appointment/:id". Login required
router.put('/appointment/:id', [
    // adding validators
    body('number', 'Enter a valid number of min 10 char').isLength({ min: 10 }),
    body('date', 'Enter a valid date').isDate(), // yyyy-mm-dd format
    body('time', 'Enter a valid time in HH:MM format').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i), // HH:MM format
    body('info', 'Info must be a string').optional().isString(),
], fetchuser, async (req, res) => {

    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    success = true;
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { name, number, email, date, time, info } = req.body; // destructuring the body of the request

        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Find the appointment by ID and update it
        let book = await Book.findByIdAndUpdate(
            req.params.id,
            {
                name: user.name,
                number,
                email: user.email,
                date,
                time,
                info,
                user: req.user.id // associating the appointment with the user
            },
            { new: true } // return the updated document
        );
        if (!book) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }
        success = true;
        res.json({ success, book });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }
}
);


// Route 4: Delete an appointment using: DELETE "/api/book/appointment/:id". Login required
router.delete('/appointment/:id', fetchuser, async (req, res) => {
    try {
        // Find the appointment by ID and delete it
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }
        success = true;
        res.json({ success, message: "Appointment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server Error ");
    }
}
);

module.exports = router;
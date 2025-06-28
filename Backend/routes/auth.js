const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = process.env.JWT_SECRET;

//Route 1: Create a User using: POST "/api/auth/createuser" . Doesn't require login
router.post('/createuser', [
    // adding validators
    body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password of min 5 char').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    success = true;
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({ success, errors: errors.array() });
    }


    // check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            success = false;
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        success = true;


        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken);
        success = true;
        res.json({ success, authToken: authToken });
    } catch (error) {
        success = false;
        console.error(success, error);
        res.status(500).send("Internal server Error ");
    }
},
);

// Route 2: Check a User using: POST "/api/auth/login" . Doesn't require login
router.post('/login', [
    // adding validators
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;     // destructuring the email and password from the request body
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "Please enter correct credentials" });
        }

        const passwordcheck = await bcrypt.compare(password, user.password);
        if (!passwordcheck) {
            success = false
            return res.status(400).json({ success, error: "Please enter correct credentials" });

        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken: authToken });

    } catch (error) {
        success = false;
        console.error(success, error);
        res.status(500).send("Internal server Error ");
    }
});


// Route 3: Get User details using: POST "/api/auth/getuser" . login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        success = true;
        res.send(user);

    } catch (error) {
        success = false;
        console.error(success, error.message);

        res.status(500).send("Internal server Error ");

    }
});

// Get current user info
router.get('/me', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
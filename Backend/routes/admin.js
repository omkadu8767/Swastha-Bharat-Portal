const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const isAdmin = require('../middleware/isAdmin');
const Book = require("../models/Book");
const Order = require('../models/Order');
const JWT_SECRET = process.env.JWT_SECRET;


// GET all users
router.get("/users", fetchuser, isAdmin, async (req, res) => {
    const users = await User.find({}, "-password");
    res.json(users);
});

// GET all appointments
router.get("/appointments", fetchuser, isAdmin, async (req, res) => {
    const appointments = await Book.find().populate("user");
    res.json(appointments);
});

// GET all orders
router.get("/orders", fetchuser, isAdmin, async (req, res) => {
    const orders = await Order.find().populate("user");
    res.json(orders);
});

module.exports = router;


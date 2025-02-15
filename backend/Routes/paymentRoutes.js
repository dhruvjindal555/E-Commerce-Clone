const express = require('express');
const { createPayment } = require('../Controllers/PaymentController');
const fetchUser = require('../Middleware/fetchUser');
const router = express.Router()

router.post('/create-payment-intent', fetchUser, createPayment);

module.exports = router;

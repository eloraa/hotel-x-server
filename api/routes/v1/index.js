const express = require('express');
const router = express.Router();
const newletterroute = require('./newsletter.route');
const roomsroute = require('./rooms.route');
const authroute = require('./auth.route');
const bookingroute = require('./booking.route');
const reviewroute = require('./review.route');
const careerroute = require('./career.route');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

// ROUTES
router.use('/newsletter', newletterroute)
router.use('/rooms', roomsroute)
router.use('/booking', bookingroute)
router.use('/review', reviewroute)
router.use('/auth', authroute)
router.use('/career', careerroute)


module.exports = router;

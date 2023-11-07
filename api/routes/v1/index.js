const express = require('express');
const router = express.Router();
const newletterroute = require('./newsletter.route');
const roomsroute = require('./rooms.route');
const authroute = require('./auth.route');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

// ROUTES
router.use('/newsletter', newletterroute)
router.use('/rooms', roomsroute)
router.use('/auth', authroute)


module.exports = router;

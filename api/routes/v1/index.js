const express = require('express');
const router = express.Router();
const newletterroute = require('./newsletter.route');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

// ROUTES
router.use('/newsletter', newletterroute)


module.exports = router;

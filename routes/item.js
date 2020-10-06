const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.js');


// Routes
router.get('/:url', controller.getItem);


module.exports = router;
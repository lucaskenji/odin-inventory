const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.js');


// Routes
router.get('/', controller.getAllCategories);
router.get('/:url', controller.getCategory);


module.exports = router;
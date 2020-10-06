const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.js');


// Routes
router.get('/', controller.getAllCategories);

router.get('/new', controller.getCategoryForm);

router.get('/:url', controller.getCategory);

router.post('/new', controller.categoryValidation, controller.addNewCategory);


module.exports = router;
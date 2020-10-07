const express = require('express');
const router = express.Router();
const controller = require('../controllers/category.js');


// Routes
router.get('/', controller.getAllCategories);

router.get('/new', controller.getCategoryForm);

router.get('/edit/:url', controller.getUpdateForm);

router.get('/delete/:url', controller.getDeletePrompt);

router.get('/:url', controller.getCategory);

router.post('/new', controller.categoryValidation, controller.addNewCategory);

router.post('/edit/:url', controller.categoryValidation, controller.editCategory);

router.post('/delete/:url', controller.deleteCategory);

module.exports = router;
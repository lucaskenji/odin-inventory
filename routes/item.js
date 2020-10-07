const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.js');


// Routes
router.get('/new', controller.getItemForm);

router.get('/edit/:url', controller.getUpdateForm);

router.get('/delete/:url', controller.getDeletePrompt);

router.get('/:url', controller.getItem);

router.post('/new', controller.itemValidation, controller.addNewItem);

router.post('/edit/:url', controller.itemValidation, controller.editItem);

router.post('/delete/:url', controller.deleteItem);


module.exports = router;
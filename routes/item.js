const express = require('express');
const router = express.Router();
const controller = require('../controllers/item.js');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix + file.originalname);
	}
});
const upload = multer({ storage: storage });

// Routes
router.get('/new', controller.getItemForm);

router.get('/edit/:url', controller.getUpdateForm);

router.get('/delete/:url', controller.getDeletePrompt);

router.get('/:url', controller.getItem);

router.post('/new', upload.single('photo'), controller.itemValidation, controller.addNewItem);

router.post('/edit/:url', upload.single('photo'), controller.itemValidation, controller.editItem);

router.post('/delete/:url', controller.deleteItem);


module.exports = router;
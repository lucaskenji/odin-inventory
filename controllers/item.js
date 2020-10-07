const mongoose = require('mongoose');
const Category = require('../models/Category.js');
const Item = require('../models/Item.js');
const { body, validationResult } = require('express-validator');


const getItem = (req, res) => {
	const url = req.params.url;
	
	Item.findOne({ url }).populate('category').lean().then((result) => {
		if (result) {
			return res.render('item', { item: result });
		}
		return res.render('notfound');
	});
}

const getItemForm = (req, res) => {
	Category.find().lean()
	.then((results) => {
		res.render('forms/item', { categories: results });
	})
	.catch((err) => {
		res.status(500).send('Internal server error');
	})
};

const itemValidation = [
	body('name').not().isEmpty().withMessage('You must provide a name for the item.').escape().trim(),
	body('description').not().isEmpty().withMessage('You must provide a description for the item.').escape().trim(),
	body('category').not().isEmpty().withMessage('You must provide a category for the item.'),
	body('price').not().isEmpty().withMessage('You must provide a price for the item.'),
	body('price').isNumeric().withMessage('You must provide a valid price.'),
	body('stock').not().isEmpty().withMessage('You must provide a stock for the item.'),
	body('stock').isNumeric().isInt({ min: 0 }).withMessage('You must provide a valid stock.'),
	body('url').not().isEmpty().withMessage('You must provide an URL for the item.'),
	body('url').not().equals('new'),
	body('url').not().equals('edit').withMessage('The URL provided is already being used.').escape().trim()
];

const addNewItem = (req, res) => {
	Category.find().lean()
	.then((categories) => {
		let errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			errors = errors.array().map(error => error.msg);
			return res.render('forms/item', { errors, categories });
		}
		
		Item.findOne({ url: req.body.url })
		.then((result) => {
			if (result) {
				res.render('forms/item', { errors: ['The URL provided is already being used.'], categories });
			}
			
			const newItem = new Item({
				name: req.body.name,
				description: req.body.description,
				category: req.body.category,
				price: req.body.price,
				stock: req.body.stock,
				url: req.body.url
			});
			
			newItem.save((err) => {
				if (err) {
					throw err;
				}
				
				return res.redirect('/');
			})
		})
		.catch((err) => {
			res.status(500).send("Internal server error");
		})
	});
}

const getUpdateForm = (req, res) => {
	Item.findOne({ url: req.params.url }).lean().populate('category').then((result) => {
		if (result) {
			Category.find().lean().then((categories) => {
				if (categories) {
					return res.render('forms/edititem', { item: result, categories });
				}
				throw new Error('internal server error');
			});
		} else {
			return res.render('notfound');
		}
	})
	.catch((err) => {
		res.status(500).send('Internal server error');
	})
}

const editItem = (req, res) => {
	Item.findOne({ url: req.params.url }).lean()
	.then((currentItem) => {
		
		Category.find().lean()
		.then((categories) => {
			let errors = validationResult(req);
			
			if (!errors.isEmpty()) {
				errors = errors.array().map(error => error.msg);
				return res.render('forms/edititem', { errors, categories, item: currentItem });
			}
			
			Item.findOne({ url: req.body.url }).lean()
			.then((result) => {
				if (result && result.url !== req.params.url) {
					return res.render('forms/edititem', { errors: ['The URL provided is already being used.'], categories, item: currentItem });
				}
				
				Item.updateOne({ url: req.params.url }, {
					name: req.body.name,
					description: req.body.description,
					category: req.body.category,
					price: req.body.price,
					stock: req.body.stock,
					url: req.body.url
				})
				.then(() => {
					return res.redirect('/');
				});
			});
		});
		
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send("Internal server error");
	});
}


module.exports = {
	getItem,
	getItemForm,
	itemValidation,
	addNewItem,
	getUpdateForm,
	editItem
}
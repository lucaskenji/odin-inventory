const mongoose = require('mongoose');
const Category = require('../models/Category.js');
const Item = require('../models/Item.js');
const { body, validationResult } = require('express-validator');

const getAllCategories = (req, res) => {
	Category.find()
	.lean()
	.then((results) => {
		res.render('categories', { categories: results });
	})
	.catch((err) => {
		res.status(500).send("Internal server error");
	});
}

const getCategory = (req, res) => {
	const url = req.params.url;
	
	Category.findOne({ url })
	.lean()
	.then((result) => {
		
		Item.find({ category: result._id })
		.lean()
		.then((results) => {
			res.render('category', { category: result, items: results });
		})
		
	})
	.catch((err) => {
		res.status(500).send("Internal server error");
	});
}

const getCategoryForm = (req, res) => {
	res.render('forms/category');
}

const categoryValidation = [
	body('name').not().isEmpty().withMessage('You must provide a name for the category.').trim().escape(),
	body('description').trim().escape(),
	body('url').not().isEmpty().withMessage('You must provide a URL for the category.').trim().escape(),
	body('url').not().equals('new').withMessage('The URL provided is already being used.')
];

const addNewCategory = (req, res) => {
	let errors = validationResult(req);
	
	if (!errors.isEmpty()) {
		errors = errors.array().map(error => error.msg);
		return res.render('forms/category', { errors });
	}
	
	Category.findOne({ url: req.body.url })
	.then((result) => {
		if (result) {
			return res.render('forms/category', { errors: ['The URL provided is already being used.'] });
		}
		
		const newCategory = new Category({
			name: req.body.name,
			description: req.body.description,
			url: req.body.url
		});
		
		newCategory.save((err) => {
			if (err) {
				throw err;
			}
			
			return res.redirect('/');
		})
	})
	.catch((err) => {
		res.status(500).send("Internal server error");
	});
}

module.exports = {
	getAllCategories,
	getCategory,
	getCategoryForm,
	categoryValidation,
	addNewCategory
}
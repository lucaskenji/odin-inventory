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
		
		if (result) {
			Item.find({ category: result._id })
			.lean()
			.then((results) => {
				return res.render('category', { category: result, items: results });
			})
		} else {
			return res.render('notfound');
		}
		
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
	body('url').not().isEmpty().withMessage('You must provide an URL for the category.').trim().escape(),
	body('url').not().equals('new').withMessage('The URL provided is already being used.'),
	body('url').not().equals('edit').withMessage('The URL provided is already being used.'),
	body('url').not().equals('delete').withMessage('The URL provided is already being used.')
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
				return res.status(500).send("Internal server error");
			}
			
			return res.redirect('/');
		})
	})
	.catch((err) => {
		res.status(500).send("Internal server error");
	});
}

const getUpdateForm = (req, res) => {
	Category.findOne({ url: req.params.url }).lean()
	.then((result) => {
		if (result) {
			return res.render('forms/editcategory', { category: result });
		}
		
		return res.render('notfound');
	})
	.catch((err) => {
		res.status(500).send('Internal server error');
	})
}

const editCategory = (req, res) => {
	Category.findOne({ url: req.params.url }).lean()
	.then((currentCategory) => {
		let errors = validationResult(req);
		
		if (!errors.isEmpty()) {
			errors = errors.array().map(error => error.msg);
			return res.render('forms/editcategory', { errors, category: currentCategory });
		}
		
		const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
		
		if (req.body.admin_pwd !== adminPassword) {
			return res.render('forms/editcategory', { errors: ['Incorrect password.'], category: currentCategory });
		}		
		
		Category.findOne({ url: req.body.url }).lean()
		.then((result) => {
			if (result && result.url !== req.params.url) {
				return res.render('forms/editcategory', { errors: ['The URL provided is already being used.'], category: currentCategory });
			}
			
			Category.updateOne({ url: req.params.url }, {
				name: req.body.name,
				description: req.body.description,
				url: req.body.url
			})
			.then(() => {
				return res.redirect('/')
			});
			
		});
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send("Internal server error");
	});
}

const getDeletePrompt = (req, res) => {
	Category.findOne({url: req.params.url}).then((result) => {
		if (result) {
			return res.render('forms/deletecategory');
		}
		
		return res.render('notfound');
	});
}

const deleteCategory = (req, res) => {
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
	
	if (req.body.admin_pwd !== adminPassword) {
		return res.render('forms/deletecategory', { errors: ['Incorrect password.'] });
	}
	
	Category.findOneAndDelete({url: req.params.url}).then((result, ok) => {
		if (!result) {
			return res.render('notfound');
		}
		
		Item.deleteMany({category: result._id}).then((deleteResults) => {
			if (!deleteResults.ok) {
				return res.status(500).send("Internal server error");
			}
			
			return res.redirect('/');
		})
	})
	.catch(() => {
		res.status(500).send('Internal server error');
	});
}

module.exports = {
	getAllCategories,
	getCategory,
	getCategoryForm,
	categoryValidation,
	addNewCategory,
	getUpdateForm,
	editCategory,
	getDeletePrompt,
	deleteCategory
}
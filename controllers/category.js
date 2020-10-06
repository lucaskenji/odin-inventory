const mongoose = require('mongoose');
const Category = require('../models/Category.js');
const Item = require('../models/Item.js');

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

module.exports = {
	getAllCategories,
	getCategory
}
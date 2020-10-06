const mongoose = require('mongoose');
const Category = require('../models/Category.js');

const getAllCategories = (req, res) => {
	Category.find().then((results) => {
		res.send(results);
	})
}

const getCategory = (req, res) => {
	const url = req.params.url;
	
	Category.findOne({ url }).then((result) => {
		res.send(result);
	})
}

module.exports = {
	getAllCategories,
	getCategory
}
const mongoose = require('mongoose');
const Item = require('../models/Item.js');

const getItem = (req, res) => {
	const url = req.params.url;
	
	Item.findOne({ url }).populate('category').lean().then((result) => {
		console.log(result);
		res.render('item', { item: result });
	});
}

module.exports = {
	getItem
}
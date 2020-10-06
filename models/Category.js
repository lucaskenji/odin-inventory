const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	name: String,
	description: String,
	url: String
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
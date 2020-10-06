const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	name: String,
	description: String,
	category: {
		type: Schema.Types.ObjectId,
		ref: 'categories'
	},
	price: Number,
	stock: Number,
	url: String
});

const Item = mongoose.model('items', itemSchema);

module.exports = Item;
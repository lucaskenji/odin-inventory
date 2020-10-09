require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const categoriesRouter = require('./routes/category.js');
const itemsRouter = require('./routes/item.js');

const PORT = process.env.PORT || 8080;
const USER = process.env.MONGOUSER;
const PASSWORD = process.env.MONGOPASSWORD;


// Config
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@cluster.1qhnm.gcp.mongodb.net/inventory?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

mongoose.set('useCreateIndex', true);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const Handlebars = exphbs.create({});

Handlebars.handlebars.registerHelper('ifCond', function(v1, v2, options) {
	// used for id comparison
	if (v1.equals(v2)) {
		return options.fn(this);
	}
	return options.inverse(this);
});

app.use(express.static(path.join(__dirname, 'public')));


// Middlewares & routes
app.use('/category', categoriesRouter);
app.use('/item', itemsRouter);

app.get('/', (req, res) => {
	res.redirect('/category');
});


// Start server
app.listen(PORT, () => {
	console.log("Server listening at port " + PORT);
});
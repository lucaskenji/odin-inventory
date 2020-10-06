require('dotenv').config();
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const categoriesRouter = require('./routes/category.js');
const itemsRouter = require('./routes/item.js');

const PORT = process.env.PORT || 8080;
const USER = process.env.MONGOUSER;
const PASSWORD = process.env.MONGOPASSWORD;

// Config
mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@cluster.1qhnm.gcp.mongodb.net/inventory?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Middlewares & routes
app.use('/category', categoriesRouter);
app.use('/item', itemsRouter);


// Start server
app.listen(PORT, () => {
	console.log("Server listening at port " + PORT);
});
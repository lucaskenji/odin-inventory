const express = require('express');
const app = express();
const mongoose = require('mongoose');
const categoriesRouter = require('./routes/category.js');

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


// Middlewares & routes
app.use('/category', categoriesRouter);


// Start server
app.listen(PORT, () => {
	console.log("Server listening at port " + PORT);
});
const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });


//url for mongo db connection
const mongoURL = process.env.DB_URL; 
//const mongoURL = process.env.DB_URL_LOCAL; 

//setup mongo db connection
mongoose.connect(mongoURL);

//get the default connection object
const db = mongoose.connection;

//event listeners for the connection
db.on('connected',() =>{
    console.log('MongoDB connected successfully');
});
db.on('disconnected',() =>{
    console.log('MongoDB disconnected');
});
db.on('error',(err) =>{
    console.log('MongoDB connection error:', err);
});

module.exports = db;
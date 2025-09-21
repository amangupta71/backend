const express = require('express');
const app = express();
const dp = require('./db');
require('dotenv').config();

//required for post request
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.get('/',(req, res) => {
    res.send('welcome to my resturent');
});

    
//import the router
const personRoutes = require('./routes/personRoutes');
//use the router middleware
app.use('/person', personRoutes);


const menuRoutes = require('./routes/menuRoutes');
app.use('/menu', menuRoutes);
    
    
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('server is running on port 3000');
});








const express = require('express');
const app = express();
const dp = require('./db');
require('dotenv').config({ quiet: true });
const passport = require('./auth');

//required for post request
const bodyParser = require('body-parser');
app.use(bodyParser.json());



//middleware
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
    next();
};
app.use(logRequest);

//app.get('/',logRequest,(req, res) => {  this is for indivisual middleware example
//   res.send('welcome to my resturent');
//});
app.get('/',(req, res) => { 
  res.send('welcome to my resturent');
});




app.use(passport.initialize());    
const localAuthMiddleware = passport.authenticate('local',{session:false});

// app.get('/',localAuthMiddleware,(req, res) => { 
//   res.send('welcome to my resturent');
// });
    


//import the router
const personRoutes = require('./routes/personRoutes');
//use the router middleware
app.use('/person',localAuthMiddleware, personRoutes);


const menuRoutes = require('./routes/menuRoutes');
app.use('/menu',menuRoutes);
    
    
const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('server is running on port 3000');
});








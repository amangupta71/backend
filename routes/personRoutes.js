const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const passport = require('passport');
const auth = require('../auth');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');


const app = express();
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local',{session:false});


// Route to add a new person    
router.post('/signup', async (req,res) =>{
    try{
        const data = req.body; // assume body contains JSON data(person data)
        

        // Check if the username already exists
        const existingUser = await Person.findOne({ username: data.username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists, try another username.' });
        }
        // Check if the email already exists
        const existingUseremail = await Person.findOne({ email: data.email });
        if (existingUseremail) {
            return res.status(409).json({ error: 'this email is already signup, go to login page' });
        }


         //create new person document using mongoose model
         const newPerson = new Person(data);

         //add new person to database we didn't use call back function
         const response = await newPerson.save();
         console.log('person added:', response.name);


         //token generation using payload data
         const payload = { id: response.id, username: response.username, work: response.work};
         const token = generateToken({ payload});


         res.status(201).json({response:response , token:token}); // send back the created person document with 201 status code
       } 
    catch (error) {
         console.error('Error signup person:', error);
         res.status(500).send({error: 'Failed to sign person'});
    }    
});




// Route to login a person
router.post('/login', async(req,res) =>{

    try {
        const{username, password} = req.body; // assume body contains JSON data with username and password

        //find the person by username
        const user = await Person.findOne({username:username});

        //if user is not found or password does not match
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }


        console.log('person logged in:', user.name);

        //token generation using payload data
        payload = { id: user.id, username: user.username};
        const token = generateToken({ payload});
        res.json({message: 'Login successful', token: token});

        
    } catch (error) {
        console.error('Error login person:', error);
        res.status(500).send({error: 'Failed to login person'});
    }
});
    

//profile route to get person details
router.get('/profile', jwtAuthMiddleware, async(req,res) =>{
    try {
        const userData = req.user.payload; // req.user is set by jwtAuthMiddleware after verifying the token       
        console.log("Fetching profile for user:", userData);
        
        const userId = userData.id;
        const user = await Person.findById(userId); 
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json(user);
    } catch (error) {
               console.error(error);
        res.status(500).send({error: 'Internal Server Error'});
    }
});
    
router.get('/',jwtAuthMiddleware, async (req,res) =>{
        try{
            //fetch all persons from database  
            //to get all filds
            const persons = await Person.find(); 

            // to get specific value 
            console.log('information fetched of:', persons.length ,'persons');
            res.status(200).json(persons); // send back the list of persons with 200 status code
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({error: 'Failed to fetch persons'});
        }
});


    // to get ditail of specific person(work type)

router.get('/:workType',jwtAuthMiddleware,async(req,res) =>{
        try{
            const workType = req.params.workType; //get work type that user whants
        if(workType == 'chef' ||workType == 'manager' ||workType == 'waiter'){
            const response = await Person.find({work:workType}).select('name salary');
            console.log(workType + ' data feached');
            res.status(200).json(response)
        }
        else{
            res.status(400).json({error :'Invalid work type'})
        }
    }catch(err){
        console.error('Error fetching person Type:', err);
        res.status(500).json({error: 'Failed to fetch '+ workType + ' persons'});

    }
});

router.put('/:id',jwtAuthMiddleware, async(req,res) =>{
    try{
        const personId = req.params.id; //extract the id from the url parameters
        const updatesPersonData = req.body; // update data for the person and assume body contains JSON data with updated fields

        const response = await Person.findByIdAndUpdate(personId, updatesPersonData, {
            new:true,  // return the updatedd document to response
            runValidators:true // run the mongoose schema validation
            });

            if(!response){
                return res.status(404).json({error: 'Person not found'});
            }

            console.log('person updated:', response.name);
            res.status(200).json(response); // send back the updated person document with 200 status code
    }
    catch(error){
        console.error('Error updating person:', error);
        res.status(500).json({error: 'Failed to update person'});
    }
});


router.delete('/:id',jwtAuthMiddleware, async(req,res) =>{
    try {
        const personId = req.params.id; //extract the id from the url parameters
        
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error: 'Person not found'});
        }
        console.log(response.name +' deleted',);
        res.status(200).json({message: response.name +' deleted successfully'});
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({error: 'Failed to delete person'});
    }
})
module.exports = router;




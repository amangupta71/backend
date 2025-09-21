const express = require('express');
const router = express.Router();
const Person = require('../models/Person');


router.post('/', async (req,res) =>{
    try{
        const data = req.body; // assume body contains JSON data(person data)


         //create new person document using mongoose model
         const newPerson = new Person(data);

         //add new person to database we didn't use call back function
         const response = await newPerson.save();
         console.log('person added:', response.name);
         res.status(201).send(response); // send back the created person document with 201 status code
       } 
    catch (error) {
         console.error('Error adding person:', error);
         res.status(500).send({error: 'Failed to add person'});
    }    
});


router.get('/', async (req,res) =>{
        try{
            //fetch all persons from database  
            //to get all filds
            const persons = await Person.find(); 
            // to get specific value 
            // const persons = await Person.find().select('name age');
            console.log('information fetched of:', persons.length ,'persons');
            res.status(200).json(persons); // send back the list of persons with 200 status code
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({error: 'Failed to fetch persons'});
        }
});


    // to get ditail of specific person(work type)

router.get('/:workType',async(req,res) =>{
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

router.put('/:id', async(req,res) =>{
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


router.delete('/:id', async(req,res) =>{
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




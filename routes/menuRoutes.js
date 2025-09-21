const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');


router.post('/', async(req,res) =>{
        try{
          const data = req.body; // assume body contains JSON data(menu data)

            //create new menu document using mongoose model 
            const newMenu = new Menu(data); 
            //add new menu to database we didn't use call back function
            const response = await newMenu.save();
            console.log('menu added:', response.name);
            res.status(201).send(response); // send back the created menu document with 201 status code
        }catch(error){
            onsole.error('Error fetching persons:', error);
            res.status
        }
});

router.get('/', async(req,res)=>{
        try{
            //fetch all menu from database
            const menus = await Menu.find().select('name price taste');
            console.log('menus fetched of:', menus.length, 'items');
            res.status(200).json(menus); // send back the list of menus with 200 status code
            
        }
        catch(error){   
            console.error('Error fetching menus:', error);
            res.status(500).json({error: 'Failed to fetch menus'});
        }
});

router.get('/:foodtype',async(req,res) =>{
        try{
            const foodtype = req.params.foodtype; //get food type that user want
        if(foodtype == 'spicy' ||foodtype == 'sweet' ||foodtype == 'sour'){
            const response = await Menu.find({taste:foodtype}).select('name price');
            console.log('response feached');
            res.status(200).json(response)
        }
        else{
            res.status(400).json({error :'Invalid food type'})
        }
    }catch(err){
        console.error('Error fetching person Type:', err);
        res.status(500).json({error: 'Failed to fetch '+ foodtype + ' items'});

    }
});


module.exports = router;

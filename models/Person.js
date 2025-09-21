const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
    },
    age:{
        type: Number,
    },
    work:{
        type: String,
        enum: ['chef', 'waiter', 'manager'],
        required: true,
    },
    mobile:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
    },
    salary:{
        type: Number,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{  
        type: String,
        required: true,
    }
});

personSchema.pre('save', async function(next){
    const person = this;
    if(!person.isModified('password'))return next();
    try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;

        next();

    } catch (error) {
        return next(err);
    }
});

personSchema.methods.comparePassword = function(candidatePassword){
    try {
        const isMatched = bcrypt.compare(candidatePassword, this.password);
        return isMatched;
    } catch (error) {
        
    }
}


//Create a person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person
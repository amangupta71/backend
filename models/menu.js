const mongoose = require('mongoose');4

const menuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    price:{
        type: Number,
        required: true,
    },
    taste:{
        type: String,
        enum: ['spicy', 'sweet', 'sour'],
        required: true,
    },
    is_drink:{
        type: Boolean,
        default: false
    }
});

//Create a menu model
const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu
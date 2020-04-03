// SCHEMA
const mongoose = require('mongoose');
var campgroundsSchema = new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
var Campground = mongoose.model('Campground',campgroundsSchema);
module.exports  = Campground;
var express = require("express");
    Campground    = require("../models/campground");
    router  = express.Router();
router.get("/",(req,res)=>{
    Campground.find({},(err,camps)=>{
        if(err){
            console.log("OOPS can't find campgrounds!!");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campsData:camps,currentUser:req.user});
        }
    });
   
});
router.post("/",(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {title:name,image:image,description:description};
   
    Campground.create(newCampground,(err,newCampground)=>{
        if(err){
            console.log("Its an ERROR!!");
            confirm.log(err);
        }
        else{
            
            res.redirect("/campgrounds");
        }
    });

    
});
router.get("/new",(req,res)=>{
    res.render("campgrounds/new",{currentUser:req.user});
});
router.get("/:id",(req,res)=>{
    // var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
        if(err){
            console.log("Not found");
            console.log(err);
        }else{
        console.log(camp);
        res.render("campgrounds/show",{campsData:camp});
        }
    });

    
});

module.exports = router;
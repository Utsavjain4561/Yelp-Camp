var express = require("express");
    Campground    = require("../models/campground");
    middleware = require("../middleware");
    router  = express.Router();
router.get("/",(req,res)=>{
    Campground.find({},(err,camps)=>{
        if(err){
            console.log("OOPS can't find campgrounds!!");
            console.log(err);
        }else{
            console.log("User whoe created "+camps);
            res.render("campgrounds/index",{campsData:camps,currentUser:req.user});
        }
    });
   
});
router.post("/",middleware.isLoggedIn,(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    };
    console.log(req.user);
    var newlyCampground = {title:name,image:image,price:price,description:description,author:author};
   
   
    Campground.create(newlyCampground,(err,newCampground)=>{
        if(err){
            
            console.log(err);
        }
        else{
            req.flash("success","Campground added successfully");
            res.redirect("/campgrounds");
        }
    });

    
});
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new",{currentUser:req.user});
});
router.get("/:id",(req,res)=>{
    // var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
        if(err){
            req.flash("error","Campground not found");
            res.redirect("back");
        }else{
        
        res.render("campgrounds/show",{campsData:camp});
        }
    });

    
});
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,editCampground)=>{
        
       res.render("campgrounds/edit",{campground:editCampground});
            });
    
});
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updateCampground)=>{
            res.redirect("/campgrounds/"+req.params.id);
    });
});

router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{{
            req.flash("success","Campgrounded deleted");
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
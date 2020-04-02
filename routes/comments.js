var express = require("express");
    Campground    = require("../models/campground");
    Comments    = require("../models/comments");
    router  = express.Router({mergeParams:true});
//COMMENTS route
router.get("/new",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });

});
router.post("/",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comments,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;
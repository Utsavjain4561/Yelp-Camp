var Campground = require('../models/campground');
    Comment    = require("../models/comments");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
middlewareObj.checkCommentOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        
        Comments.findById(req.params.comment_id,(err,editComment)=>{
            if(err){
                res.redirect("back");
            }else{
                if(editComment.author.id.equals(req.user._id)){
                    console.log("User is Authorized !!!!");
                    next();
            }else{
                    res.redirect("back");
                }
            }           
        });
    }else{
        res.redirect("back");
    }
}
middlewareObj.checkCampgroundOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id,(err,editCampground)=>{
            if(err){
                res.redirect("back");
            }else{
                if(editCampground.author.id.equals(req.user._id)){
                    console.log("User is Authorized !!!!");
                    next();
            }else{
                    res.redirect("back");
                }
            }           
        });
    }else{
        res.redirect("back");
    }
}

module.exports = middlewareObj  ;
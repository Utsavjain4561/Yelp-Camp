var Campground = require('../models/campground');
    Comment    = require("../models/comments");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You have to Login first to do that");
    res.redirect("/login");
}
middlewareObj.checkCommentOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        
        Comments.findById(req.params.comment_id,(err,editComment)=>{
            if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
            }else{
                if(editComment.author.id.equals(req.user._id)){
                    
                    next();
            }else{
                    req.flash("error","Permission denied");
                    res.redirect("back");
                }
            }           
        });
    }else{
        req.flash("error","You don't have permission to do this");
        res.redirect("back");
    }
}
middlewareObj.checkCampgroundOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id,(err,editCampground)=>{
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                if(editCampground.author.id.equals(req.user._id)){
                    req.flash("success","Edit Successfull");
                    next();
            }else{
                    req.flash("error","Permission Denied");  
                    res.redirect("back");
                }
            }           
        });
    }else{
        req.flash("error","You don't have permission to do this");
        res.redirect("back");
    }
}

module.exports = middlewareObj  ;
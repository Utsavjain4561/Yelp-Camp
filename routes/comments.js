var express = require("express");
    Campground    = require("../models/campground");
    Comments    = require("../models/comments");
    middleware = require("../middleware");
    router  = express.Router({mergeParams:true});
    
//COMMENTS route
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });

});
router.post("/",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comments,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    console.log("New comment added "+comment);
                    req.flash("success","Comment added successfully");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comments.findById(req.params.comment_id,(err,foundComment)=>{
        
            res.render("comments/edit",{comment:foundComment,campgroundID:req.params.id});
        
    }); 
    
});

router.put("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        
            res.redirect("/campgrounds/"+req.params.id);
        
    });
    
});
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    Comments.findByIdAndRemove(req.params.comment_id,(err)=>{
        req.flash("success","Comment deleted");
        res.redirect("back");
    });
});

module.exports = router;
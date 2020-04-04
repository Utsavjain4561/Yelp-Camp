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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    console.log("New comment added "+comment);
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});
router.get("/:comment_id/edit",checkOwnership,(req,res)=>{
    Comments.findById(req.params.comment_id,(err,foundComment)=>{
        
            res.render("comments/edit",{comment:foundComment,campgroundID:req.params.id});
        
    }); 
    
});

router.put("/:comment_id",checkOwnership,(req,res)=>{
    Comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        
            res.redirect("/campgrounds/"+req.params.id);
        
    });
    
});
router.delete("/:comment_id",checkOwnership,(req,res)=>{
    Comments.findByIdAndRemove(req.params.comment_id,(err)=>{
        res.redirect("back");
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function checkOwnership(req,res,next){
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
module.exports = router;
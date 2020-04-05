var express = require("express");
    User    = require("../models/users");
    router  = express.Router();
router.get("/",(req,res)=>{
    res.render("landing");
});

//Auth routes
router.get("/register",(req,res)=>{
    res.render("register");
});
router.post("/register",(req,res)=>{
    var user = new User({username:req.body.username});
    var password = req.body.password;
    User.register(user,password,(err,newUser)=>{
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome to Yelp-Camp "+user.username);
            res.redirect("/campgrounds");
        });
    });
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;
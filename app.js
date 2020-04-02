const express      = require("express");
    request    = require("request");
    bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    passport   = require("passport");
    LocalStrategy = require("passport-local");
    expressSession = require("express-session");
    Campground = require('./models/campground');
    Comment    = require("./models/comments");
    seedDB     = require("./seed");
    User       = require("./models/users");
app = express();
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true ,useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
seedDB();

//PASSPORT cinfigurations
app.use(expressSession(
    {
        secret:"Himalayas are the top of the world!",
        resave:false,
        saveUninitialized:false
    }
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.get("/",(req,res)=>{
    res.render("landing");
});
app.get("/campgrounds",(req,res)=>{
    Campground.find({},(err,camps)=>{
        if(err){
            console.log("OOPS can't find campgrounds!!");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campsData:camps,currentUser:req.user});
        }
    });
   
});
app.post("/campgrounds",(req,res)=>{
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
app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new",{currentUser:req.user});
});
app.get("/campgrounds/:id",(req,res)=>{
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

//COMMENTS route
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });

});
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
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

//Auth routes
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    var user = new User({username:req.body.username});
    var password = req.body.password;
    User.register(user,password,(err,newUser)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds");
        });
    });
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000,"localhost",()=>{
    console.log("Yelp Camp has started");
});
const express      = require("express");
    request    = require("request");
    bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    passport   = require("passport");
    LocalStrategy = require("passport-local");
    flash        = require("connect-flash");
    expressSession = require("express-session");
    methodOverride = require("method-override");
    Campground = require('./models/campground');
    Comment    = require("./models/comments");
    seedDB     = require("./seed");
    User       = require("./models/users");
    campgroundsRoutes = require("./routes/campgrounds");
    commentsRoutes = require("./routes/comments");
    indexRoutes = require("./routes/index");

app = express();
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true ,useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

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
    res.locals.error    = req.flash("error");
    res.locals.success    = req.flash("success"); 
    next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);


app.listen(3000,"localhost",()=>{
    console.log("Yelp Camp has started");
});
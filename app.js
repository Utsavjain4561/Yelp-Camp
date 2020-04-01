const express      = require("express");
    request    = require("request");
    bodyParser = require("body-parser");
    mongoose   = require("mongoose");
    Campground = require('./models/campground');
    Comment    = require("./models/comments");
    seedDB     = require("./seed");
app = express();
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true ,useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
seedDB();

app.get("/",(req,res)=>{
    res.render("landing");
});
app.get("/campgrounds",(req,res)=>{
    Campground.find({},(err,camps)=>{
        if(err){
            console.log("OOPS can't find campgrounds!!");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campsData:camps});
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
    res.render("campgrounds/new");
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
app.get("/campgrounds/:id/comments/new",(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });

});
app.post("/campgrounds/:id/comments",(req,res)=>{
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
app.listen(3000,"localhost",()=>{
    console.log("Yelp Camp has started");
});
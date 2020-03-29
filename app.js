const app      = require("express")();
    request    = require("request");
    bodyParser = require("body-parser");
    mongoose   = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true ,useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


// SCHEMA

var campgroundsSchema = new mongoose.Schema({
    title:String,
    image:String,
    description:String
});
var Campground = mongoose.model('Campground',campgroundsSchema);
// var camps=[
//     {title:"Kheerganga",image:"https://cdn-az.allevents.in/banners/cf8e1c21a37e45e9025faa11bd29c927"},
//     {title:"Kasol",image:"https://thelandofwanderlust.com/wp-content/uploads/2019/12/IMG_20180804_141952-01-1024x768.jpeg"},
//     {title:"Triund",image:"https://static.toiimg.com/photo/70071520.cms.cms"},
//     {title:"Hampta Pass",image:"https://www.indiahikes.com/wp-content/uploads/2016/05/Hampta-Pass-Indiahikes-Udit-Kapoor-A-rocking-view-from-Chhatru-campsite-1.jpg"},
//     {title:"Chandrashila",image:"https://scontent-lga3-1.cdninstagram.com/v/t51.2885-15/sh0.08/e35/c121.0.838.838a/s640x640/75439564_116915653064637_7409263276078001654_n.jpg?_nc_ht=scontent-lga3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=Zf5opcfSLv8AX_USMyh&oh=0a573eec992f4c0ecc7494902bc2c5db&oe=5E856ED1"},
//     {title:"Roopkund",image:"https://trekwin.com/wp-content/uploads/2018/02/rookund.jpg"}
// ]
app.get("/",(req,res)=>{
    res.render("landing");
});
app.get("/campgrounds",(req,res)=>{
    Campground.find({},(err,camps)=>{
        if(err){
            console.log("OOPS can't find campgrounds!!");
            console.log(err);
        }else{
            res.render("index",{campsData:camps});
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
    res.render("new");
});
app.get("/campgrounds/:id",(req,res)=>{
    // var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log("Not found");
            console.log(err);
        }else{
        console.log(camp);
        res.render("show",{campsData:camp});
        }
    });

    
});
app.listen(3000,"localhost",()=>{
    console.log("Yelp Camp has started");
});
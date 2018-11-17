var express         = require("express"),
   app              = express(),
   bodyParser       = require("body-parser"),
   mongoose         = require("mongoose");

mongoose.connect("mongodb://localhost/gamingArena");

app.use(express.static('views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var artiklSchema = new mongoose.Schema({
    naziv: String,
    slika: String,
    cijena: Number,
    opis: String
});

var Artikl = mongoose.model("Artikl", artiklSchema);

app.get("/", function(req,res){
   res.render("landing"); 
});

app.post("/shop",function(req,res){
    var naziv = req.body.naziv;
    var slika = req.body.slika;
    var opis = req.body.opis;
    var cijena = req.body.cijena
    var noviArtikl = {naziv: naziv, slika: slika, opis: opis, cijena: cijena};
    Artikl.create(
    noviArtikl,
    function(err,artikl){
        if(err) console.log("error");
        else    console.log("dodan novi artikl " + artikl);
    });
    
    res.redirect("/shop");
});

app.get("/shop/new", function(req,res){
   res.render("new"); 
});

app.get("/shop", function(req,res){
   
    Artikl.find({}, function(err, sviArtikli){
            
        if(err) console.log(err);
        
        else  res.render("shop",{artikli: sviArtikli});
    });
});

app.get("/novosti", function(req,res){
   res.render("novosti"); 
});

app.get("/vizija", function(req,res){
   res.render("vizija");
});

app.get("/login", function(req,res){
   res.render("login");
});

app.get("/register", function(req,res){
   res.render("registration"); 
});


app.listen(8081, process.env.IP, function(){
    console.log("server started");
});
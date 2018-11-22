var bodyParser       = require("body-parser"),
   mongoose         = require("mongoose"),
   expressSanitizer = require("express-sanitizer"),
   methodOverride   = require("method-override"),
   express         = require("express"),
   app              = express();

mongoose.connect("mongodb://localhost:27017/gamingArena", { useNewUrlParser: true });

app.use(express.static('views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var artiklSchema = new mongoose.Schema({
    naziv: String,
    slika: String,
    cijena: Number,
    opis: String
});

var Artikl = mongoose.model("Artikl", artiklSchema);

    //pocetna stranica
app.get("/", function(req,res){
   res.render("pocetna"); 
});

/***************************** SHOP *************************************/
    //Index route
app.get("/shop", function(req,res){
   
    Artikl.find({}, function(err, sviArtikli){
            
        if(err) console.log(err);
        
        else  res.render("shop",{artikli: sviArtikli});
    });
});
    //Create route
app.post("/shop",function(req,res){
    req.body.artikl.opis = req.sanitize(req.body.artikl.opis); 
    Artikl.create(
    req.body.artikl,
    function(err,noviArtikl){
        if(err)
            console.log("error");
        else   
            console.log("Dodan novi artikl: " + noviArtikl);
    });
    
    res.redirect("/shop");
});
    //New route
app.get("/shop/new", function(req,res){
   res.render("dodajArtikl"); 
});

    //Show route
app.get("/shop/:id", function(req, res){
     Artikl.findById(req.params.id, function(err, pronadjenArtikl){
        if(err){
            console.log(err);
        }
        else{
            res.render("artikl",{artikl: pronadjenArtikl});
        }
    });
});
    //edit route
app.get("/shop/:id/edit", function(req, res) {
    Artikl.findById(req.params.id, function(err, pronadjenArtikl){
       if(err){
            console.log(err);
            res.redirect("/shop");
        }
        else{
            res.render("editArtikl",{artikl: pronadjenArtikl});
        }
    });
});
    //update route
app.put("/shop/:id", function(req,res){
    req.body.artikl.opis = req.sanitize(req.body.artikl.opis); 
    Artikl.findByIdAndUpdate(req.params.id,
    req.body.artikl,
    function(err,noviArtikl){
        if(err){
            console.log("error");
        }
        else   
            console.log("Artikl ažuriran: " + noviArtikl);
    });
    
    res.redirect("/shop");
});

    //destroy route
app.delete("/shop/:id",function(req,res){
    Artikl.findByIdAndDelete(req.params.id,
    function(err,artikl){
        if(err){
            console.log("error");
        }
        else   
            console.log("Artikl pobrisan: " + artikl);
    });
    
    res.redirect("/shop");
});

/*************************************************************************/

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
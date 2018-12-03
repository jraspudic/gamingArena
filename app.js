var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    expressSanitizer = require("express-sanitizer"),
    User             = require("./models/user"),
    methodOverride   = require("method-override"),
    Artikl           = require("./models/artikl"),
    Novost           = require("./models/novost");
    

mongoose.connect("mongodb://localhost:27017/gamingArena", { useNewUrlParser: true });

app.use(express.static('views'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "bilo sta mozes ovdje napisat nije bitno",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session(User.authenticate()));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

function isAdminShop(req,res,next){

    if(req.user == undefined){
        return res.redirect("/shop");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/shop");
    }
    next();
}

function isAdminNovosti(req,res,next){

    if(req.user == undefined){
        return res.redirect("/novosti");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/novosti");
    }
    next();
}


/*****************************************************************/
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
app.post("/shop", isAdminShop ,function(req,res){
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
app.get("/shop/new", isAdminShop ,function(req,res){
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
app.get("/shop/:id/edit", isAdminShop ,function(req, res) {
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
app.put("/shop/:id", isAdminShop ,function(req,res){
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
app.delete("/shop/:id", isAdminShop ,function(req,res){
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

/**************************** Novosti ***********************************/
     //Index route
app.get("/novosti", function(req,res){
   
    Novost.find({}, function(err, sveNovosti){
        if(err) console.log(err);
        
        else  res.render("novosti",{novosti: sveNovosti});
    });
});

    //Create route
app.post("/novosti", isAdminNovosti ,function(req,res){
    req.body.novost.tekst = req.sanitize(req.body.novost.tekst); 
    Novost.create(
    req.body.novost,
    function(err,novost){
        if(err)
            console.log("error");
        else   
            console.log("Dodana novost: " + novost);
    });
    
    res.redirect("/novosti");
});

    //new route
app.get("/novosti/new", isAdminNovosti ,function(req,res){
   res.render("dodajNovost"); 
});


/*************************************************************************/



//AUTENTIKACIJSKE RUTE

app.get("/register", function(req,res){
    if(req.user){
     return res.redirect("/");
    }
   res.render("registration"); 
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("registration");
        }
        else{
            passport.authenticate("local")(req, res, function(){
               res.redirect("/shop"); 
            });
        }
    });
});

app.get("/login", function(req,res){
    if(req.user){
     return res.redirect("/");
    }
   res.render("login");
});

app.post("/login",usernameToLowerCase, passport.authenticate("local",
    {
    successRedirect: "/shop",
    failureRedirect: "/login"    
    }),
    
    function(req,res){
   
});

function usernameToLowerCase(req,res,next){
    req.body.username = req.body.username.toLowerCase();
    next();
}

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});



app.listen(8081, process.env.IP, function(){
    console.log("server started");
});
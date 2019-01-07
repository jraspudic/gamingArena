var express      = require("express");
var router       = express.Router();
var User         = require("../models/user");
var passport     = require("passport");

router.get("/", function(req,res){
   res.render("pocetna"); 
});

/*****************************************************************/
router.get("/kosarica",function(req, res) {
    res.render("kosarica");
})




router.get("/korisnici", isHeadAdmin, function(req, res){
     User.find({}, function(err, sviKorisnici){
        if(err) console.log(err);
        
        else  res.render("korisnici",{korisnici: sviKorisnici});
    });
});

router.post("/korisnici/:id", isHeadAdmin, function(req, res){
    
    var toggleAdmin = (req.body.isAdminBtn=="true");
    
    User.findByIdAndUpdate(req.params.id, {isAdmin: toggleAdmin}, function(err, korisnik){
        if(err){
            console.log(err);
        }
        else{
            if(toggleAdmin==true){
                console.log(korisnik.username + " dodan kao admin");
            }
            else{
                console.log(korisnik.username + " više nije admin");
            }
        }
    });
    
    res.redirect("/korisnici");
});

router.delete("/korisnici/:id", isHeadAdmin, function(req,res){
    User.findByIdAndDelete(req.params.id,
    function(err, korisnik){
        if(err){
            console.log("error");
        }
        else   
            console.log("Korisnik pobrisan: " + korisnik);
    });
    
    res.redirect("/korisnici");
});
/*************************************************************************/


//AUTENTIKACIJSKE RUTE

router.get("/register", function(req,res){
    if(req.user){
     return res.redirect("/");
    }
   res.render("registration"); 
});

router.post("/register", function(req, res) {
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

router.get("/login", function(req,res){
    if(req.user){
     return res.redirect("/");
    }
   res.render("login");
});

router.post("/login",usernameToLowerCase, passport.authenticate("local",
    {
    successRedirect: "/shop",
    failureRedirect: "/login"    
    }),
    
    function(req,res){
   
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function usernameToLowerCase(req,res,next){
    req.body.username = req.body.username.toLowerCase();
    next();
}

function isHeadAdmin(req, res, next){
    if(req.user == undefined){
        return res.redirect("/");
    }
    else if(req.user.isHeadAdmin == false){
        return res.redirect("/");
    }
    next();
}

module.exports = router;
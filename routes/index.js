var express      = require("express");
var router       = express.Router();
var User         = require("../models/user");
var passport     = require("passport");

var Artikl = require("../models/artikl");
var Cart = require("../models/cart");
var Order = require("../models/order");


router.get("/", function(req,res){
   res.render("pocetna"); 
});

router.get("/index", function(req,res){
   res.render("index"); 
});

/*============================================================*/
router.get("/shopping-cart", function(req,res){
   res.render("shopping-cart"); 
});
router.get('/shop/:id', function (req, res) {
    
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    Artikl.findById(req.params.id, function (err, oneProduct) {
        if (err) {
            console.log(err);
        } else {
            console.log("KUPIO SI ");
            cart.add(oneProduct, oneProduct.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            
            res.redirect("/");
            
        }
    });
});
//add one more unit in shopping-cart
router.get('/shop/:id/add', function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Artikl.findById(req.params.id, function (err, oneProduct) {
        if (err) {
            console.log(err);
        } else {
            cart.add(oneProduct, oneProduct.id);  // adding the product to cart
            req.session.cart = cart; //store cart object in session,,we dont need to save beacuse session automatically saving 
            //req.flash('success', `Successfully added ${oneProduct.title} to your cart.`);
            res.redirect("/");
        }
    });
});
//get shopping-cart
router.get("/shopping-cart", function (req, res) {
    if (!req.session.cart) {
         console.log("prazna");
        return res.render("/shopping-cart", { artikli: null });
       
    } else {
        console.log("puna")
        var cart = new Cart(req.session.cart);
        res.render("/shopping-cart", { artikli: cart.generateArray(), totalPrice: cart.totalPrice });
    }
});




/*==================================================================*/
router.get("/admin-panel", function(req,res){
   res.render("admin-panel"); 
});
/*****************************************************************/
router.get("/admini", isHeadAdmin, function(req, res){
     User.find({}, function(err, sviKorisnici){
        if(err) console.log(err);
        
        else  res.render("admini",{korisnici: sviKorisnici});
    });
});

router.post("/admini/:id", isHeadAdmin, function(req, res){
    
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
    
    res.redirect("/admini");
});

router.delete("/admini/:id", isHeadAdmin, function(req,res){
    User.findByIdAndDelete(req.params.id,
    function(err, korisnik){
        if(err){
            console.log("error");
        }
        else   
            console.log("Korisnik pobrisan: " + korisnik);
    });
    
    res.redirect("/admini");
});





/*==========================0*/

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
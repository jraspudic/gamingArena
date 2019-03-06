var express  = require("express");
var router   = express.Router();

var Artikl = require("../models/artikl");
var Cart = require("../models/cart");
var User = require("../models/user");
var nodemailer      = require("nodemailer");


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


router.get('/:id/buy',isLoggedIn,function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Artikl.findById(req.params.id, function (err, oneProduct) {
        if (err) {
            console.log(err);
        } else {
            cart.add(oneProduct, oneProduct.id);
            req.session.cart = cart; 
            res.redirect("/shop");
        }
    });
});
//Dodavanje jos artikala
router.get('/:id/add',isLoggedIn,function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Artikl.findById(req.params.id, function (err, oneProduct) {
        if (err) {
            console.log(err);
        } else {
            cart.add(oneProduct, oneProduct.id);  
            req.session.cart = cart; 
            res.redirect("/shop/shopping-cart");
        }
    });
});

router.get("/shopping-cart",isLoggedIn,function (req, res) {
    if (!req.session.cart) {
        res.render("shopping-cart", { products: null });
    } else {
        var cart = new Cart(req.session.cart);
         console.log(cart.totalPrice);
        res.render("shopping-cart", { products: cart.generateArray(), totalPrice: cart.totalPrice });
       
    }
});

//Brisanje jednog artikla tj. kolicine
router.get("/:id/deleteone",isLoggedIn,function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(req.params.id);
    req.session.cart = cart;
    res.redirect("/shop/shopping-cart");
});
//Brisanje artikla
router.get("/:id/deleteitem",isLoggedIn,function (req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(req.params.id);
    req.session.cart = cart;
    res.redirect("/shop/shopping-cart");
});

router.get("/checkout", isLoggedIn, function (req, res) {
            res.render("checkout");
});

router.post("/narudjba", function(req, res) {
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gamingarena5454@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: 'gamingarena5454@gmail.com',
        from: 'gamingarena@gamingarena.club',
        subject: 'Narudzba',
        text: 'Osoba: ' + req.body.ime +' '+ req.body.prezime+ '\n' + 'Email: ' + req.body.email + '\n' + 'Ulica: ' + req.body.ulica + '\n' + 
        'Grad: ' + req.body.grad +'\n'+ 'Poštanski broj: ' + req.body.postanskiBroj + '\n' + 'Telefon: ' + req.body.telefon + '\n'+'\n'+'\n'+
        ispisiNarudzbu(req.session.cart) 
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
});
    res.render("narudjbaPoslana");
    
});

function ispisiNarudzbu(cart){
    var s ="";
    
    var cart = new Cart(cart);
    var products = cart.generateArray()
    
    products.forEach(function(products){
       s = s + products.item.naziv + ' ' + 'x' + products.qty + '\n';
    });
    s = s + 'Ukupna cijena: ' + cart.totalPrice;
    return s;
}

/*=================================================================*/
router.get("/", function(req, res) {
    var perPage = 6;
    var pageQuery = parseInt(req.query.page, 10);
    var pageNum = (pageQuery && pageQuery >= 1) ? pageQuery : 1;
    var noMatch = false;
    
    if (req.query.search) {
        Artikl.find({kategorija: { $in: req.query.search }}).skip((pageNum - 1) * perPage).limit(perPage).exec(function(err, artikl){
            if (err || !artikl) {
               req.flash("error", "Something Went Wrong");
                return res.redirect("/shop");
            }
                Artikl.find({kategorija: { $in: req.query.search }}).count().exec(function(err, count) {
                var totalPages = Math.ceil(count / perPage);
                
                 if (pageNum < 1 || pageNum > totalPages) {
                     res.redirect("/shop");
                } else {
                    
                    res.render("shop", {
                        artikl: artikl, 
                        page: "shop",
                        search: false,
                        current: pageNum,
                        totalPages: totalPages
                    });
                    
                }
                });
            });
        }
        
    else  {
        Artikl.find({}).skip((pageNum - 1) * perPage).limit(perPage).exec(function(err, artikl){
            if (err || !artikl) {
               req.flash("error", "Something Went Wrong");
                return res.redirect("/shop");
            }
            Artikl.count().exec(function(err, count) {
                var totalPages = Math.ceil(count / perPage);
                
                if (err) {
                   req.flash("error", "Something Went Wrong");
                    res.redirect("/shop");
                } else if (pageNum < 1 || pageNum > totalPages) {
                    //req.flash("error", "Page Index Out of Range"); //pado server zbog ovog :D
                     res.redirect("/shop");
                } else {
                    
                    res.render("shop", {
                        artikl: artikl, 
                        page: "shop",
                        search: false,
                        current: pageNum,
                        totalPages: totalPages
                    });
                    
                }
            });
        });
    } 
});
/*==================================================================*/
    
function isAdminShop(req,res,next){

    if(req.user == undefined){
        return res.redirect("/shop");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/shop");
    }
    next();
}

function isLoggedIn(req,res,next){
    if(req.user == undefined){
        return res.redirect("/shop");
    }
    next();
}

/*==========================================================================*/

/*
router.get("/", function(req,res){
    if(Object.keys(req.query).length === 0){
    artikl.find({}, function(err, sviartikl){ 
        if(err) console.log(err);
        
        else  res.render("shop",{artikl: sviartikl});
    });
    }
    else{
        artikl.find({kategorija: { $in: req.query.search }}, function(err, sviartikl){ 
        if(err) console.log(err);
        
        else  res.render("shop",{artikl: sviartikl});
    });
    }
});*/

    //Create route
router.post("/", isAdminShop ,function(req,res){
    req.body.artikl.opis = req.sanitize(req.body.artikl.opis); 
    Artikl.create(
    req.body.artikl,
    function(err,noviartikl){
        if(err)
            console.log("error");
        else   
            console.log("Dodan novi artikl: " + noviartikl);
    });
    
    res.redirect("/shop");
});
    //New route
router.get("/new", isAdminShop ,function(req,res){
   res.render("dodajArtikl"); 
});

    //Show route
router.get("/:id", function(req, res){
     Artikl.findById(req.params.id, function(err, pronadjenartikl){
        if(err){
            console.log(err);
        }
        else{
            res.render("artikl",{artikl: pronadjenartikl});
        }
    });
});
    //edit route
router.get("/:id/edit", isAdminShop ,function(req, res) {
    Artikl.findById(req.params.id, function(err, pronadjenartikl){
       if(err){
            console.log(err);
            res.redirect("/shop");
        }
        else{
            res.render("editArtikl",{artikl: pronadjenartikl});
        }
    });
});
    //update route
router.put("/:id", isAdminShop ,function(req,res){
    req.body.artikl.opis = req.sanitize(req.body.artikl.opis); 
    Artikl.findByIdAndUpdate(req.params.id,
    req.body.artikl,
    function(err,noviartikl){
        if(err){
            console.log("error");
        }
        else   
            console.log("artikl ažuriran: " + noviartikl);
    });
    
    res.redirect("/shop");
});

    //destroy route
router.delete("/:id", isAdminShop ,function(req,res){
    Artikl.findByIdAndDelete(req.params.id,
    function(err,artikl){
        if(err){
            console.log("error");
        }
        else   
            console.log("artikl pobrisan: " + artikl);
    });
    
    res.redirect("/shop");
});

module.exports = router;
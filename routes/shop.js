var express  = require("express");
var router   = express.Router();
//var geocoder   = require("geocoder");



var Artikl = require("../models/artikl");
var Cart = require("../models/cart");
var User = require("../models/user");
var Order = require("../models/order");

// helper to handle fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


        
/*=================================================================*/
router.get("/", function(req, res) {
    var perPage = 9;
    var pageQuery = parseInt(req.query.page, 10);
    var pageNum = (pageQuery && pageQuery >= 1) ? pageQuery : 1;
    var noMatch = false;
    
    if (req.query.search) {
        Artikl.find({kategorija: { $in: req.query.search }}, function(err, sviArtikli){ 
        if(err) console.log(err);
        
        else  res.render("shop",{artikli: sviArtikli});
    });
    } else  {
        Artikl.find({}).skip((pageNum - 1) * perPage).limit(perPage).exec(function(err, artikli){
            if (err || !artikli) {
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
                        artikli: artikli, 
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
    //Index route
function isAdminShop(req,res,next){

    if(req.user == undefined){
        return res.redirect("/shop");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/shop");
    }
    next();
}

/*
router.get("/", function(req,res){
    if(Object.keys(req.query).length === 0){
    Artikl.find({}, function(err, sviArtikli){ 
        if(err) console.log(err);
        
        else  res.render("shop",{artikli: sviArtikli});
    });
    }
    else{
        Artikl.find({kategorija: { $in: req.query.search }}, function(err, sviArtikli){ 
        if(err) console.log(err);
        
        else  res.render("shop",{artikli: sviArtikli});
    });
    }
});*/

    //Create route
router.post("/", isAdminShop ,function(req,res){
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
router.get("/new", isAdminShop ,function(req,res){
   res.render("dodajArtikl"); 
});

    //Show route
router.get("/:id", function(req, res){
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
router.get("/:id/edit", isAdminShop ,function(req, res) {
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
router.put("/:id", isAdminShop ,function(req,res){
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
router.delete("/:id", isAdminShop ,function(req,res){
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

module.exports = router;
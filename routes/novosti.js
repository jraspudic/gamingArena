var express = require("express");
var router = express.Router();
var Novost  = require("../models/novost");
 
 function isAdminNovosti(req,res,next){

    if(req.user == undefined){
        return res.redirect("/novosti");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/novosti");
    }
    next();
}

//Index route
router.get("/", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Novost.find({ "naslov": regex }, function(err, sviArtikli) {
           if(err) {
               console.log(err);
           } else {
                   res.render("novosti", { novosti: sviArtikli });
           }
       }); 
    }else{
Novost.find({}, function(err, sveNovosti){
        if(err) console.log(err);
        
        else  {
            
          //  res.render("novosti",{novosti: sveNovosti});  
            res.render("novosti",{novosti:sveNovosti, noMatch: noMatch});
            
        }
        });
    }
});  


    //Create route
router.post("/", isAdminNovosti ,function(req,res){
    req.body.novost.tekst = req.sanitize(req.body.novost.tekst);
    
    var autor = {
        id: req.user._id,
        username: req.user.username
    };
    
    var novost = []; // new Array
    novost.push(req.body.novost, autor);
    
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
router.get("/new", isAdminNovosti ,function(req,res){
   res.render("dodajNovost"); 
});

    //Show route
router.get("/:id", function(req, res){
     Novost.findById(req.params.id, function(err, pronadjenaNovost){
        if(err){
            console.log(err);
        }
        else{
            res.render("novost",{novost: pronadjenaNovost});
        }
    });
});
    //edit route
router.get("/:id/edit", isAdminNovosti ,function(req, res) {
    Novost.findById(req.params.id, function(err, pronadjenaNovost){
       if(err){
            console.log(err);
            res.redirect("/novosti");
        }
        else{
            res.render("editNovost",{novost: pronadjenaNovost});
        }
    });
});

    //update route
router.put("/:id", isAdminNovosti ,function(req,res){
    
    var autor = {
        id: req.user._id,
        username: req.user.username
    };
    var novost = []; // new Array
    novost.push(req.body.novost, autor);
    
    Novost.findByIdAndUpdate(req.params.id,
    novost,
    function(err, novaNovost){
        if(err){
            console.log("error");
        }
        else   
            console.log("Post ažuriran: " + novaNovost);
    });
    
    res.redirect("/novosti");
});

router.delete("/:id", isAdminNovosti ,function(req,res){
    Novost.findByIdAndDelete(req.params.id,
    function(err,novost){
        if(err){
            console.log("error");
        }
        else   
            console.log("Post izbrisan: " + novost);
    });
    
    res.redirect("/novosti");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;



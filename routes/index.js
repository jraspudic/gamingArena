var express         = require("express");
var router          = express.Router();
var User            = require("../models/user");
var passport        = require("passport");
var async           = require('async');
var crypto          = require('crypto');
var nodemailer      = require("nodemailer");


var Artikl = require("../models/artikl");
var Cart = require("../models/cart");



router.get("/", function(req,res){
   res.render("pocetna"); 
});

/*==================================================================*/
router.get("/admin-panel", isAdmin, function(req,res){
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
//Birsanje admina totalno iz DB
router.delete("/admini/:id", isHeadAdmin, function(req,res){
    User.findByIdAndDelete(req.params.id,function(err, korisnik){
        if(err){
            console.log("error");
        }
        else   
            console.log("Korisnik pobrisan: " + korisnik);
    });
    
    res.redirect("/admini");
});





/*==========================0*/
//Ipisivanje svih korisnika
router.get("/korisnici", isHeadAdmin, function(req, res){
     User.find({}, function(err, sviKorisnici){
        if(err) console.log(err);
        
        else  res.render("korisnici",{korisnici: sviKorisnici});
    });
});
//Dodavanje i skidanje admina
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
//Brisanje korisnika iz DB
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
    
    User.findOne({ username: req.body.username }, function(err, user) {
        if (user) {
          req.flash('Postoji user');
          return;
        }
    });
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
         req.session = null;
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
   req.session.destroy(); 
    res.redirect("/");
     
});
/*********************************** RESET PASSWORD *******************/
router.get('/forgot', function(req, res) {
    if(!req.user)
        return res.render("forgot");
    return res.redirect("/");
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.render('forgotFailed');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 sat

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gamingarena5454@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gamingarena5454@gmail.club',
        subject: 'GamingArena password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://gamingarena.club' + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        res.render("forgotSent",{email: user.email});
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'gamingarena5454@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gamingarena5454@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect("/");
  });
});

router.post("/contact", function(req,res){
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
        subject: 'Kontakt forma',
        text: 'Ime: ' + req.body.ime + '\n' + 'Email: ' + req.body.email + '\n' + 'Predmet: ' + req.body.predmet + '\n' + 
        'Poruka: ' + req.body.poruka
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
});

    res.render("contactSent");
});


/********************************************************/

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

function isAdmin(req,res,next){

    if(req.user == undefined){
        return res.redirect("/");
    }
    else if(req.user.isAdmin == false){
        return res.redirect("/");
    }
    next();
}

module.exports = router; 
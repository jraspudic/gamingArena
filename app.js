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
    
var shopRoutes      = require("./routes/shop"),
    novostiRoutes   = require("./routes/novosti"),
    indexRoutes     = require("./routes/index")

mongoose.connect("mongodb://localhost:27017/gamingArena", { useNewUrlParser: true });

app.use(express.static('views')); //omogucava serviranje statickih fajlova u browser
app.set("view engine", "ejs");     
app.use(bodyParser.urlencoded({extended: true})); 
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const ITEMS_PER_PAGE = 2;

//PASSPORT CONFIGURATIONgit
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

app.use("/shop", shopRoutes);
app.use("/novosti", novostiRoutes);
app.use(indexRoutes);



app.listen(8081, process.env.IP, function(){
    console.log("server started");
});


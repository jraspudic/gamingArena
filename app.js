var express         = require("express"),
   app              = express(),
   bodyParser       = require("body-parser");
   

app.use(express.static('views'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
   res.render("landing"); 
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
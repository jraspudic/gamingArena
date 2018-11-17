 var mongoose         = require("mongoose");
 
 mongoose.connect("mongodb://localhost:27017/baza_mocna", { useNewUrlParser: true });
 
 var artiklSchema = new mongoose.Schema({
     naziv: String,
     cijena: Number
 });
 
    var Artikl = mongoose.model("Artikl", artiklSchema);
    
    var laptop =new Artikl({
            naziv: "labtop",
            cijena: "1010"
        });
        
    laptop.save(function(err, lap){
        if(err) console.log("greska");
        else{
        console.log("spasen laptop u bazu");
        console.log(lap);
        }
    });
        

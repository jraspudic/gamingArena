var mongoose = require("mongoose");

var novostSchema = new mongoose.Schema({
   naslov: String,
   thumbnail: {type: String, default: "images/noimg.png"},
   tekst: String,
   datum: {type: Date, default: Date.now },
   autor: {
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
             },
         username: String
   }
});

module.exports = mongoose.model("Novost", novostSchema);
var mongoose = require("mongoose");

var artiklSchema = new mongoose.Schema({
    naziv: String,
    slika: String,
    cijena: Number,
    opis: String
});

module.exports = mongoose.model("Artikl", artiklSchema);


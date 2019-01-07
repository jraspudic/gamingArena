var mongoose = require("mongoose");

var artiklSchema = new mongoose.Schema({
    naziv: String,
    slika: String,
    cijena: Number,
    opis: String,
    kategorija: {type: String, default: "ostalo"}
});

module.exports = mongoose.model("Artikl", artiklSchema);


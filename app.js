var PORT = 3000;
var https = "mongodb/localhost:27017/gallery";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// -------------------------- Routes ----------------------------

app.get('/', function(req,res){
    res.render('home.ejs');
})

// --------------------------------------------------------------

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});
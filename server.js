var express = require("express");
var app = express();
var PORT = 7000;

app.use(express.static(__dirname + "/src"));

app.listen(PORT, function(){
	console.log("Express server running on Port " + PORT );
});
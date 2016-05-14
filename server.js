var express = require("express");
var app = express();
var PORT = 5000;

app.use(express.static(__dirname ));

app.listen(PORT, function(){
	console.log("Express server running on Port " + PORT );
});
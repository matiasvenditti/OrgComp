var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io-client');
//var socket = io.connect('http://localhost:3000', {reconnect: true});
var socket = io.connect('http://172.22.49.251:3000', {reconnect: true});
var fs = require('fs');
var nodewebcam = require('node-webcam');
var imagePath = 'test_picture.jpg';

var opts = {
 
    //Picture related 
 
    width: 1080,
 
    height: 720	,
 
    quality: 100,
 
 
    //Delay to take shot 
 
    delay: 0,
 
 
    //Save shots in memory 
 
    saveShots: true,
 
 
    // [jpeg, png] support varies 
    // Webcam.OutputTypes 
 
    output: "jpeg",
 
 
    //Which camera to use 
    //Use Webcam.list() for results 
    //false for default device 
 
    device: false,
 
 
    // [location, buffer, base64] 
    // Webcam.CallbackReturnTypes 
 
    callbackReturn: "location",
 
 
    //Logging 
 
    verbose: false
 
};

var webcam = nodewebcam.create( opts );


socket.on('connect', function(socket){
	console.log('Connection successful!');
});


setInterval(function(){
	webcam.capture( "test_picture", function( err, data ) {} );
	
	fs.readFile(imagePath, function read(err, data){
		if (err){
			throw err;
		}
		let content = data;
		console.log(content);
		socket.emit('image', data);
});
}, 7000);

socket.on('plateValidated', function(socket){
	console.log('Patente encontrada!');
});




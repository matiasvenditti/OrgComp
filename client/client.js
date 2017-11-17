var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io-client');
//var socket = io.connect('http://localhost:3000', {reconnect: true});
var socket = io.connect('http://192.168.1.178:4000', {reconnect: true});
var fs = require('fs');
var nodewebcam = require('node-webcam');
var imagePath = 'test_picture.jpg';

var opts = {
 
    //Picture related 
 
    width: 1080,
 
    height: 720,
 
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
var waitingRes = false;
var isDoorOpen = false;

socket.on('Connection', function(data){
	data ? console.log('Connection successful!') : console.log('Disconnect!')
});

setInterval(function(){
	if(!waitingRes && !isDoorOpen){
		webcam.capture( "test_picture", function( err, data ) {
			fs.readFile(imagePath, function read(err, data){
				if (err){
					throw err;
				}
				console.log(data);
				socket.emit('plate', data);
				waitingRes = true;		
			});

		});
	}
}, 7000);

socket.on('open', function(res){
	waitingRes = false;
	console.log(res);
	if(res) openDoor();
});

function openDoor(){
	console.log("Abriendo la barrera");
	isDoorOpen = true;
	setTimeout(function(){
		closeDoor();
	}, 10000);
}

function closeDoor(){
	console.log("Cerrando la barrera");
	isDoorOpen = false;
}

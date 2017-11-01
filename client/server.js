var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io-client');
//var socket = io.connect('http://localhost:3000', {reconnect: true});
var socket = io.connect('http://172.22.40.29:4000', {reconnect: true});
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
var openDoor2 = false;

socket.on('connect', function(socket){
	console.log('Connection successful!');
});


setInterval(function(){
	if(!waitingRes && !openDoor2){
		webcam.capture( "test_picture", function( err, data ) {} );
		
		fs.readFile(imagePath, function read(err, data){
			if (err){
				throw err;
			}
			console.log(data);
			socket.emit('puerta_1_entrada', data);
			waitingRes = true;		
		});
	}
}, 7000);

socket.on('res_puerta_1_entrada', function(res){
	waitingRes = false;
	if(res) openDoor();
});

function openDoor(){
	console.log("Abriendo la barrera");
	openDoor2 = true;
	setTimeout(function(){
		closeDoor();
	}, 10000);
}

function closeDoor(){
	console.log("Cerrando la barrera");
	openDoor2 = false;
}

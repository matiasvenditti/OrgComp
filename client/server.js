var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});
var fs = require('fs');
var imagePath = './images/autotest.jpg';

socket.on('connect', function(socket){
	console.log('Connection successful!');
});

setInterval(function(){
	fs.readFile(imagePath, function read(err, data){
		if (err){
			throw err;
		}
		let content = data;
		console.log(content);
		socket.emit('image', data);
});
}, 4000);

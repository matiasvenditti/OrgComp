var express = require('express');
var app = express();
var server = app.listen(3000);
var fs = require('fs');
var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/orgcomp';
var licensePlate;
var results;
var socket = require('socket.io');
var io = socket(server);

var openalpr = require("node-openalpr");
openalpr.Start();

io.on('connection', function(socket){
	console.log('User connected successfully ' + socket.id);
	socket.emit('Connection', true);

	socket.on('disconnect', function(){
		console.log('User disconnected: ' + socket.id);
		socket.emit('Connection', false);
	});

	setTimeout(function(){
		socket.emit('WebClientPlate', 'IEB625');
	}, 5000);

	socket.on('plate', function(data){
		fs.writeFile('./images/test' + '.jpg', data, function(err){
			if (err) throw err;
			identify(1, './images/test.jpg', check, socket);
		});
	});
});

function check(plate, socket){
	let MongoClient = mongo.MongoClient;
	console.log('Plate check: ' + plate);
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		var query = { Plate: plate };
		db.collection("cars").find(query).toArray(function(err, result){
				if (err) throw err;
				db.close();
				if (result.length && result[0].Plate != undefined && result[0].Autho){
					console.log('Plate ' + plate + ' successfully found');
					socket.emit('open', true);
					socket.emit('WebClientPlate', licensePlate);
					console.log("True");
				} else{
					console.log('Could not find plate ' + plate);
					socket.emit('open', false);
					console.log("False");
				}
				licensePlate = undefined;
		});
	})
}


function identify (id, path, callback, socketCallback) {
	console.log("Empieza identify");
	console.log (openalpr.IdentifyLicense (path, function (error, output) {
		results = output.results;
		console.log('results '+ results + ' termina results');
		console.log('length del arreglo ' + results.length);
		if(results.length) {
			licensePlate = results[0].plate;
			console.log("licensePlate: " + results[0].plate);
			callback(licensePlate, socketCallback);
		}else {
			socketCallback.emit('open', false);
		}
	}));
}

var express = require('express');
var app = express();
var server = app.listen(4000);
var fs = require('fs');
var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/orgcomp';

var licensePlate;

var socket = require('socket.io');
var io = socket(server);

var openalpr = require("node-openalpr");
openalpr.Start();

app.get('/', function(req, res){
	res.send('Hello World!');
});

io.on('connection', function(socket){
	console.log('User connected successfully ' + socket.id);
	socket.emit('Connection', true);

	socket.on('disconnect', function(){
		console.log('User disconnected: ' + socket.id);
		socket.emit('Connection', false);
	});

	socket.on('plate', function(data){
		fs.writeFile('./images/test' + '.jpg', data, function(err){
			if (err) throw err;
			identify(1, './images/test.jpg')
			check(licensePlate, socket);
			console.log(data);
		});
	});
});

function check(plate, socket){
	let MongoClient = mongo.MongoClient;
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		else{
			db.collection('cars').find({'Plate': plate}, {'_id': 0}).toArray(function(err, result){
				if (err) throw err;
				if (result[0] != null && result[0].Auth == true){
					console.log('Plate ' + plate + ' successfully found');
					socket.emit('open', true);
				}
				else{
					console.log('Could not find plate ' + plate);
					socket.emit('open', false);
				}
			})
		}
	})
}

function identify (id, path) {
	console.log (openalpr.IdentifyLicense (path, function (error, output) {
		var results = output.results;
        licensePlate = (results.length > 0) ? results[0].plate : "No results";
		console.log('Plate ' + licensePlate);
	}));
}

var express = require('express');
var app = express();
var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/orgcomp';

var server = app.listen(9000);

var io = require('socket.io')(server);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  socket.on('add', function(plate){
    addPlate(plate);
    console.log('Plate added: ' + plate);
  });
  socket.on('delete', function(plate){
    removePlate(plate);
    console.log('Plate ' + plate + ' succesfully removed');
  })
})

function addPlate(plate){
  let MongoClient = mongo.MongoClient;
  MongoClient.connect(url, function(err, db){
    if (err){
      throw err;
    }
    else{
      let element = {"Plate": plate, "Autho": true};
      db.collection('cars').insert(element, function(err, res){
        if (err) throw err;
        console.log('Element added!');
        db.close();
      });
    }
  });
}

function findPlate(plate){
  let MongoClient = mongo.MongoClient;
  MongoClient.connect(url, function(err, db){
    if (err) throw err;
    else{
      db.collection('cars').find({'Plate': plate}, {"_id" : 0}).toArray(function(err, result){
        if (err) throw err;
        console.log('Element found!');
        db.close();
      });
    }
  });
}

function removePlate(plate){
  let MongoClient = mongo.MongoClient;
  MongoClient.connect(url, function(err, db){
    if (err) throw err;
    let query = {'Plate': plate};
    db.collection('cars').remove(query, function(err, obj){
      if (err) throw err;
      console.log(obj.result.n + ' plate(s) removed');
      db.close();
    })
  })
}

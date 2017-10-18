var socket;

function addPlate(){
  var text = getText("addPlateText");
  socket.emit('add', text);
}

function findPlate(){
  var text = getText("findPlateText");
  socket.emit('find', text);
}

function getText(id){
  socket = io();
  return document.getElementById(id).value.toUpperCase();
}

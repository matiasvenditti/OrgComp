var socket = io.connect('http://localhost:9000', { 'forceNew': true });

function addPlate(){
  var text = getText("addPlateText");
  if(verifyPlate(text)){
  	console.log('Patente verificada');
  	socket.emit('add', text);
  	document.getElementById('addPlateText').value = '';
  	document.getElementById('addSucces').style.display = 'block';
  	setTimeout(function(){
  		document.getElementById('addSucces').style.display = 'none';
  	 }, 4000);
  }else{
  	document.getElementById('addDanger').style.display = 'block';
  	setTimeout(function(){
  		document.getElementById('addDanger').style.display = 'none';
  	 }, 4000);
  }
}

function removePlate(){
  var text = getText("removePlateText");
  if (verifyPlate(text)){
    socket.emit('delete', text);
    document.getElementById("removePlateText").value = '';
    document.getElementById("removeSucces").style.display = 'block';
    setTimeout(function(){
      document.getElementById("removeSucces").style.display = 'none';
    }, 4000);
  } else{
    document.getElementById("removeDanger").style.display = 'block';
    setTimeout(function(){
      document.getElementById("removeDanger").style.display = 'none';
    }, 4000);
  }
}

function findPlate(){
  var text = getText("findPlateText");
  if(verifyPlate(text)){
  	socket.emit('find', text);
  	document.getElementById('findPlateText').value = '';
  	socket.on('findRes', function(data){

  	});
  }
}

function getText(id){
  return document.getElementById(id).value.toUpperCase();
}

function verifyPlate(plate){
	if(plate.length == 6){
		console.log("Entro Vieja");
		return /[A-Z]{3}[0-9]{3}/.test(plate);
	}else if(plate.length == 7){
		console.log("Entro Nueva");
		return /[A-Z]{2}[0-9]{3}[A-Z]{2}/.test(plate);
	}else return false;
}

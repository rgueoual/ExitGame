// Main program

// Déclaration de variables et fonctions isolées

	// Déclaration d'éléments

		// Déclaration de variable

	var hintBlock = document.getElementById("wrapper raw2"); // Element HTML où afficher les différents indices.
	var GMblock = document.getElementById("GM message");

	var hintGivenList = [];

	var stringTag ; // Emplacement pour id de puce NFC
	var currentNFC = "undefined"; // Dernière puce NFC lue, initialisation à "undefined".
	var justChangedNFC = false ;

	//var mySocket = new WebSocket("ws://www.example.com/socketserver");

// FONCTION ECOUTE //

	var socket = require('socket.io'),
	alert("working after first require");
	express = require('express'),
	https = require('https'),
	http = require('http'),
	logger = require('winston');
	alert("working after last require");	

	var socket = io.connect("http://192.168.1.32:3001");
	
	socket.on('connect', function()
			
			{
				console.log('onconnect')
				socket.on('event', function(data){console.log('onevent')}); 
				socket.on('disconnect', function(){console.log('ondisconnect')});
				socket.on("message_from_server",function(data){
					hintManager.whatToDo(data.message);
				})
				socket.emit("message_from_phone","salut");
				alert("working after emit");
			});

	

	/*var socketOpened = false ;
	mySocket.onopen = function (event){
		socketOpened = true ;
	};

	if (socketOpened == true){
		mySocket.onmessage = function(event){
			hintManager.whatToDo(event.data);
		};
	};*/



		// Déclaration de fonctions

// Structures complexes

var app = {
	initialize: function() {
      	this.bindEvents();
      	console.log("Starting NFC Reader app");
   },

    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
   },

    onDeviceReady: function() {

      app.startRead();
   },

   	startRead : function (){
   		nfc.addTagDiscoveredListener(
         app.onNfc,             // tag successfully scanned
         function (status) {    // listener successfully initialized
            console.log("Tap a tag to read its id number.");
         },
         function (error) {     // listener fails to initialize
            alert("NFC reader failed to initialize " +
               JSON.stringify(error));
         }
         );
   },

   	stopRead :function (){
   		nfc.removeTagDiscoveredListener(
         app.onNfc,             // tag successfully scanned
         function (status) {    // listener successfully initialized
            alert("Tap a tag to read its id number.");
         },
         function (error) {     // listener fails to initialize
            alert("NFC reader failed to initialize " +
               JSON.stringify(error));
         }
         );
   },
   

   onNfc: function(nfcEvent) {
	   	navigator.notification.vibrate(1000);
	    var tag = nfcEvent.tag;
	    stringTag = nfc.bytesToHexString(tag.id);
	    if (stringTag != currentNFC){
	    	justChangedNFC = true;
	    } else {
	    	justChangedNFC = false;
	    };
	    currentNFC = stringTag ;

	    alert(stringTag);
	    //app.display("Read tag: " + nfc.bytesToHexString(tag.id));
	    //mySocket.send(stringTag);

	    app.stopRead();
	    setTimeout(app.startRead,10000);

	    //hintManager.init(NFCnumber);

   },
}


var hintManager ={

	whatToDo : function(stringReceived){
		alert(stringReceived);
		var splitString = stringReceived.split("$");
		var stringReceivedMessage = splitString[1];

		if (splitString[0] == "1"){ // Message du Game Master

			hintManager.GMCleaner();
			var GMPar = document.createElement('p');
			var GMText = document.createTextNode(stringReceived);

			GMPar.className = "hint";

			GMPar.appendChild(GMText);
			GMblock.appendChild(GMPar);


		} else if (splitString[0] == "2"){ // Condition non vérifiée pour lecture puce indicielle
			//alert(splitString[1]);
			alert("Inspectez d'abord les alentours...");


		} else if (splitString[0]=="3"){ // Lecture puce indicielle

			if (currentNFC == "undefined"){
				hintManager.hintMover(hintManager.hintBlockCreator(stringReceivedMessage));

			} else {
				if (justChangedNFC){
					
					hintManager.hintCleaner();
					hintManager.hintListUpdater(stringReceivedMessage);

				} else {

					hintGivenList[currentNFC].push(stringReceivedMessage);
					hintManager.hintMover(hintManager.hintBlockCreator(stringReceivedMessage));
				};
			};


		} else if (splitString[0]=="4"){ // Lecture d'une puce reset
			hintManager.reset();
		};
		
	},

	hintListCreator : function (stringReceived){
		hintGivenList[currentNFC] = [];
		hintGivenList[currentNFC].push(stringReceived);
		hintManager.hintCleaner();
		hintManager.hintMover(hintManager.hintBlockCreator(stringReceived));

	},

	hintListUpdater : function (stringReceived){
		if (!hintGivenList[currentNFC]){
			hintManager.hintListCreator(stringReceived);
		} else {
			hintGivenList[currentNFC].push(stringReceived);
			for (var i = 0; i<hintGivenList[currentNFC].length; i++) {
				hintManager.hintMover(hintManager.hintBlockCreator(hintGivenList[currentNFC][i]));
			};
		};

	},

	hintBlockCreator : function (stringReceived){
		var hintPar = document.createElement('p');
		var hintText = document.createTextNode(stringReceived);

		hintPar.className = "hint";

		hintPar.appendChild(hintText);

		return hintPar;
	},

	hintCleaner : function(){
		while (hintBlock.hasChildNodes()){
			var firstChild = hintBlock.firstChild;
			firstChild.parentNode.removeChild(firstChild);

		}
	},

	GMCleaner : function(){
		while (GMblock.hasChildNodes()){
			var firstChild = GMblock.firstChild;
			firstChild.parentNode.removeChild(firstChild);

		}
	},

	hintMover : function(hintPar){
		hintBlock.appendChild(hintPar);
	},

	reset : function(){
		hintGivenList = [];
		currentNFC = "undefined";
		hintManager.hintCleaner();
		hintManager.GMCleaner();
	},

}





// Main program

// Déclaration de variables et fonctions isolées

	// Déclaration d'éléments

		// Déclaration de variable

	var hintData = []; // Liste sous le format : [[NFCnumber,indice1,indice2..],[NFCnumber,indice1...]...].
	// hintData [3][4] renvoie l'indice 4 de la puce NFC numéro 3.

	var condData = []; // Liste sous le format : [[NFCnumber,NFCcond,Activated]...]
	// NFCcond : numéro de puce NFC conditionnelle, sous format "c1,c2..". "c0" correspond à l'absence de puce conditionnelle.
	//Activated = "1" si activée, "0" sinon.

	var IDdata = []; //IDdata [id] = [NFCnumber,Iscond]

	var condDataOld = []; // Liste de copie de la colonne "Activated" initiale de condData.

	var hintGivenList = []; // Liste sous le format [[indice11 donné,indice 12 donné...],[indice 21 donné]...]
	// Liste d'indice déja donné par numéro de puce NFC.

	var hintBlock = document.getElementById("wrapper_row2"); // Element HTML où afficher les différents indices.
	var currentNFC = "undefined"; // Dernière puce NFC lue, initialisation à "undefined".

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
            console.log("Tap a tag to read its id number.");
         },
         function (error) {     // listener fails to initialize
            alert("NFC reader failed to initialize " +
               JSON.stringify(error));
         }
         );
   },
   
   idToNumber : function(NFCid){
	   	//alert("working idto");
		if (IDdata[NFCid][1] == "0"){
			//alert("working idto cond");
			return parseInt(IDdata[NFCid][0]);
		} else {
			return IDdata[NFCid][0]
		}
		
	},

   onNfc: function(nfcEvent) {
	   //alert("i just read");
	    navigator.notification.vibrate(500);
	    var tag = nfcEvent.tag;
	    var stringTag = nfc.bytesToHexString(tag.id);
	    var NFCnumber = app.idToNumber(stringTag);
	   //alert(NFCnumber);
	    //app.display("Read tag: " + nfc.bytesToHexString(tag.id));

	    app.stopRead();
	    setTimeout(app.startRead,5000);

	    hintManager.init(NFCnumber);

   },
}

var CSVmanagerHint ={

	handleFiles : function(files){
		if (window.FileReader) {
			CSVmanagerHint.getAsText(files[0]);
		} else {
			alert('FileReader are not supported in this browser.');
		};
	},

	getAsText : function(fileToRead){
		var reader = new FileReader();
		reader.readAsText(fileToRead);
		reader.onload = CSVmanagerHint.loadHandler;
		reader.onerror = CSVmanagerHint.errorHandler;
	},

	loadHandler : function(event) {
		var csv = event.target.result;
		CSVmanagerHint.processData(csv);
	},

	processData : function(csv){
		var allTextLines = csv.split(/\r?\n|\r/);
        
            for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(';');
                var tarr = [];
                for (var j=0; j<data.length; j++) {
                        tarr.push(data[j]);
                    };
                hintData.push(tarr);
            };
        CSVmanagerHint.CSVremover();

        //alert(hintData[4][2]);
      },

      errorHandler : function(evt) {
      	if (evt.target.error.name == "NotReadableError") {
      		alert("Cannot read file !");
      	};
      },

      CSVremover : function(){
      	var input = document.getElementById("fileHint");
      	input.parentNode.removeChild(input);
      }
}

var CSVmanagerID ={

	handleFiles : function(files){
		if (window.FileReader) {
			CSVmanagerID.getAsText(files[0]);
		} else {
			alert('FileReader are not supported in this browser.');
		};
	},

	getAsText : function(fileToRead){
		var reader = new FileReader();
		reader.readAsText(fileToRead);
		reader.onload = CSVmanagerID.loadHandler;
		reader.onerror = CSVmanagerID.errorHandler;
	},

	loadHandler : function(event) {
		var csv = event.target.result;
		CSVmanagerID.processData(csv);
	},

	processData : function(csv){
		var allTextLines = csv.split(/\r?\n|\r/);
        
            for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(';');
                var tarr = [];
                for (var j=0; j<data.length; j++) {
                        tarr.push(data[j]);
                    };
                //tarr.push(false);
                IDdata[tarr[0]] = [tarr[1],tarr[2]];
                //condData[tarr[1]] = tarr;
            };
        CSVmanagerID.CSVremover();

        //alert(IDdata[][0]);
        //alert(condData);
      },

      errorHandler : function(evt) {
      	if (evt.target.error.name == "NotReadableError") {
      		alert("Cannot read file !");
      	};
      },

      CSVremover : function(){
      	var input = document.getElementById("fileID");
      	input.parentNode.removeChild(input);
      },
}

var CSVmanagerCond ={

	handleFiles : function(files){
		if (window.FileReader) {
			CSVmanagerCond.getAsText(files[0]);
		} else {
			alert('FileReader are not supported in this browser.');
		};
	},

	getAsText : function(fileToRead){
		var reader = new FileReader();
		reader.readAsText(fileToRead);
		reader.onload = CSVmanagerCond.loadHandler;
		reader.onerror = CSVmanagerCond.errorHandler;
	},

	loadHandler : function(event) {
		var csv = event.target.result;
		CSVmanagerCond.processData(csv);
	},

	processData : function(csv){
		var allTextLines = csv.split(/\r?\n|\r/);
        
            for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(';');
                var tarr = [];
                for (var j=0; j<data.length; j++) {
                        tarr.push(data[j]);
                    };
                //tarr.push(false);
                condData.push(tarr);
                //condData[tarr[1]] = tarr;
            };
        CSVmanagerCond.CSVremover();

        //alert(condData["c3"][0]);
        //alert(condData);
      },

      errorHandler : function(evt) {
      	if (evt.target.error.name == "NotReadableError") {
      		alert("Cannot read file !");
      	};
      },

      CSVremover : function(){
      	var input = document.getElementById("fileCond");
      	input.parentNode.removeChild(input);
      },
}

var condManager={

	condUpdater : function(NFCstring){
		
		for (var i=1;i<condData.length;i++){
			if (condData[i][1]==NFCstring){
				condDataOld[i]=condData[i][2];
				condData[i][2]=1;
			};
		};
		//condData[NFCstring][2] = 1;
	},

	isCondVerified : function(NFCnumber){
		if (parseInt(condData[NFCnumber][2])==1){
			return true;
		} else {
			return false;
		}
		
	},

}

var hintManager ={

	init : function(NFCnumber){
		//alert("working init hm"+NFCnumber);
		if (typeof(NFCnumber)=='string'){
			condManager.condUpdater(NFCnumber);
			return 0;
		} else {
			//alert(condManager.isCondVerified(NFCnumber));
			if ((currentNFC == "undefined")&&(condManager.isCondVerified(NFCnumber))){
				currentNFC = NFCnumber;
				hintManager.hintListCreator(NFCnumber);

			} else if ((currentNFC == "undefined")&&(!condManager.isCondVerified(NFCnumber))){

				alert("Inspectez d'abord les alentours...");
			
			} else if ((currentNFC != NFCnumber) && (condManager.isCondVerified(NFCnumber))) {
				
				currentNFC = NFCnumber;
				hintManager.hintCleaner();
				hintManager.hintMover(hintManager.hintListUpdater(NFCnumber));

			} else if ((currentNFC != NFCnumber) && (!condManager.isCondVerified(NFCnumber))){
				
				alert("Inspectez d'abord les alentours...");

			} else {
				hintManager.hintMover(hintManager.hintListUpdater(NFCnumber));
			};
		};

	},

	hintListCreator : function (NFCnumber){
		hintGivenList[NFCnumber] = [];
		hintGivenList[NFCnumber].push(hintData[NFCnumber][1]);
		hintManager.hintCleaner();
		hintManager.hintMover(hintManager.hintBlockCreator(NFCnumber,1));

	},

	hintListUpdater : function (NFCnumber){
		if (!hintGivenList[NFCnumber]){
			hintManager.hintListCreator(NFCnumber);
		} else {
			var nowOn = hintGivenList[NFCnumber].length;
			alert(nowOn);
			if (hintData[NFCnumber][nowOn + 1]){
				hintGivenList[NFCnumber].push(hintData[NFCnumber][nowOn + 1]);
				return hintManager.hintBlockCreator(NFCnumber,nowOn + 1);
			};
		};

	},

	hintBlockCreator : function (NFCnumber,hintNumber){
		var hintPar = document.createElement('p');
		var hintText = document.createTextNode(hintData[NFCnumber][hintNumber]);

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

	hintMover : function(hintPar){
		hintBlock.appendChild(hintPar);
	},

}

var reseter ={

	init : function(){
		currentNFC = "undefined";
		reseter.hintGivenReset();
		reseter.condDataReset();
		hintManager.hintCleaner();
	},

	hintGivenReset : function(){
		hintGivenList = [];
		
	},

	condDataReset : function(){
		for (var i = 1;i<condData.length;i++){
			if (condDataOld[i]){
				condData[i][2]=condDataOld[i];
			};
		};
	},

}



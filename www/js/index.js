// Main program

// Déclaration de variables et fonctions isolées

	// Déclaration d'éléments
	var elemSimuNFC1 = document.getElementById("NFCread1");
	var elemSimuNFC2 = document.getElementById("NFCread2");
	var elemSimuNFC3 = document.getElementById("NFCread3"); // (en attente de développement : vraie détection)


		// Déclaration de variable
	var tickerFunction; // Emplacement pour le SetInterval de NFCreader.startStopRead, afin de pouvoir l'annuler facilement.

	var hintData = []; // Liste sous le format : [[NFCnumber,indice1,indice2..],[NFCnumber,indice1...]...].
	// hintData [3][4] renvoie l'indice 4 de la puce NFC numéro 3.

	var condData = []; // Liste sous le format : [[NFCnumber,NFCcond,Activated]...]
	// NFCcond : numéro de puce NFC conditionnelle, sous format "c1,c2..". "c0" correspond à l'absence de puce conditionnelle.
	//Activated = "1" si activée, "0" sinon.

	var condDataOld = []; // Liste de copie de la colonne "Activated" initiale de condData.

	var hintGivenList = []; // Liste sous le format [[indice11 donné,indice 12 donné...],[indice 21 donné]...]
	// Liste d'indice déja donné par numéro de puce NFC.

	var hintBlock = document.getElementById("wrapper raw2"); // Element HTML où afficher les différents indices.
	var currentNFC = "undefined"; // Dernière puce NFC lue, initialisation à "undefined".

		// Déclaration de fonctions
	function init(){ // Fonction d'initialisation, seule fonction appelée directement dans le script.
		NFCreader.startStopRead(true); 
	}

// Structures complexes

var NFCreader ={ // Structure comprenant toutes les fonctions liée à la lecture d'une puce NFC.

	isReadingNFC : function(){ // Fonction "booléenne", tout est dans le titre. 
		if (elemSimuNFC1.checked){
			return [true,1];
		} else if (elemSimuNFC2.checked){
			return [true,2];
		} else if (elemSimuNFC3.checked){
			return [true,"c1"];
		} else {
			return [false,0];
		}

		
		// return elemSimuNFC.checked; // (en attente de développement : vraie détection)
	},

	startStopRead : function(bool){ // Interrupteur de lecture NFC ; argument : true = on, false = off.
		if (bool){
			;
			tickerFunction = setInterval(NFCreader.tick, 500); // Lancement d'une lecture NFC toutes les 0.5 secondes.
		} else {
			clearInterval(tickerFunction); // Arrêt de la lecture périodique.
		};
	},

	tick : function(){ // Fonction appelé à chaque itération du setInterval ; ici pour effectuer une lecture NFC.
		if ((NFCreader.isReadingNFC())[0]){

			NFCreader.startStopRead(false);
			setTimeout(NFCreader.startStopRead,10000,true);

			var NFCreadNumber = NFCreader.isReadingNFC()[1];
			alert(NFCreadNumber);
			hintManager.init(NFCreadNumber);
		};
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

		if (typeof(NFCnumber)=='string'){
			condManager.condUpdater(NFCnumber);
			return 0;
		} else {
			alert(condManager.isCondVerified(NFCnumber));
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
		while (hintGivenList[0]){
			hintGivenList.slice(0);
		};
	},

	condDataReset : function(){
		for (var i = 1;i<condData.length;i++){
			if (condDataOld[i]){
				condData[i][2]=condDataOld[i];
			};
		};
	},

}



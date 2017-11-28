    var app = {

    onNfc: function(nfcEvent) {
        var tag = nfcEvent.tag;
        app.display("Read tag: " + nfc.bytesToHexString(tag.id));
   },

/*
   appends @message to the message div:
*/
   display: function(message) {
      var label = document.createTextNode(message),
         lineBreak = document.createElement("br");
      messageDiv.appendChild(lineBreak);         // add a line break
      messageDiv.appendChild(label);             // add the text
   },
/*
   clears the message div:
*/
   clear: function() {
       messageDiv.innerHTML = "";
   },
};     // end of app

function win(){
    alert("reading");
};

function fail(){
    alert("failed to start reading");
};

function startReading(){
    nfc.addTagDiscoveredListener(app.onNfc, win, fail);
};



function enterPressed(){
    var message = new CustomEvent("Mes",{
        'detail': "&"+document.getElementById("message").value
    });
    console.log("enterPressed!");
    window.dispatchEvent(message);
    document.getElementById("message").value = "";
}

function sleep(m){
	var start = new Date().getTime();
	for(var i = 0 ; i < 1e7 ; i++){
		if(new Date().getTime() - start > m){
			break;
		}
	}
}

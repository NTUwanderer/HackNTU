var MyID
var connection = new WebSocket("ws://"+window.location.hostname+":8000");
connection.onopen = function(){
    console.log("Connection opened");
    window.addEventListener("Mes", function(event){
        console.log("Get message!");
        connection.send(event.detail);
    });
    connection.onmessage = function(e){
		MyID = e.data;
		console.log("onmessage: "+MyID);
		if(e.data[0]=="["){
			GETDATA(e.data);
		}
		else{
			RMID(e.data);
		}
    }
    connection.onclose = function(){
		console.log("close");
		connection.send(MyID);
	}
}
var t = {}

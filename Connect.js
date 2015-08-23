var MyID;
var my;
var flag = true;
var connection = new WebSocket("ws://"+window.location.hostname+":8000");
connection.onopen = function(){
    console.log("Connection opened");
    window.addEventListener("Mes", function(event){
        console.log("Get message!");
		if(event.detail[0]=="&"){
        	connection.send(event.detail);
		}
		else{
        	connection.send(event.detail);
		}
    });
    connection.onmessage = function(e){
		MyID = e.data;
		console.log("onmessage: "+MyID);
		if(e.data[0]=="["){
			GETDATA(e.data);
		}
		else if(e.data[0]=="&"){
			GETMESSAGE(e.data.slice(1));
		}
		else{
			RMID(e.data);
			var obj = JSON.parse(e.data);
			my = odj[0].id;
			console.log("my is "+ my);
		}
    }
    connection.onclose = function(){
		console.log("close");
		connection.send(MyID);
	}
}
var t = {}

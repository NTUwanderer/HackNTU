var http = require('http') ;
var express = require('express') ;
var app = express() ;
var path = require('path');
var ws = require('./node_modules/nodejs-websocket')
var mysql = require('./dbConn.js');

var count = 0;
var client = {};
function sleep(m){
	var start = new Date().getTime();
	for(var i = 0 ; i < 1e7 ; i++){
		if(new Date().getTime()-start > m)
			{break;}
	}
}

var server = ws.createServer(function (connection){
    console.log("Test for connect!")

    connection.on("text",function(str){
        console.log(str);
	var x=200,y=300;
	if(str[0]=="@"){
		console.log("send id");
		var sql = 'INSERT INTO playerInfo SET name= "'+str+'" ,xpos='+x+' ,ypos='+y;
		mysql.getInsert(sql);
		sleep(1000);
		var sql = 'SELECT * FROM playerInfo ORDER BY id DESC LIMIT 1';
		var db = mysql.getConn();
		db.query(sql, function(err, results) {
			if(err) console.log('mysql getQuery error');
			console.log(results);
			connection.sendText(results[0].id.toString()+" "+results[0].xpos.toString()+" "+results[0].ypos.toString());
		});
		db.end();
	}
	else if(str[0]=="$"){

		var sql = 'SELECT * FROM playerInfo';
		var db = mysql.getConn();
		db.query(sql, function(err, results) {
			if(err) console.log('mysql getQuery error');
			//console.log(results);
			var arr = [];			
			for(var i = 0 ; i < results.length ;i++){
				arr.push({
					"id":results[i].id.toString(),
					"x":results[i].xpos.toString(),
					"y":results[i].ypos.toString()				
				});
			}
			connection.sendText(JSON.stringify(arr));
		});
		db.end();
	}
     	//broadcast(str);

    })
    connection.on("close",function (code, reason){
	count = count -1;
	console.log(" is disconnected!"+code+" "+reason);
	var flag = 0 ;
	console.log(server.connections.length);
	for(var j = 0 ; j < count + 1 ; j++){
		for(var i= 0; i<server.connections.length;i++){
			if(server.connections[i] == client[j]){
				flag = 1;
				console.log("flag = 1 ;")
				console.log(i+" = "+j);
			}
		}
		if (flag == 0){
			console.log("client " + j + " is disconnected.");
			break;
		}
		else {flag = 0;}
	}
    })
})
server.listen(8000)

app.listen( 3000 );

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log("Homepage");
});

app.get('*.*s', function(req, res){
    res.sendFile(path.join(__dirname, req.url));
    console.log("file");
});


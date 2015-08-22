var http = require('http') ;
var express = require('express') ;
var app = express() ;
var path = require('path');
var ws = require('./node_modules/nodejs-websocket')
var mysql = require('./dbConn.js');

var lasCon = [];
for(var i=0 ; i<2000 ; i++) lasCon.push(-1);
var count = 0;
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
	var x=200,y=200;
	if(str[0]=="@"){
		console.log("send id");
		var sql = 'INSERT INTO playerInfo SET name= "'+str+'" ,xpos='+x+' ,ypos='+y;
		mysql.getInsert(sql);
		y += 20;
		var sql = 'SELECT * FROM playerInfo ORDER BY id DESC LIMIT 1';
		var db = mysql.getConn();
		db.query(sql, function(err, results) {
			if(err) console.log('mysql getQuery error');
			console.log(results);
			var tok = [];
			tok.push({
				"id" : results[0].id.toString(),
				"x" : results[0].xpos.toString(),
				"y" : results[0].ypos.toString()
			});
			connection.sendText(JSON.stringify(tok));
		});
		db.end();
	}
	else if(str[0]=="$"){
		var id = "",x="",y="" , i = 1;
		while(str[i]!=" "){
			id+=str[i];
			i++;
		}
		i++;
		while(str[i]!=" "){
			x+=str[i];
			i++
		}
		i++;
		while(str[i]!=" "){
			y+=str[i];
			i++
		}
		lasCon[parseInt(id)] = new Date().getTime();
		console.log(lasCon[parseInt(id)]);
		var sql = 'UPDATE playerInfo SET xpos='+parseInt(x)+', ypos='+parseInt(y)+' WHERE id='+parseInt(id);
		mysql.getUpdate(sql);

		console.log("Transfering " + str);
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
		count++;
		if(count%100==0){
			console.log("100 GET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
			for(var i = 0; i<2000 ; i++){
				if(lasCon[i]!= -1 && ( new Date().getTime()) - lasCon[i] > 500){
					console.log( i.toString() +" is disconnected! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					var sql = 'DELETE FROM playerInfo WHERE id='+i;
					mysql.getDelete(sql);
					lasCon[i] = -1;
					broadCast(i.toString());
				}
			}	
		}
	}
    })
    connection.on("close",function (code, reason){
	})
})
server.listen(8000)

function broadCast(str){
	server.connections.forEach( function(conn){
		conn.sendText(str);
	})
}


app.listen( 3000 );

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log("Homepage");
});

app.get('*.*s', function(req, res){
    res.sendFile(path.join(__dirname, req.url));
    console.log("file");
});


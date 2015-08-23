var mysql = require('mysql');

function getConn(){
	var db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '1160',
		database: 'ChatM'
	});

	db.connect();
	//console.log('dbConn start');
	return db;
}

var data;
function getQuery(sql) {
	var db = getConn();
	db.query(sql, function(err, results) {
		if(err) console.log('mysql getQuery error');
		data = results;
		//console.log(results);
	});
	db.end();
	return data;
}

function getInsert(sql) {
	var db = getConn();
	db.query(sql, function(err) {
		if(err) console.log('mysql getInsert error');
	});
	db.end();
}

function getUpdate(sql) {
	var db = getConn();
	db.query(sql, function(err) {
		if(err) console.log('mysql getUpdate error');
	});
	db.end();
}

function getDelete(sql) {
	var db = getConn();
	db.query(sql, function(err) {
		if(err) console.log('mysql getDelete error');
	});
	db.end();
}

exports.getConn = getConn;
exports.getQuery = getQuery;
exports.getInsert = getInsert;
exports.getUpdate = getUpdate;
exports.getDelete = getDelete;

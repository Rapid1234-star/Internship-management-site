var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: // your password
});

con.connect((err) => { if (err) throw err; console.log("Connected!"); con.query("CREATE DATABASE internship_management", (err) => { if (err) throw err; console.log("internship_management Database Created"); con.end(); }); });
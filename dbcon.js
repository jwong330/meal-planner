// Establish the database connection
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_ragasac',
  password        : '2065',
  database        : 'cs340_ragasac',
  multipleStatements: true
});

module.exports.pool = pool;
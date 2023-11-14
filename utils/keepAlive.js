const pool = require("../index");

function keepAlive() { 
    pool.getConnection(function(err, connection){
      if(err) { console.error('mysql keepAlive err', err); return; }
      connection.ping();
      connection.release();
    });
}
  
module.exports = keepAlive
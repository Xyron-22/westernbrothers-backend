const pool = require("../index");

function keepAlive() { 
    pool.getConnection(function(err, connection){
      if(err) { console.error('mysql keepAlive err', err); return; }
      console.log('ping db')
      connection.ping();     // this is what you want
      connection.release();
    });
}
  
module.exports = keepAlive
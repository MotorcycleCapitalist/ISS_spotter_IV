const request = require('request');


const fetchMyIP = function(callback){
   request(`https://api.ipify.org?format=json`, (error, response, body)=>{

            if (error) {
                callback(error, null);
                return;
            }
            const data = JSON.parse(response.body)

           
            if (response.statusCode !== 200) {
                const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
                callback(Error(msg), null);
                return;
            }

            callback(null, data.ip)
      
 
        
    })

}

const fetchCoordsByIp = function (ip, callback){
    request(`http://ipwho.is/${ip}`, (error, response, body)=>{
     

            if(error){
                callback(error, null)
                return
            }
           const data = JSON.parse(body)
            if(!data.success){
                const message = `Success, Server message says: ${data.message}`;
                callback(Error(message), null)
                return
            }


            const {latitude, longitude} = data;
            callback(null, {latitude, longitude})
        
      
   })

}

const fetchISSFlyOverTimes = function(coords, callback){
    request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
     (error, response, body)=>{
     

            if(error){
                callback(error, null)
                return
            }
           const data = JSON.parse(body)

            if(response.statusCode !== 200){
                const message = `Success, Server message says: ${data.message}`;
                callback(Error(message), null)
                return
            }

            callback(null, data.response)
            return
        
       
    })
};

const nextISSTimesForMyLocation = function(callback)  {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIp(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };
module.exports = {  nextISSTimesForMyLocation  }


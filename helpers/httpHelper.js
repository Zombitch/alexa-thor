const http = require('http');

HttpHelper = {

  /**
  * Check either the IP is a trusted IP and user doesn't need to login OR that user login and password provided by the session are correct
  * @param request The client request
  * @param response Server response use only if autoRedirectOnFail is true in order to redirect to login page is login fails
  * @param autoRedirectOnFail Boolean that indicates if the function should redirect the user to the login page if login fails
  * @param callback Callback call once mongo query finished. Note that callback will not be call if autoRedirectOnFail is true
  */
  getData : function(options){
    return new Promise(((resolve, reject) => {
      const request = http.request(options, (response) => {
        response.setEncoding('utf8');
        let returnData = '';

        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
        }

        response.on('data', (chunk) => {
          returnData += chunk;
        });

        response.on('end', () => {
          resolve(JSON.parse(returnData));
        });

        response.on('error', (error) => {
          reject(error);
        });
      });

      request.on('error', function (error) {
        reject(error);
      });

      request.end();
    }));
  },
};

module.exports = HttpHelper;

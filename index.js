const http = require('http');
const { url } = require('inspector');
const domainName = require('url');
const port = 5000;
const stringDecoder = require('string_decoder').StringDecoder;
const { parse } = require('querystring')

const handlers = require('./routehandlers');
const { join } = require('path');


const server = http.createServer((req, res) => {
    const urlElements = domainName.parse(req.url, true);
    const path = urlElements.pathname;
    const searchParameters = urlElements.query;
    const requestType = req.method.toLowerCase();
    const headersVariables = req.headers;
   
    const decoder = new stringDecoder('utf-8');

    let bodyData = "";

    req.on('data', (dataComingFromBody) => {
        bodyData = bodyData + decoder.write(dataComingFromBody);

    })
  

    req.on('end', () => {
        bodyData = bodyData + decoder.end();
        const selecthandler = typeof(routes[path]) != "undefined"? routes[path] : handlers.notFound;

        const data = {

            'path': path,
            'method': requestType,
            'headers': headersVariables ,
            'payload': JSON.parse(bodyData)
        }
        
      
        selecthandler(data, (statusCode, bodyData) =>{
                  
         
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            res.setHeader('Content-Type', 'application/json');
            payloadString = JSON.stringify(bodyData);
            res.writeHead(statusCode);
            res.end(payloadString);
           
        })
      
    })

});

server.listen(port, () => {
    console.log(`Server started at ${port}`)
});

//users, hobby,age

const routes = {
    '/users' : handlers.users,
    '/hobby' : handlers.hobby,
    '/age' : handlers.age
}




handlers.notFound = (data, callback) => {
    callback(404, { "Status": "Not Found" });
}



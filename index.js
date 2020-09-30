const http = require('http');
const { url } = require('inspector');
const domainName = require('url');
const port = 5000;
const stringDecoder = require('string_decoder').StringDecoder;
const { parse } = require('querystring')




const server = http.createServer((req, res) => {
    const urlElements = domainName.parse(req.url, true);
    const path = urlElements.pathname;
    const searchParameters = urlElements.query;
    const requestType = req.method.toLowerCase();
    const headersVariables = req.headers;
    console.log(headersVariables);

    let bodyData = "";

    req.on('data', (dataComingFromBody) => {
        bodyData = bodyData + dataComingFromBody.toString();

    })

    req.on('end', () => {

     
        console.log(typeof (bodyData));
        res.end(bodyData);
    })

});

server.listen(port, () => {
    console.log(`Server started at ${port}`)
});

//users, hobby,age

routes = {
    '/users' : handlers.users,
    '/hobby' : handlers.hobby,
    '/age' : handlers.age
}
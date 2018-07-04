const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const handlers = require('./lb/handlers');
const fs  = require('fs');
const port = 3000;

// Instantiating HTTP Server
const httpServer = http.createServer((req, res) => {
   unifiedServer(req,res);
});

httpServer.listen(config.HTTP_PORT, () => 
    console.log(`The server is listening on port ${config.HTTP_PORT} in ${config.ENV} mode`))
// Instantiate HTTPS Server


// Start the HTTPS Server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req,res);
 });

// Start Server and listen on port 3000
httpsServer.listen(config.HTTPS_PORT, () => 
    console.log(`The server is listening on port ${config.HTTPS_PORT} in ${config.ENV} mode`))

//  Server logic for botth http and https server
const unifiedServer = (req,res) => {
     // Parsing URL
     let parsedURL = url.parse(req.url, true)
     let path = parsedURL.pathname;
     let trimmedPath = path.replace(/^\/+|\/+$/g, '');
 
     // Return query string object from URL
     let queryStringObj = parsedURL.query;
 
     // HTTP Methods
     let HTTPmethod = req.method.toLowerCase();
 
     // Return headers as an object
     let headers = req.headers;
 
     // Get the payload from stream
     let decoder = new StringDecoder('utf-8');
     let buffer = '';
     req.on('data', data => buffer += decoder.write(data));
     req.on('end', () => {
         buffer += decoder.end();
         // Choose handler request goes to. If one is not found use notfound handler
         let chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound
 
         //Construct data object to send to handler
         let data = {
             'trimmedPath' : trimmedPath,
             'queryStringObj' : queryStringObj,
             'method' : HTTPmethod,
             'headers' : headers,
             'payload' : buffer
         };
         
         // Route the request to the handler specified in the router
         chosenHandler(data, (statusCode, payload) => {
             // Use status code called back by handler or default to 200
             statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
             // Use the payload called back by handler or defualt by empty obj
             payload = typeof(payload) == 'object' ? payload : {};
             // Convert the payload to a string
             let payloadString = JSON.stringify(payload);
 
             //return the response
             res.setHeader('Content-Type', 'application/json');
             res.writeHead(statusCode);
             res.end(payloadString);
 
             // Log the request path
         // console.log(path, queryStringObj, HTTPmethod, headers)
             console.log(`Return ${statusCode} and ${payloadString}`)
         });
   
     });
}

const router = {
    'ping': handlers.ping,
    'users': handlers.users
}
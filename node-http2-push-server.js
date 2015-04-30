var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var urlparser = require('url');
var querystring = require('querystring');

var doPush = true;

// The callback to handle requests
function onRequest(request, response) {
  var pushObjects = [];
  console.log("Received request: "+request.method+" "+request.url);
  var parsedUrl = urlparser.parse(request.url);
  console.log(parsedUrl);
  var filename = path.join(__dirname, parsedUrl.pathname);
  console.log(filename);
  var query = querystring.parse(parsedUrl.query);  
  console.log(query);
  if (query.push && !Array.isArray(query.push)) {
    query.push = [ query.push ];
  }
  if (request.method === "GET" && (filename.indexOf(__dirname) === 0) && fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    response.writeHead(200);

    if (doPush && response.push && query.push) {
      for (var i = 0; i < query.push.length; i++) {
        pushObjects[i] = response.push("/"+query.push[i]);
        pushObjects[i].writeHead(200);
        console.log("Sending push promise for "+query.push[i]);
      }
    }    

    response.write(fs.readFileSync(filename));
    console.log("Peer-originated request ended");

    if (doPush && response.push  && query.push) {
      for (var i = 0; i < query.push.length; i++) {
        pushObjects[i].end(fs.readFileSync(filename));
        console.log("Ending push of promised url "+query.push[i]);
      }
    }    

    response.end();
  } else {
    response.writeHead('404');
    response.end();
  }
  console.log("Server processing ended");
}

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({}, onRequest);
} else {
  server = http2.createServer({
    key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
  }, onRequest);
}

var port = 8091;
var ip = 'localhost';

server.listen(port, ip);
console.log("HTTP2 server started at http"+(process.env.HTTP2_PLAIN?"":"s")+"://"+ip+":"+port);
const wsServerPort = 8000;
const webSocketServer = requre("websocket").server;
const http = requre("http");

// Running http server and the websocket server
const server = http.createServer();
server.listen(wsServer);
const wsServer = new webSocketServer({
    httpServer: server
});


wsServer.on('request', function(request)) {
    console.log('Recieved a new connection from origin' + request);

    const connection = request.accept(null, request.origin);
    
}
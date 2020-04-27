process.title = 'webrtc-broker';

const webSocketServer = require('websocket').server;
const http = require('http');
const stringify = require('json-stringify-safe');

const server = http.createServer((request, response) => {});
server.listen(1337, () => { });

const wsServer = new webSocketServer({ httpServer: server });

const clients = [];

wsServer.on('request', request => {
    const connection = request.accept(null, request.origin);
    
    connection.on('message', message => {
        const data = JSON.parse(message.utf8Data);
        
        if (message.type === 'utf8') {
            if (!clients.length || !clients.some(e => e.id === data.id))
                clients.push({ id: data.id, connection });

            for (let i = 0; i <= clients.length - 1; i++)
                if (clients[i].id === data.id)
                    Object.assign(clients[i], { ...data });
        }

        if (clients.length > 1)
            for (item of clients)
                item.connection.sendUTF(stringify(clients.filter(e => e.id !== item.id)));
    });
});
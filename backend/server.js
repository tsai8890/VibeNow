import { WebSocketServer } from 'ws';
import messageHandler from './eventHandlers/messageHandlers/messageHandler.js';
import closeHandler from './eventHandlers/closeHandler/closeHandler.js';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 4300 })

wss.on('connection', ws => {
    console.log(`[WebSocket] Connected!!`);

    ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log(`[WebSocket] Received: ${message}`);
        messageHandler(ws, message);
    });

    ws.on('close', (code, reason) => {
        console.log('[WebSocket] Closed.')
        closeHandler(ws, code, reason);
    })
});
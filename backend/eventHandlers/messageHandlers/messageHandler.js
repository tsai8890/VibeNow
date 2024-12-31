import msgHandler from "./subHandlers/msgHandler.js";
import queueHandler from "./subHandlers/queueHandler.js";

export default function messageHandler(ws, message) {
    if (message.startsWith('[queue]')) {
        queueHandler(ws, message);
    }
    else if (message.startsWith('[message]')) {
        msgHandler(ws, message);
    }
    else {
        console.error('Something went wrong, invalid data received ...');
    }
};
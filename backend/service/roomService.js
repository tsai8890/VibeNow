import { v1 as uuidv1 } from 'uuid';
import wsPool from './wsPool.js';

class RoomService {
    rooms = new Map();

    createRoom(wss) {
        if (wss.length !== 2) {
            return;
        }
        
        const rid = uuidv1();
        this.rooms.set(rid, {wss: wss, messages: []});
        return rid;
    }

    getWssByRID(rid) {
        return this.rooms.get(rid).wss;
    }

    removeRoom(rid) {
        const room = this.rooms.get(rid);
        for (const ws of room.wss) {
            ws.send(`[room] exit`);
        }
        this.rooms.delete(rid);
    }
    
    sendMessage(senderWs, message) {
        const uid = wsPool.getUID(senderWs);
        const rid = wsPool.getRID(senderWs);
        
        // Update the message record
        let room = this.rooms.get(rid);
        room.messages.push({
            uidFrom: uid,
            message: message
        });
        this.rooms.set(rid, room);

        // Notify everyone in the room
        for (const receiverWs of room.wss) {
            receiverWs.send(`[message] [${wsPool.getUID(senderWs)}] ${message}`);
        }
        
        this.rooms.forEach(r => console.log(r.messages.map(msg => `${msg.uidFrom}: ${msg.message} || `)))
    }
}

let roomService = new RoomService()
export default roomService;
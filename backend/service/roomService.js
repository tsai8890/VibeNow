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
            ws.send(`[system] The person has left.`);
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
        
        console.log('[Room Statistics]');
        this.rooms.forEach((room, rid) => {
            const roomMessages = room.messages.map(msg => `${msg.uidFrom}: ${msg.message}`);
            console.log(`Room ${rid}:`);
            console.log(roomMessages);
        });
    }
}

let roomService = new RoomService()
export default roomService;
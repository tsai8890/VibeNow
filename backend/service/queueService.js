import roomService from './roomService.js';
import wsPool from './wsPool.js';

class QueueService {
    waitingQueue = [];
    
    push(ws) {
        // Enter the queue
        const uid = wsPool.addConnection(ws);
        ws.send(`[queue] entered ${uid}`);
        this.waitingQueue.push(ws);

        console.log(`[Queue] New user entered the queue | UID: ${uid}`);
        console.log(`[Pool] User Pool Size: ${wsPool.pool.size}`);
        console.log(`[Queue] Waiting Queue Length: ${this.waitingQueue.length}`);

        // Matching ...
        let validWs1 = null;
        let validWs2 = null;

        while (this.waitingQueue.length >= 1) {
            const ws1 = this.waitingQueue.shift();
            if (!wsPool.hasConnection(ws1)) {
                continue;
            } else {
                validWs1 = ws1;
                break;
            }
        }

        while (this.waitingQueue.length >= 1) {
            const ws2 = this.waitingQueue.shift();
            if (!wsPool.hasConnection(ws2)) {
                continue;
            } else {
                validWs2 = ws2;
                break;
            }
        }

        // No valid match
        if (validWs1 === null && validWs2 === null) {
            return;
        }
        // No valid match: got only one valid user
        else if (validWs1 === null || validWs2 === null) {
            if (validWs1 !== null) {
                this.waitingQueue.unshift(validWs1);
            } else {
                this.waitingQueue.unshift(validWs2);
            }
        }
        // Matched successfully
        else {
            const rid = roomService.createRoom([validWs1, validWs2]);
            validWs1.send(`[queue] matched ${rid}`);
            validWs2.send(`[queue] matched ${rid}`);
            validWs1.send(`[system] Connection Established !!`);
            validWs2.send(`[system] Connection Established !!`);
            console.log(`A room ${rid} is established !!!`);
    
            wsPool.enterRoom(validWs1, rid);
            wsPool.enterRoom(validWs2, rid);
        }
    }
}

let queueService = new QueueService();
export default queueService;
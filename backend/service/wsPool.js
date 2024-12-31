import { v1 as uuidv1 } from 'uuid';

class WSPool {
    pool = new Map();

    addConnection(ws) {
        const uid = uuidv1();
        this.pool.set(ws, {uid: uid, rid: null});
        return uid;
    }

    hasConnection(ws) {
        return this.pool.has(ws);
    }

    removeConnection(ws) {
        ws.close();
        this.pool.delete(ws);
        console.log(`[Pool] User Pool Size: ${this.pool.size}`);
    }

    enterRoom(ws, rid) {
        if (!this.hasConnection(ws)) {
            return;
        }
        const wsDetail = this.pool.get(ws);
        wsDetail.rid = rid;
        this.pool.set(ws, wsDetail);
    }

    getUID(ws) {
        if (!this.hasConnection(ws)) {
            return null;
        }
        return this.pool.get(ws)?.uid;
    }

    getRID(ws) {
        if (!this.hasConnection(ws)) {
            return null;
        }

        if (this.pool.get(ws).rid === null) {
            return null;
        } else {
            return this.pool.get(ws).rid;
        }
    }
}

const wsPool = new WSPool();
export default wsPool;
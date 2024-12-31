import roomService from "../../service/roomService.js";
import wsPool from "../../service/wsPool.js";

export default function closeHandler(ws, code, reason) {
    const rid = wsPool.getRID(ws);

    if (rid === null) {
        wsPool.removeConnection(ws);
    } else {
        const roomWss = roomService.getWssByRID(rid);
        roomService.removeRoom(rid);

        for (const roomWs of roomWss) {
            wsPool.removeConnection(roomWs);
        }
    }
};
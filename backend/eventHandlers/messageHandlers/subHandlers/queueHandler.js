import queueService from "../../../service/queueService.js";

export default function queueHandler(ws, message) {
    // [queue] join
    const cmd = message.slice('[queue] '.length);
    if (cmd === 'join') {
        queueService.push(ws);
    }
}
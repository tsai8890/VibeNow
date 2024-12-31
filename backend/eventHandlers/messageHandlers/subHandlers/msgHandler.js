import roomService from "../../../service/roomService.js";

export default function msgHandler(ws, message) {
    // '[message] {text}'
    const text = message.slice('[message] '.length);
    roomService.sendMessage(ws, text);
}
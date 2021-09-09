class Room{
    constructor(roomId, roomName, nsName,privateRoom=false) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.nsName = nsName;
        this.privateRoom = privateRoom;
        this.chatHistory = [];
    }
    addMessage(newMsg) {
        this.chatHistory.push(newMsg);
    }
    clearHistory() {
        this.chatHistory = [];
    }
}
module.exports = Room;
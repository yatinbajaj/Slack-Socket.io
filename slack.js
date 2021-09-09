const express = require("express");
const namespaces = require("./data/namespaces");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer, {
    path: "/socket.io",
    serveClient: true,
});

// io.of('/').on() === io.on() main namespace
io.on("connection", (socket) => {
    // build an array to send back with each ns image and endpoint
    const nsData = namespaces.map((namespace) => {
        return {
            img: namespace.img,
            endpoint: namespace.endpoint,
        };
    });
    // send this ns data back to client. we need to use socket instead of io because we want  to just this client only.
    socket.emit("nsList", nsData);
});

// loop through all namespace and listen for a connection [ nsSocket is namespace Socket]
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on("connection", (nsSocket) => {
        console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
        const userName = nsSocket.handshake.query.userName;
        // a socket has joined one of our chatgroup namespace.
        // send that ns group info back to client
        const roomData = namespace.rooms;
        nsSocket.emit("nsRoomsList", roomData);

        //Join the room selected by the client
        nsSocket.on("joinRoom", (roomToJoin, numberOfUserCallback) => {
            const iter = nsSocket.rooms.values();
            iter.next().value;
            const roomToLeave = iter.next().value;

            nsSocket.leave(roomToLeave); // leave the room
            updateMember(namespace, roomToLeave);

            nsSocket.join(roomToJoin);

            io.of(namespace.endpoint)
                .in(roomToJoin)
                .allSockets()
                .then((Set) => {
                    numberOfUserCallback(Set.size);
                });

            const nsRoom = namespace.rooms.find(
                (room) => roomToJoin === room.roomName
            );
            nsSocket.emit("historyCatchUp", nsRoom.chatHistory);

            updateMember(namespace, roomToJoin);
        });
        nsSocket.on("newMessageToServer", (msg) => {
            const fullMsg = {
                img: "https://via.placeholder.com/30",
                text: msg.text,
                time: Date.now(),
                name: userName,
            };
            console.log(fullMsg);

            // Send this message to all the sockets that are in the room that THIS socket is in.
            // How can we find THIS socket is in.?
            console.log(nsSocket.rooms);

            // the user will be in the 2nd room in the object list
            // this is because the socket always joins its own room first on connection
            // get keys

            // const roomTitle = Object.keys(nsSocket.rooms);
            const iter = nsSocket.rooms.values();
            iter.next().value;
            const roomTitle = iter.next().value;

            io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);

            const nsRoom = namespace.rooms.find((room) => {
                return roomTitle === room.roomName;
            });
            nsRoom.addMessage(fullMsg);
        });
        // deals with history once we had it
    });
});


const updateMember = (namespace, roomToJoin) => {
    // send back the number of users in this room to all the socket connected to this room
    io.of(namespace.endpoint)
        .in(roomToJoin)
        .allSockets()
        .then((Set) => {
            io.of(namespace.endpoint).in(roomToJoin).emit("updateMember", Set.size);
        });
};

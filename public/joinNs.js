const joinNs = (endpoint) => {
    if (nsSocket) {
        // check to see if ns Sockrt is actually a socket
        nsSocket.close();
        // remove the listener  before its added again that is on change of ns
        document
            .querySelector("#user-input")
            .removeEventListener("submit", submitHandler);
    }
    nsSocket = io(`http://localhost:9000${endpoint}`);
    nsSocket.on("nsRoomsList", (nsRoomsList) => {
        console.log("list called");
        const roomListDom = document.querySelector(".room-list");
        roomListDom.innerHTML = "";
        nsRoomsList.forEach((nsRoom) => {
            let glpyh;
            if (nsRoom.privateRoom) {
                glpyh = "lock";
            } else {
                glpyh = "globe";
            }
            roomListDom.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${nsRoom.roomName}</li>`;
        });

        // Add click listener to all this list
        const roomNodes = Array.from(document.getElementsByClassName("room"));
        roomNodes.forEach((elem) => {
            elem.addEventListener("click", (event) => {
                console.log(event.target.innerText);
                joinRoom(event.target.innerText);
            });
        });

        // Add room Automatically....First time here
        const topRoom = document.querySelector(".room");
        const topRoomName = topRoom.innerText;
        console.log(topRoomName);
        joinRoom(topRoomName);
    });

    nsSocket.on("messageToClients", (msg) => {
        console.log(msg);
        const newMsg = buildMsg(msg);
        document.querySelector("#messages").innerHTML += newMsg;
    });

    document
        .querySelector(".message-form")
        .addEventListener("submit", submitHandler);
};

function submitHandler(event) {
    event.preventDefault();
    const msg = document.querySelector("#user-message").value;
    nsSocket.emit("newMessageToServer", { text: msg });
}
function buildMsg(msg) {
    const newHtml = `<li>
                    <div class="user-image">
                        <img src="${msg.img}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.name}<span>${msg.time} pm</span></div>
                        <div class="message-text">${msg.text}.</div>
                    </div>
                </li>`;
    return newHtml;
}

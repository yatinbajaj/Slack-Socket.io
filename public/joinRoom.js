const joinRoom = (roomName) => {
    // Send this scoket Name to server!
    nsSocket.emit("joinRoom", roomName, (newMemberNumber) => {
        // We want to update the room member total now that we have joined!
        document.querySelector(
            ".curr-room-num-users"
        ).innerHTML = `${newMemberNumber} <span class="glyphicon glyphicon-user"></span>`;
    });
    nsSocket.on("historyCatchUp", (msgHistory) => {
        const messageUl = document.querySelector("#messages");
        messageUl.innerHTML = "";
        msgHistory.forEach((msg) => {
            const newMsg = buildMsg(msg);
            const currentMsg = messageUl.innerHTML;
            messageUl.innerHTML = currentMsg + newMsg;
        });
        messageUl.scrollTo(0, messageUl.scrollHeight);
    });
    nsSocket.on("updateMember", (numMember) => {
        document.querySelector(
            ".curr-room-num-users"
        ).innerHTML = `${numMember} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector(
            ".curr-room-text"
        ).innerHTML = `${roomName} <span class="glyphicon glyphicon-user"></span>`;
    });

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) => {
        let message = Array.from(document.getElementsByClassName('message-text'));
        message.forEach(elem => {
            if (elem.innerText.indexOf(e.target.value.toLowerCase()) === -1) {
                elem.style.display = 'none';
            } else {
                elem.style.display = 'block';
            }
        })
    })
};

const userName = prompt("what's your userName?");
const socket = new io("http://localhost:9000", {
  query: {
    userName,
  },
}); //  /-namespace
let nsSocket = "";
// listen for nsList. which is the list of all the namespaces.

socket.on("nsList", (nsList) => {
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsList.forEach((ns) => {
    console.log(ns);
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`;
  });

  // Add a click listener for each namespace
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (event) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(nsEndpoint);
      joinNs(nsEndpoint);
    });
  });

  joinNs("/wiki");
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", {
    data: "I'm happy that you accept my request",
  });
});

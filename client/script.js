const socket = io();

let boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    socket.emit("box_click", { id: box.id });
  });
});

socket.on("box_update", (data) => {
  let box = document.getElementById(data.id);
  box.children[0].innerHTML = data.value;
});

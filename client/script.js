const socket = io();

let boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    socket.emit("box_click", { id: box.id });
  });
});

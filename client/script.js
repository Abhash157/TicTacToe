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
  checkWinner();
});

function checkWinner() {
  let boxes = document.querySelectorAll(".box");
  let values = Array.from(boxes).map((box) => box.children[0].innerHTML);

  let winner = null;
  let winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  winningCombos.forEach((combo) => {
    if (
      values[combo[0]] &&
      values[combo[0]] === values[combo[1]] &&
      values[combo[0]] === values[combo[2]]
    ) {
      winner = values[combo[0]];
    }
  });

  if (winner) {
    let alert = document.querySelector(".alert");
    alert.style.display = "flex";
    alert.innerHTML = `Winner: ${winner}`;
    socket.emit("winner", { winner: winner });
  }
}

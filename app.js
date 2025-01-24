var express = require("express");
var app = express();
var serv = require("http").Server(app);

var log = (cmd) => {
  console.log(cmd);
};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(2000);
console.log("Server started.");

let Player = function (id) {
  let self = {
    id: id,
    turn: false,
  };
  return self;
};

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket) {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  let player = Player(socket.id);
  PLAYER_LIST[socket.id] = player;
  if (Object.keys(SOCKET_LIST).length == 1) {
    PLAYER_LIST[socket.id].turn = true;
  }

  socket.on("box_click", function (data) {
    updateBox(data.id, socket);
  });

  socket.on("new-game", function () {
    for (let i in SOCKET_LIST) {
      let socket = SOCKET_LIST[i];
      socket.emit("new-game");
    }
  });

  socket.on("disconnect", function () {
    delete SOCKET_LIST[socket.id];
  });
});

function updateBox(box_id, socket) {
  let content = "";
  log(PLAYER_LIST[socket.id].turn + "  " + Object.keys(SOCKET_LIST));
  if (socket.id == Object.keys(SOCKET_LIST)[0] && PLAYER_LIST[socket.id].turn) {
    content = "O";
    PLAYER_LIST[Object.keys(SOCKET_LIST)[0]].turn = false;
    PLAYER_LIST[Object.keys(SOCKET_LIST)[1]].turn = true;
  } else if (
    socket.id == Object.keys(SOCKET_LIST)[1] &&
    PLAYER_LIST[socket.id].turn
  ) {
    content = "X";
    PLAYER_LIST[Object.keys(SOCKET_LIST)[1]].turn = false;
    PLAYER_LIST[Object.keys(SOCKET_LIST)[0]].turn = true;
  }

  for (let i in SOCKET_LIST) {
    let socket = SOCKET_LIST[i];
    socket.emit("box_update", { value: content, id: box_id });
  }
}

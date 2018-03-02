import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

// function nesto(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('nesto', 1000);
// }

function onIncomingData(callback) {
  socket.on("newData", () => {
    callback();
  });
}

function pushToSocket(data) {
  socket.emit("pushToSocket");
}

export {
  pushToSocket,
  onIncomingData
};
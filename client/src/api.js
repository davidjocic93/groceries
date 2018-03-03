import _ from "lodash";
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

// function nesto(cb) {
//   socket.on('timer', timestamp => cb(null, timestamp));
//   socket.emit('nesto', 1000);
// }

function onIncomingData(callback) {
  socket.on("newData", () => {
    const debounced = _.debounce(callback, 500);
    debounced();
    console.log("on incoming data")
  });
}

function pushToSocket() {
  socket.emit("pushToSocket");
}

export {
  pushToSocket,
  onIncomingData
};
import _ from "lodash";
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000');

function onSocketNotification(callback) {
  socket.on("notifyClient", () => {
    const debounced = _.debounce(callback, 500);
    debounced();
  });
}

function notifyServer() {
  socket.emit("notifyServer");
}

export {
  notifyServer,
  onSocketNotification
};
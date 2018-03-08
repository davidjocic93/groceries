const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

require("./routes/routes")(app);

io.sockets.on("connection", (socket) => {
	socket.on("notifyServer", () => {
		socket.broadcast.emit("notifyClient");
	});
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
	console.log("Server is running!");
});

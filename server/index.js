const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const fs = require("fs");
const data = fs.readFileSync("./db/groceries.json");
const groceries = JSON.parse(data);

function convertToNumber(param) {
	if (typeof (param.quantity) !== "number") {
		param.quantity = Number(param.quantity);
	}
}

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

app.get("/", (req, res) => {
	console.log("GET REQUEST");
	res.send(groceries);
});

app.post("/", (req, res) => {
	console.log("POST REQUEST");
	let currentData = groceries;
	let incomingData = req.body;

	convertToNumber(incomingData);

	currentData.push(incomingData);
	let data = JSON.stringify(currentData, null, 2);

	fs.writeFile("./db/groceries.json", data, () => {
		console.log(incomingData.name + " successfully added!");
	});
	res.send(incomingData);
});

app.put("/:groceryName", (req, res) => {
	console.log("PUT REQUEST");
	let groceryName = req.params.groceryName;
	let currentData = groceries;
	let incomingData = req.body;
	let newData = [];

	convertToNumber(incomingData);

	for (let i = 0; i < currentData.length; i++) {
		let grocery = currentData[i];
		if (groceryName === grocery.name) {
			grocery.quantity = incomingData.quantity;
		}
		newData.push(grocery);
	}

	let data = JSON.stringify(newData, null, 2);

	fs.writeFile("./db/groceries.json", data, () => {
		console.log(groceryName + " successfully updated!");
	});
	res.send(incomingData);
});

app.delete("/:groceryName", (req, res) => {
	console.log("DELETE REQUEST");
	let groceryName = req.params.groceryName;
	let currentData = groceries;

	for (let i = 0; i < currentData.length; i++) {
		let grocery = currentData[i];
		if (groceryName === grocery.name) {
			currentData.splice(i, 1);
		}
	}

	let data = JSON.stringify(currentData, null, 2);

	fs.writeFile("./db/groceries.json", data, () => {
		console.log(groceryName + " successfully deleted!");
	});
	res.send(groceryName + " successfully deleted!");
});

io.sockets.on("connection", (socket) => {
	socket.on("notifyServer", () => {
		socket.broadcast.emit("notifyClient");
	});
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
	console.log("Server is running!");
});

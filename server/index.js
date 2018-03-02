const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const data = fs.readFileSync("./db/groceries.json");
const groceries = JSON.parse(data);

function toNumber (param) {
	if (typeof(param.quantity) !== "number") {
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
	res.send(groceries);
});

app.post("/", (req, res) => {
	let currentData = groceries;
	let incomingData = req.body;

	toNumber(incomingData);

	currentData.push(incomingData);
	let data = JSON.stringify(currentData, null, 2);

	fs.writeFile("./db/groceries.json", data, () => {
		console.log(incomingData.name + " successfully added!");
	});
	res.send(incomingData);
});

app.put("/:groceryName", (req, res) => {
	let groceryName = req.params.groceryName;
	let currentData = groceries;
	let incomingData = req.body;
	let newData = [];

	toNumber(incomingData);

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
	let groceryName = req.params.groceryName;
	let currentData = groceries;

	for (let i = 0; i < currentData.length; i++) {
		let grocery = currentData[i];
		if (groceryName === grocery.name) {
			currentData.splice(i,1);
		}
	}

	let data = JSON.stringify(currentData, null, 2);

	fs.writeFile("./db/groceries.json", data, () => {
		console.log(groceryName + " successfully deleted!");
	});
	res.send(groceryName + " successfully deleted!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (PORT) => {
	console.log("Server is running!");
});

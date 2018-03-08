const fs = require("fs");
const data = fs.readFileSync("./db/groceries.json");
const groceries = JSON.parse(data);

function convertToNumber(param) {
    if (typeof (param.quantity) !== "number") {
        param.quantity = Number(param.quantity);
    }
}

module.exports = (app) => {
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
}
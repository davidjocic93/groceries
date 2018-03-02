import React, { Component } from "react";
import { communicationService } from "../service/communicationService";
import GroceriesList from "./groceriesList";
import InputForm from "./inputForm";
import { pushToSocket, onIncomingData } from "../api";

class MainPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			groceries: [],
			newGroceryName: "",
			newGroceryQuantity: ""
		};
	}

	getData = () => {
		console.log("new data")
		communicationService.getRequest("/",
			response => {
				this.setState({ groceries: response.data });
			},
			error => {
				console.log(error);
			}
		);
	}

	loadData = () => {
		onIncomingData(this.getData);

		communicationService.getRequest("/",
			response => {
				this.setState({ groceries: response.data });
			},
			error => {
				console.log(error);
			}
		);
	};

	handleInputChange = (event) => {
		const target = event.target;
		let value = target.value;
		const name = target.name;

		if (name === "newGroceryQuantity") {
			value = Number(target.value);
		}

		this.setState({
			[name]: value
		});
	}

	doesGroceryExist = (groceries, grocery) => {
		for (let i = 0; i < groceries.length; i++) {
			if (grocery.name.toLowerCase().trim() === groceries[i].name.toLowerCase().trim()) {
				return i;
			}
		}
		return -1;
	};

	onButtonClick = event => {
		event.preventDefault();
		const newGroceryName = this.state.newGroceryName.toLowerCase();
		const newGroceryQuantity = this.state.newGroceryQuantity;

		if (!newGroceryName || !newGroceryQuantity || newGroceryQuantity <= 0) {
			return;
		}

		this.addNew(newGroceryName, newGroceryQuantity);

		this.setState({
			newGroceryName: "",
			newGroceryQuantity: ""
		});
	};

	addNew = (name, quantity) => {
		let data = {
			name,
			quantity
		};

		const groceryAlreadyExists = this.doesGroceryExist(this.state.groceries, data);

		if (groceryAlreadyExists >= 0) {
			const groceries = this.state.groceries;
			groceries[groceryAlreadyExists].quantity += parseInt(data.quantity, 10);
			const updatedGrocery = groceries[groceryAlreadyExists];

			communicationService.putRequest(`/${updatedGrocery.name}`, updatedGrocery,
				response => {
					this.loadData();
				},
				error => {
					console.log(error);
				}
			);
			return;
		}

		communicationService.postRequest("/", data,
			response => {
				this.loadData();
			},
			error => {
				console.log(error);
			}
		);

		pushToSocket(data);
	};

	deleteGrocery = name => {
		communicationService.deleteRequest(`/${name}`,
			response => {
				this.loadData();
			},
			error => {
				console.log(error);
			}
		);
	};

	componentDidMount() {
		this.loadData();

		// nesto((err, timestamp) => {
		// 	this.setState({
		// 		timestamp
		// 	});
		// });
	}

	render() {
		return (
			<div className="container">

				<div className="row">
					<div className="col s12 center-align">
						<h1>Groceries</h1>
					</div>
				</div>

				<InputForm
					handleInputChange={this.handleInputChange}
					// handleGroceryNameChange={this.handleGroceryNameChange}
					// handleGroceryQuantityChange={this.handleGroceryQuantityChange}
					newGroceryName={this.state.newGroceryName}
					newGroceryQuantity={this.state.newGroceryQuantity}
					onButtonClick={this.onButtonClick} />

				{(this.state.groceries.length ?
					<GroceriesList
						groceries={this.state.groceries}
						deleteGrocery={this.deleteGrocery} />
					:
					<div className="col s12 center-align no-groceries"><h1>ADD NEW GROCERY!</h1></div>
				)}
			</div>
		);
	}
}

export default MainPage;

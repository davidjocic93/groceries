import React, { Component } from "react";
import { GroceriesList } from "../components/groceriesList";
import { InputForm } from "../components/inputForm";
import { communicationService } from "../service/communicationService";
import { notifyServer, onSocketNotification } from "../service/socket-io";

class MainPage extends Component {
	constructor(props) {
		super(props);

		onSocketNotification(this.getData);

		this.state = {
			groceries: [],
			newGroceryName: "",
			newGroceryQuantity: ""
		};
	}

	getData = () => {
		communicationService.getRequest("/",
			response => {
				this.setState({ groceries: response.data });
			},
			error => {
				this.processError(error);
			}
		);
	}

	loadData = () => {
		this.getData();
	};

	handleInputChange = (event) => {
		const target = event.target;
		let value = target.value;
		const name = target.name;

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

	onAddButtonClick = event => {
		event.preventDefault();
		const newGroceryName = this.state.newGroceryName.toLowerCase();
		const newGroceryQuantity = this.state.newGroceryQuantity;

		if (!newGroceryName || !newGroceryQuantity || newGroceryQuantity <= 0) {
			return;
		}

		this.addNew(newGroceryName, Number(newGroceryQuantity));

		notifyServer();


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
					this.processError(error);
				}
			);
			return;
		}

		communicationService.postRequest("/", data,
			response => {
				this.loadData();
			},
			error => {
				this.processError(error);
			}
		);
	};

	deleteGrocery = name => {
		communicationService.deleteRequest(`/${name}`,
			response => {
				this.loadData();
			},
			error => {
				this.processError(error);
			}
		);
		notifyServer();
	};

	processError = (error) => {
		console.log(error);
	}

	componentDidMount() {
		this.loadData();
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
					newGroceryName={this.state.newGroceryName}
					newGroceryQuantity={this.state.newGroceryQuantity}
					onAddButtonClick={this.onAddButtonClick} />

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

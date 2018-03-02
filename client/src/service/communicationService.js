import axios from "axios";
const BASE_URL = "http://polar-brushlands-27994.herokuapp.com";
// const BASE_URL = "http://localhost:5000";

class CommunicationService {
	getRequest(url, succesHandler, errorHandler) {
		const requestUrl = `${BASE_URL}${url}`;

		axios
			.get(requestUrl)
			.then(response => succesHandler(response))
			.catch(error => errorHandler(error));
	}

	postRequest(url, postData, succesHandler, errorHandler) {
		const requestUrl = `${BASE_URL}${url}`;

		axios
			.post(requestUrl, postData)
			.then(response => succesHandler(response))
			.catch(error => errorHandler(error));
	}

	putRequest(url, postData, succesHandler, errorHandler) {
		const requestUrl = `${BASE_URL}${url}`;

		axios
			.put(requestUrl, postData)
			.then(response => succesHandler(response))
			.catch(error => errorHandler(error));
	}

	deleteRequest(url, succesHandler, errorHandler) {
		const requestUrl = `${BASE_URL}${url}`;

		axios
			.delete(requestUrl)
			.then(response => succesHandler(response))
			.catch(error => errorHandler(error));
	}
}

export const communicationService = new CommunicationService();

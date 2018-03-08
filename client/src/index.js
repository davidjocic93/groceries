import React from "react";
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from "./containers/mainPage";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MainPage />, document.getElementById('root'));
registerServiceWorker();

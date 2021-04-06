import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//Component imports
import SearchBar from "./components/suchen";
import Hauptform from "./components/main";

ReactDOM.render(<Hauptform />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

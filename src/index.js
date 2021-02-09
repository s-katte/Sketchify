import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ColabForm from "./components/ColabForm";
import { SocketProvider } from "./contexts/SocketContext";
import ColabApp from "./components/ColabApp";

ReactDOM.render(
    <SocketProvider>
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
                <Route exact path="/colabDetails" component={ColabForm} />
                <Route exact path="/colab-app" component={ColabApp} />
            </Switch>
        </Router>
    </SocketProvider>,
    document.getElementById("root")
);

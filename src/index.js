import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
//import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href =
  "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// 這支 CSS 檔的樣式會作用到全域
import "./style/styles.css"

ReactDOM.render(
    <App />,
    document.querySelector("#root")
);
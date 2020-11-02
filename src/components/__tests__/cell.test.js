import React from "react";
import ReactDOM from "react-dom";
import Cell from "../cell";

it ("renderiza ok", () => {
    const testDiv = document.createElement("div");
    ReactDOM.render(<Cell />, testDiv);
});
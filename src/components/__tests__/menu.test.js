import React from "react";
import ReactDOM from "react-dom";
import Menu from "../menu";

it ("renderiza ok", () => {
    const testDiv = document.createElement("div");
    ReactDOM.render(<Menu />, testDiv);
});
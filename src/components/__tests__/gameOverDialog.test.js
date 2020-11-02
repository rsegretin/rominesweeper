import React from "react";
import ReactDOM from "react-dom";
import GameOverDialog from "../gameOverDialog";
//import jest from "jest";

it("renderiza ok", () => {
  const testDiv = document.createElement("div");
  ReactDOM.render(<GameOverDialog dialogTitle={"Test"} />, testDiv);
});

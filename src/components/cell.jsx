import React, { Component } from "react";
import { cellStatus } from "../gameLogic";

class GameCell extends Component {
  state = {
    isUncovered: false,
  };

  handleLeftClick = () => {
    this.props.notifyClick(false);
  };

  handleRightClick = (e) => {
    // Evitar el menú contextual del navegador
    e.preventDefault();

    this.props.notifyClick(true);
  };

  render() {
    return this.props.status !== cellStatus.UNCOVERED ? (
      <div onClick={this.handleLeftClick} onContextMenu={this.handleRightClick}>
        <img className="cell" src={`img/box-${this.props.image}.png`} alt=""/>
      </div>
    ) : (
      <div>
        <img className="cell" src={`img/box-${this.props.image}.png`} alt=""/>
      </div>
    );
  }
}

export default GameCell;

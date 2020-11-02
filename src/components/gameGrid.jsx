import React, { Component } from "react";
import {
  getNextStatus,
  uncoverEmptyCells,
  uncoverAllCoveredCells,
  checkVictory,
  cellStatus,
  cellType,
} from "../gameLogic";
import { Button } from "@material-ui/core";
import GameCell from "./cell";
import GameOverDialog from "./gameOverDialog";
import { determineCellImage } from "../imgHelper";

class GameGrid extends Component {
  state = {
    isGameOver: false,
    isVictory: false,
  };

  // Crea la grilla
  renderGameGrid = () => {
    let cellsGrid = [];

    // Se arma la grilla con la matriz de datos
    for (let i = 0; i < this.props.gameMatrix.length; i++) {
      let cellsRow = [];

      for (let j = 0; j < this.props.gameMatrix[i].length; j++) {
        // Se agrega la caja en la fila
        cellsRow.push(
          <GameCell
            // key con gameId para que re-renderice cuando se reinicia el juego
            key={`cell-${this.props.gameMatrix[i][j].id}-game-${this.props.gameId}`}
            image={this.props.gameMatrix[i][j].image}
            status={this.props.gameMatrix[i][j].status}
            notifyClick={(isRightClick) => this.onCellClick(i, j, isRightClick)}
          />
        );
      }

      // Se agrega la fila creada a la matriz
      cellsGrid.push(
        <div key={`row${i}_G${this.props.gameId}`} className="row">
          {cellsRow}
        </div>
      );
    }

    return cellsGrid;
  };

  // Recibe notificación de click en una celda, retorna imagen a mostrar
  onCellClick(row, col, isRightClick) {
    const clickedCell = this.props.gameMatrix[row][col];

    // Si es click izquierdo en una celda que tiene bandera, se ignora
    if (clickedCell.status === cellStatus.COVERED_FLAG && !isRightClick) return;

    // Calcula el nuevo estado...
    const newStatus = getNextStatus(clickedCell.status, isRightClick);

    // ... y lo aplica en una copia de la matriz
    let updatedGameMatrix = [...this.props.gameMatrix];
    updatedGameMatrix[row][col].status = newStatus;

    // Determina la imagen para el nuevo estado
    updatedGameMatrix[row][col].image = determineCellImage(
      updatedGameMatrix[row][col],
      true
    );

    // Si se descubrió una celda vacía y sin minas cerca, se descubren las vacías aledañas
    if (
      newStatus === cellStatus.UNCOVERED &&
      clickedCell.type === cellType.EMPTY &&
      clickedCell.nearMines === 0
    ) {
      updatedGameMatrix = uncoverEmptyCells(updatedGameMatrix, row, col);
    }

    // Una vez actualizada, se controla si hay derrota o victoria

    // Si quedó al descubierto y era una mina, perdió
    // Si no, se chequean condiciones de victoria
    if (
      newStatus === cellStatus.UNCOVERED &&
      clickedCell.type === cellType.MINE
    ) {
      // Se descubren las celdas y se muestra el modal de derrota
      updatedGameMatrix = uncoverAllCoveredCells(updatedGameMatrix);

      this.setState({
        gameMatrix: updatedGameMatrix,
        isGameOver: true,
        isVictory: false,
      });
    } else if (checkVictory(updatedGameMatrix)) {
      // TODO: si todas las celdas que quedan sin descubrir son minas, se
      // debería dar por ganado igual y marcarlas automáticamente con banderas
      this.setState({
        isGameOver: true,
        isVictory: true,
      });
    } else {
      // Si no hay derrota ni victoria, solo actualiza la matriz de juego con los cambios
      this.setState({
        gameMatrix: updatedGameMatrix,
      });
    }
  }

  // Retorna al menú principal
  backToMenu = () => {
    this.setState({
      isGameOver: false,
    });

    this.props.backToMenu();
  };

  // Reinicia con la misma configuración
  restartGame = () => {
    this.setState({
      isGameOver: false,
    });

    this.props.restartGame();
  };

  renderGameOverModal = () => {
    if (this.state.isGameOver) {
      return (
        <GameOverDialog
          isVictory={this.state.isVictory}
          restartGame={this.restartGame}
          backToMenu={this.backToMenu}
        />
      );
    }
  };

  handleSaveGameClick = () => {
    this.props.saveGameAndReturnToMenu();
  };

  render() {
    return (
      <React.Fragment>
        {this.renderGameGrid()}
        {this.renderGameOverModal()}
        <Button
          onClick={this.handleSaveGameClick}
          className="btn-separated"
          variant="contained"
          color="primary"
        >
          Guardar juego y volver al menú
        </Button>
      </React.Fragment>
    );
  }
}

export default GameGrid;

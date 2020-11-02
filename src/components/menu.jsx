import React, { Component } from "react";
import { createGameMatrix } from "../gameLogic";
import GameGrid from "./gameGrid";
import { Grid, TextField, Button, Typography } from "@material-ui/core";

class Menu extends Component {
  state = {
    gameId: 0,
    rows: 14,
    cols: 10,
    totalMines: 36,
    mineProbability: 0,
    gameMatrix: [],
    gameOver: false,
    showMenu: true,
  };

  // Calcula y muestra la probabilidad de minas una vez montado el componente
  componentDidMount() {
    this.setState({
      mineProbability: this.calcMineProbability(
        this.state.totalMines,
        this.state.rows,
        this.state.cols
      ),
    });
  }

  // Función para calcular la probabilidad de mina por celda
  calcMineProbability = (mines, rows, cols) => {
    const result = ((mines / (rows * cols)) * 100).toFixed(2);

    return result > 100 ? 100 : result;
  };

  // Creación de un nuevo juego e inicio
  startGame = () => {
    const newGameMatrix = createGameMatrix(
      parseInt(this.state.rows),
      parseInt(this.state.cols),
      parseInt(this.state.totalMines)
    );

    this.setState({
      gameId: this.state.gameId + 1,
      gameMatrix: newGameMatrix,
      showMenu: false,
    });
  };

  handleStartClick = () => {
    localStorage.setItem("savedGame", "");
    this.startGame();
  };

  handleColsChange = (e) => {
    this.setState({
      cols: e.target.value,
      mineProbability: this.calcMineProbability(
        this.state.totalMines,
        this.state.rows,
        e.target.value
      ),
    });
  };

  handleRowsChange = (e) => {
    this.setState({
      rows: e.target.value,
      mineProbability: this.calcMineProbability(
        this.state.totalMines,
        e.target.value,
        this.state.cols
      ),
    });
  };

  handleMinesChange = (e) => {
    this.setState({
      totalMines: e.target.value,
      mineProbability: this.calcMineProbability(
        e.target.value,
        this.state.rows,
        this.state.cols
      ),
    });
  };

  restartGame = () => {
    this.startGame();
  };

  showMenu = () => {
    this.setState({
      showMenu: true,
    });
  };

  // Continuar juego guardado
  handleContinueClick = () => {
    const savedGameMatrix = JSON.parse(localStorage.getItem("savedGame"));

    console.log(savedGameMatrix);

    this.setState({
      gameId: this.state.gameId + 1,
      gameMatrix: savedGameMatrix,
      showMenu: false,
    });
  };

  // Botón de Continuar juego si hay un juego guardado
  renderContinueButton = () => {
    if (localStorage.getItem("savedGame")) {
      return (
        <Button
          onClick={this.handleContinueClick}
          color="primary"
          className="btn-separated"
        >
          Continuar juego guardado
        </Button>
      );
    }
  };

  // Guarda el juego actual y muestra el menú
  saveGameAndShowMenu = () => {
    localStorage.setItem("savedGame", JSON.stringify(this.state.gameMatrix));
    this.showMenu();
  };

  render() {
    return this.state.showMenu ? (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
        >
          <TextField
            className="menu-input"
            id="field-cols"
            label="Columnas"
            variant="outlined"
            type="number"
            defaultValue={this.state.cols}
            onChange={this.handleColsChange}
          />
          <TextField
            className="menu-input"
            id="field-rows"
            label="Filas"
            variant="outlined"
            type="number"
            defaultValue={this.state.rows}
            onChange={this.handleRowsChange}
          />
          <TextField
            className="menu-input"
            id="field-mines"
            label="Cantidad de minas"
            variant="outlined"
            type="number"
            defaultValue={this.state.totalMines}
            onChange={this.handleMinesChange}
          />
          <Typography variant="overline">
            Probabilidad de mina: {this.state.mineProbability}%
          </Typography>
          <Button
            onClick={this.handleStartClick}
            variant="contained"
            color="primary"
          >
            Jugar
          </Button>
          {this.renderContinueButton()}
        </Grid>
    ) : (
      <GameGrid
        key={`game${this.state.gameId}`}
        gameId={this.state.gameId}
        gameMatrix={this.state.gameMatrix}
        restartGame={this.restartGame}
        backToMenu={this.showMenu}
        saveGameAndReturnToMenu={this.saveGameAndShowMenu}
      />
    );
  }
}

export default Menu;

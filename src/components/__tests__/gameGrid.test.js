import React from "react";
import ReactDOM from "react-dom";
import GameGrid from "../gameGrid";
import { createGameMatrix, cellType, cellStatus } from "../../gameLogic";

it("crea matriz de juego mínima (1x1 sin minas)", () => {
  // Se crea el juego
  const gameMatrix = createGameMatrix(1, 1, 0);

  // Se espera que tenga una fila
  expect(gameMatrix).toHaveLength(1);
  // Se espera que tenga una columna
  expect(gameMatrix[0]).toHaveLength(1);
  // Se espera que la única celda esté vacía y con estado cubierto
  expect(gameMatrix[0][0].type).toBe(cellType.EMPTY);
  expect(gameMatrix[0][0].status).toBe(cellStatus.COVERED_CLEAR);
});

it("crea matriz de juego grande (30x30 con 40 minas)", () => {
  // Se crea el juego
  const gameMatrix = createGameMatrix(30, 30, 40);

  // Se espera que tenga 30 filas
  expect(gameMatrix).toHaveLength(30);
  // Se espera que tenga 30 columnas
  expect(gameMatrix[0]).toHaveLength(30);

  // Se espera que el conteo total de minas sea 40
  let countedMines = 0;
  gameMatrix.forEach((row) =>
    row.forEach((cell) => {
      if (cell.type === cellType.MINE) countedMines++;
    })
  );

  expect(countedMines).toBe(40);

});


it("crea matriz de juego aleatoria", () => {

  const random1 = Math.round(Math.random() * 100);
  const random2 = Math.round(Math.random() * 100);

  // Minas random dentro del total de celdas
  const mines = Math.round(Math.random() * random1 * random2);

  // Se crea el juego
  const gameMatrix = createGameMatrix(random1, random2, mines);

  // Se espera que tenga random1 filas
  expect(gameMatrix).toHaveLength(random1);
  // Se espera que tenga random2 columnas
  expect(gameMatrix[0]).toHaveLength(random2);

  // Se espera que el conteo total de minas sea el "mines" random
  let countedMines = 0;
  gameMatrix.forEach((row) =>
    row.forEach((cell) => {
      if (cell.type === cellType.MINE) countedMines++;
    })
  );

  expect(countedMines).toBe(mines);

});




it("renderiza ok", () => {
  const random = Math.round(Math.random() * 10);
  const mines = Math.round(Math.random() * random);

  const randomMinesMatrix = createGameMatrix(random, random, mines);

  const testDiv = document.createElement("div");
  ReactDOM.render(
    <GameGrid gameId={1} gameMatrix={randomMinesMatrix} />,
    testDiv
  );
});

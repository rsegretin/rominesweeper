import { imageName, determineCellImage } from "./imgHelper";

export const cellStatus = {
  COVERED_CLEAR: "CC",
  COVERED_FLAG: "CF",
  COVERED_QUESTION: "CQ",
  UNCOVERED: "UC",
};

export const cellType = {
  EMPTY: "E",
  MINE: "M",
};

export const createGameMatrix = (totalRows, totalCols, totalMines) => {
  /*
  La matriz del juego contiene objetos con la forma
    {
      type: EMPTY | MINE,
      nearMines: Int (cantidad de minas alrededor),
      status: COVERED_CLEAR | COVERED_FLAG | COVERED_QUESTION | UNCOVERED,
      image: COVERED_CLEAR_IMG | COVERED_FLAG_IMG  | COVERED_QUESTION_IMG |
             UNCOVERED_EMPTY_IMG_ROOT | UNCOVERED_MINE_IMG | UNCOVERED_BLAMED_MINE_IMG
    }
  */

  // Matriz con la información del juego
  let matrix = [];

  // Contador para ir viendo si ya están puestas todas la minas
  let mineCount = 0;

  // Total de cajas
  const totalCells = totalRows * totalCols;

  // Probabilidad de que haya una mina en cada celda
  const mineProbability = totalMines / totalCells;

  console.log(
    `Creating Game - mine probability: ${mineProbability} - total cells: ${totalCells}`
  );

  // Se arma la matriz con dos loops
  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    // Fila nueva...
    let row = [];
    for (let colIndex = 0; colIndex < totalCols; colIndex++) {
      let type = cellType.EMPTY;

      // Si faltan minas por colocar, se determina aleatoriamente si corresponde
      if (mineCount < totalMines) {
        // Si la cantidad de minas que faltan por ubicar coincide con la
        // cantidad de cajas que falta crear, todas serán minas
        const createdCells = rowIndex * totalCols + colIndex + 1;

        if (totalCells - createdCells <= mineCount) {
          type = cellType.MINE;
        } else {
          // Si no (si hay margen) se decide por random
          if (Math.random() < mineProbability) {
            type = cellType.MINE;
          }
        }
      }

      // Se agrega la caja en la fila, inicialmetne con el conteo de minas adyacentes en cero
      let newCell = {
        type,
        nearMines: 0,
      };

      // Si es una mina, se incrementan los contadores de las celdas adyacentes
      if (type === cellType.MINE) {
        // De paso, se incrementa el conteo de minas
        mineCount++;

        // Celda a la izquierda si existe y no es una mina
        if (colIndex > 0)
          if (row[colIndex - 1].type !== cellType.MINE)
            row[colIndex - 1].nearMines++;

        // Celdas de la fila anterior si existe
        if (rowIndex > 0) {
          // Celda superior izquierda si existe
          if (colIndex > 0)
            if (matrix[rowIndex - 1][colIndex - 1].type !== cellType.MINE)
              matrix[rowIndex - 1][colIndex - 1].nearMines++;

          // Celda superior media
          if (matrix[rowIndex - 1][colIndex].type !== cellType.MINE)
            matrix[rowIndex - 1][colIndex].nearMines++;

          // Celda superior derecha si existe
          if (colIndex < totalCols - 1)
            if (matrix[rowIndex - 1][colIndex + 1].type !== cellType.MINE)
              matrix[rowIndex - 1][colIndex + 1].nearMines++;
        }
      } else {
        // Si no es una mina, se contabilizan minas adyacentes

        // Celda a la izquierda si existe
        if (colIndex > 0) {
          if (row[colIndex - 1].type === cellType.MINE) newCell.nearMines++;
        }

        // Celdas de la fila anterior si existe
        if (rowIndex > 0) {
          // Celda superior izquierda si existe
          if (colIndex > 0) {
            if (matrix[rowIndex - 1][colIndex - 1].type === cellType.MINE)
              newCell.nearMines++;
          }
          // Celda superior media
          if (matrix[rowIndex - 1][colIndex].type === cellType.MINE)
            newCell.nearMines++;
          // Celda superior derecha si existe
          if (colIndex < totalCols - 1) {
            if (matrix[rowIndex - 1][colIndex + 1].type === cellType.MINE)
              newCell.nearMines++;
          }
        }
      }

      newCell.status = cellStatus.COVERED_CLEAR;
      newCell.image = imageName.COVERED_CLEAR_IMG;

      row.push(newCell);
    }

    // Se agrega la fila creada a la matriz
    matrix.push(row);
  }

  /*
  // Console.table para hacer trampa :)
  console.table(
    matrix.map((row) =>
      row.map((cell) => (cell.type === cellType.MINE ? 0 : ""))
    )
  );
  */

  return matrix;
};

/**
 * Obtiene el próximo estado de una celda al recibir un click
 *
 * @param {string} currentStatus status actual (valores de cellStatus)
 * @param {boolean} isRightClick true si es click derecho, falso si es izquierdo
 */
export const getNextStatus = (currentStatus, isRightClick) => {
  // Si la celda ya fue descubierta, no se modifica
  if (currentStatus === cellStatus.UNCOVERED) return cellStatus.UNCOVERED;

  if (isRightClick) {
    // Si es click derecho, va ciclando en las distintas marcas
    if (currentStatus === cellStatus.COVERED_CLEAR)
      return cellStatus.COVERED_FLAG;
    if (currentStatus === cellStatus.COVERED_FLAG)
      return cellStatus.COVERED_QUESTION;
    if (currentStatus === cellStatus.COVERED_QUESTION)
      return cellStatus.COVERED_CLEAR;
  } else {
    // Si es click izquierdo, descubre la celda
    return cellStatus.UNCOVERED;
  }
};

/**
 * Determina si ya es una victoria
 *
 * @param {Array} gameMatrix Matriz con la información del juego en el momento
 */
export const checkVictory = (gameMatrix) => {
  for (let row = 0; row < gameMatrix.length; row++) {
    for (let col = 0; col < gameMatrix[row].length; col++) {
      const cell = gameMatrix[row][col];

      // Para que haya victoria, cada celda tiene que estar descubierta o,
      // si está cubierta, estar marcada con una bandera y ser efectivamente una mina

      if (
        cell.status !== cellStatus.UNCOVERED &&
        (cell.status !== cellStatus.COVERED_FLAG || cell.type !== cellType.MINE)
      ) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Cambia a descubierto el estado de todas las celdas de una zona vacía a partir de las
 * coordenadas de una celda vacía descubierta
 *
 * @param {Array} gameMatrix Matriz de juego en estado actual
 * @param {number} row Fila de la celda vacía descubierta
 * @param {number} col Columna de la celda vacía descubierta
 */
export const uncoverEmptyCells = (gameMatrix, row, col) => {
  // Se verifican las celdas adyacentes (si existen) y para cada una
  // se vuelve a ejecutar recursivamente la función si también está
  // vacía. Se actualiza la imagen que corresponde a cada celda

  const lastRow = gameMatrix.length - 1;
  const lastCol = gameMatrix[0].length - 1;

  // Celda superior izquierda
  if (row > 0 && col > 0) {
    if (
      gameMatrix[row - 1][col - 1].type === cellType.EMPTY &&
      gameMatrix[row - 1][col - 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row - 1][col - 1].status = cellStatus.UNCOVERED;
      gameMatrix[row - 1][col - 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT +
        gameMatrix[row - 1][col - 1].nearMines;
      if (gameMatrix[row - 1][col - 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row - 1, col - 1);
      }
    }
  }

  // Celda superior media
  if (row > 0) {
    if (
      gameMatrix[row - 1][col].type === cellType.EMPTY &&
      gameMatrix[row - 1][col].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row - 1][col].status = cellStatus.UNCOVERED;
      gameMatrix[row - 1][col].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT + gameMatrix[row - 1][col].nearMines;
      if (gameMatrix[row - 1][col].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row - 1, col);
      }
    }
  }

  // Celda superior derecha
  if (row > 0 && col < lastCol) {
    if (
      gameMatrix[row - 1][col + 1].type === cellType.EMPTY &&
      gameMatrix[row - 1][col + 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row - 1][col + 1].status = cellStatus.UNCOVERED;
      gameMatrix[row - 1][col + 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT +
        gameMatrix[row - 1][col + 1].nearMines;
      if (gameMatrix[row - 1][col + 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row - 1, col + 1);
      }
    }
  }

  // Celda izquierda
  if (col > 0) {
    if (
      gameMatrix[row][col - 1].type === cellType.EMPTY &&
      gameMatrix[row][col - 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row][col - 1].status = cellStatus.UNCOVERED;
      gameMatrix[row][col - 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT + gameMatrix[row][col - 1].nearMines;
      if (gameMatrix[row][col - 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row, col - 1);
      }
    }
  }

  // Celda derecha
  if (col < lastCol) {
    if (
      gameMatrix[row][col + 1].type === cellType.EMPTY &&
      gameMatrix[row][col + 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row][col + 1].status = cellStatus.UNCOVERED;
      gameMatrix[row][col + 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT + gameMatrix[row][col + 1].nearMines;
      if (gameMatrix[row][col + 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row, col + 1);
      }
    }
  }

  // Celda inferior izquierda
  if (row < lastRow && col > 0) {
    if (
      gameMatrix[row + 1][col - 1].type === cellType.EMPTY &&
      gameMatrix[row + 1][col - 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row + 1][col - 1].status = cellStatus.UNCOVERED;
      gameMatrix[row + 1][col - 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT +
        gameMatrix[row + 1][col - 1].nearMines;
      if (gameMatrix[row + 1][col - 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row + 1, col - 1);
      }
    }
  }

  // Celda inferior media
  if (row < lastRow) {
    if (
      gameMatrix[row + 1][col].type === cellType.EMPTY &&
      gameMatrix[row + 1][col].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row + 1][col].status = cellStatus.UNCOVERED;
      gameMatrix[row + 1][col].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT + gameMatrix[row + 1][col].nearMines;
      if (gameMatrix[row + 1][col].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row + 1, col);
      }
    }
  }

  // Celda inferior derecha
  if (row < lastRow && col < lastCol) {
    if (
      gameMatrix[row + 1][col + 1].type === cellType.EMPTY &&
      gameMatrix[row + 1][col + 1].status !== cellStatus.UNCOVERED
    ) {
      gameMatrix[row + 1][col + 1].status = cellStatus.UNCOVERED;
      gameMatrix[row + 1][col + 1].image =
        imageName.UNCOVERED_EMPTY_IMG_ROOT +
        gameMatrix[row + 1][col + 1].nearMines;
      if (gameMatrix[row + 1][col + 1].nearMines === 0) {
        gameMatrix = uncoverEmptyCells(gameMatrix, row + 1, col + 1);
      }
    }
  }

  return gameMatrix;
};


/**
 * Revela todas las celdas que no hubieran sido reveladas ya
 * 
 * @param {Array} gameMatrix 
 */
export const uncoverAllCoveredCells = (gameMatrix) => {

  for (let row = 0; row < gameMatrix.length; row++) {
    for (let col = 0; col < gameMatrix[0].length; col++) {

      if (gameMatrix[row][col].status !== cellStatus.UNCOVERED) {
        gameMatrix[row][col].status = cellStatus.UNCOVERED;
        gameMatrix[row][col].image = determineCellImage(gameMatrix[row][col], false);        
      }

    }
    
  }

  return gameMatrix;
}
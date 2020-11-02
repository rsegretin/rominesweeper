import { cellStatus, cellType } from "./gameLogic";

export const imageName = {
  COVERED_CLEAR_IMG: "initial",
  COVERED_FLAG_IMG: "flag",
  COVERED_QUESTION_IMG: "question",
  UNCOVERED_EMPTY_IMG_ROOT: "empty-",
  UNCOVERED_MINE_IMG: "mine",
  UNCOVERED_BLAMED_MINE_IMG: "redmine",
};

/**
 * Determina la imagen que corresponde según estado y tipo de celda
 *
 * @param {object} cell Objeto de la celda con status, type y nearMines
 * @param {boolean} blame Indica si fue la celda culpable de una derrota
 */
export const determineCellImage = (cell, blame) => {
  let image;

  switch (cell.status) {
    case cellStatus.COVERED_CLEAR:
      image = imageName.COVERED_CLEAR_IMG;
      break;
    case cellStatus.COVERED_FLAG:
      image = imageName.COVERED_FLAG_IMG;
      break;
    case cellStatus.COVERED_QUESTION:
      image = imageName.COVERED_QUESTION_IMG;
      break;
    case cellStatus.UNCOVERED:
      if (cell.type === cellType.MINE)
        if (blame) {
          image = imageName.UNCOVERED_BLAMED_MINE_IMG;
        } else {
          image = imageName.UNCOVERED_MINE_IMG;
        }
      else {
        // Si es una celda descubierta sin mina, se compone el nombre de la
        // imagen con la raíz de celda vacía y el número de minas aledañas
        image = imageName.UNCOVERED_EMPTY_IMG_ROOT + cell.nearMines;
      }
      break;
    default:
      console.error(`No se pudo determinar la imagen`);
      console.error(cell, blame);
      image = imageName.COVERED_CLEAR_IMG;
      break;
  }

  return image;
};

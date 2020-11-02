import React, { Component } from "react";
import { Button, Dialog, Grid, Paper, Typography } from "@material-ui/core";
import Draggable from "react-draggable";

function PaperComponent(props) {
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

class GameOverDialog extends Component {
  render() {
    return (
      <Dialog open={true} PaperComponent={PaperComponent}>
        <Grid container direction="column" justify="center" alignItems="center">
          <img
            src={
              this.props.isVictory
                ? `${process.env.PUBLIC_URL}/img/roman-victory.jpg`
                : `${process.env.PUBLIC_URL}/img/roman-defeat.jpg`
            }
            alt=""
          />
          <Button
            id="btn-restart"
            className="btn-end-dialog"
            variant="contained"
            color="primary"
            onClick={this.props.restartGame}
          >
            Reiniciar con la misma configuración
          </Button>
          <Button
            id="btn-backtomenu"
            className="btn-end-dialog"
            variant="contained"
            color="primary"
            onClick={this.props.backToMenu}
          >
            Volver al menú
          </Button>
          <Typography variant="caption" className="footnote">
            (podés mover esta ventana si te tapa)
          </Typography>
        </Grid>
      </Dialog>
    );
  }
}

export default GameOverDialog;

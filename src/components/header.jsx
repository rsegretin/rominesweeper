import React, { Component } from 'react';
import { Grid } from "@material-ui/core";

class Header extends Component {
    render() { 
        return (
            <Grid container>
                <Grid item xs={12}>
                    <img className="logo" src={`${process.env.PUBLIC_URL}/img/logo.jpg`} alt=""/>
                </Grid>
            </Grid>
        );
    }
}
 
export default Header;
import React, { Component } from 'react';
import classes from './Login.module.css';

import loginImg from '../../assets/login.svg';
import { Button, TextField } from '@material-ui/core';
import wave from '../../assets/wave.svg';
class Login extends Component {

    state = {
        userId: '',
        password: ''
    }

    handleSubmitClick = () => {
        this.props.history.push('/');
    }

    render() {

        const { userId, password } = this.state;

        return (
            <div className={classes.login}>
                <img className={classes.wave} src={wave} alt="login"></img>


                <div className={classes.card}>

                    <div className={classes.cardLeft}>
                        <img className={classes.img} src={loginImg} alt="login"></img>
                    </div>

                    <div className={classes.cardRight}>

                        <h1>Aggrawal Provision Store</h1>

                        <form className={classes.form} onSubmit={this.handleSubmitClick}>

                            <TextField
                                className={classes.formInput}
                                variant="outlined"
                                placeholder="User Id"
                                value={userId}
                                onChange={(e) => this.setState({ userId: e.target.value })}
                            />

                            <TextField
                                className={classes.formInput}
                                variant="outlined"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => this.setState({ password: e.target.value })}
                            />
                            <Button type="submit" variant="contained" color="primary" >Submit</Button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }
}

export default Login;
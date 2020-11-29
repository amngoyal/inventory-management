import React, { Component } from 'react';
import classes from './Login.module.css';

import loginImg from '../../assets/login.svg';
import { Button, TextField } from '@material-ui/core';
import wave from '../../assets/wave.svg';
import instance from '../../axios';
import { withRouter } from 'react-router';
class Login extends Component {

    state = {
        userId: 'AGS01',
        password: 'ags@1234',
        loading: false
    }

    handleSubmitClick = async (e) => {

        e.preventDefault();
        console.log("clicked");
        this.setState({ loading: true }, () => {
            const { userId, password } = this.state;
            instance.post('/login', { userId, password })
                .then(res => {
                    console.log(res);

                    this.props.history.push('/home/products');

                    this.setState({ loading: false })
                })
                .catch(err => {
                    this.setState({ loading: false })
                    console.log(err.response);
                    if (err.response) {
                        if (err.response.status === 404) {
                            alert('User not found.')
                        }
                        if (err.response.status === 400) {
                            alert("Enter correct pasword.")
                        }
                    }
                })
        })

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

                        <h1>XYZ PROVISION STORE</h1>

                        <form className={classes.form} onSubmit={this.handleSubmitClick}>

                            <TextField
                                className={classes.formInput}
                                variant="outlined"
                                label="User Id"
                                value={userId}
                                onChange={(e) => this.setState({ userId: e.target.value.toUpperCase() })}
                            />

                            <TextField
                                className={classes.formInput}
                                variant="outlined"
                                label="Password"
                                type="password"
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

export default withRouter(Login);
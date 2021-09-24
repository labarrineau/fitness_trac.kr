import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { callApi } from "../api";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'



const Register = ({ action, setToken }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isLogin = action === 'login';
    const title = isLogin ? 'Login' : 'Register';
    const oppositeAction = isLogin ? 'register' : 'login';
    const oppositeTitle = isLogin ? 'Register' : 'Login';
    const history = useHistory();

    const useStyles = makeStyles( theme => ({
        button : {
            backgroundColor : "#C19A6B",
            color: "black",
        }
    }))
    
    const classes = useStyles();


    const userPassSubmit = async (event) => {
        event.preventDefault();

        const data = await callApi({
            url: `users/${action}`,
            body: { user: { username, password }},
            method: 'POST',
        });


        let token

        try { 
            token = data.data.token
            if (token) {
                localStorage.setItem( 'st-token', token );
                setToken(token);
                history.push('/');
                return token
            } 
        } catch (error) {
            window.alert("Wrong Username or Password!")
        }
    

    };

    return (

        <>
        <h2 id="registerhead">Welcome, Please {title}</h2>

        <form onSubmit={userPassSubmit}>

            <input
                type="text"
                placeholder="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}>
            </input>

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}>
            </input>
                
            <Button variant="contained" 
                className= { classes.button } 
                type="submit" 
                style={{ textDecoration: 'none' , color:'black'}}
                >{title}
            </Button>

        </form>
        <Box mx={1} my={1}>
        <Button variant="contained" 
                className= { classes.button } 
                type="submit" 
                style={{ textDecoration: 'none' , color:'black'}}>
            <Link to={`/${oppositeAction}`}>{oppositeTitle}</Link>
        </Button>
        </Box>
        <Box mx={1} my={1}>
        <Button variant="contained" 
                className= { classes.button } 
                type="submit" 
                style={{ textDecoration: 'none' , color:'black'}}>
            <Link to={'/'}>Home</Link>
        </Button>
        </Box>
        </>
    );
};

export default Register;
import React, { useState, useEffect } from "react";
import { Link, Route, useParams, useHistory } from "react-router-dom";
import { callApi } from '../api';
import { Register } from './';
// import SinglePost from './SinglePost';
// import PostsList from './PostsList';
// import CreateNewPost from './CreateNewPost';
// import EditPost from './EditPost';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'


const useStyles = makeStyles( (theme) => ({
    button : {
        backgroundColor : "#C19A6B",
        color: "black"
    }
}))


const fetchUserData = async (token) => {
    const { data } = await callApi ({
        url: '/users/me',
        token,
    });
    return data;
};

const fetchRoutines = async (token) => {
    const {
        data: { routines },
    } = await callApi({ 
        url: '/routines', 
        token, 
    })

    return routines;
}

// const fetchActivities = async (token) => {
//     const {
//         data: { activities },
//     } = await callApi({ 
//         url: '/activities', 
//         token, 
//     })

//     return activities;
// }

const App = () => {

    const classes = useStyles();

    const [token, setToken] = useState('');
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);

    const isLoggedIn = userData.username !== undefined;


    const onLogOutClick = () => {
        localStorage.removeItem('st-token');
        setToken(""),
        setUserData({});
    };


    useEffect(async () => {
        if (routines.length === 0) {
            const fetchedRoutines = await fetchRoutines(token);
            setPosts(fetchedRoutines);
        }
    });

    useEffect(async () => {
        if (!token) {
            setToken(localStorage.getItem('st-token'));
            return;
        }
        const data = await fetchUserData(token);
        setUserData(data);
    }, [token]);

 
    return(
        <>
    <div id="pageContainer">

            <Route exact path='/'>

                {isLoggedIn ? (
                    
                    <div id="topmenu">
                        <Box mx={1}>
                            <Button id="viewallroutinesbutton"  variant="contained" className= { classes.button } > 
                                    <Link to='/routine' style={{ textDecoration: 'none' , color:'black'}}>
                                        View All Routines
                                    </Link>
                            </Button>
                        </Box>
                        <Box mx={1}>
                            <Button id="createnewroutinesbutton" variant="contained" className= { classes.button }> 
                                    <Link to='/createNewRoutine' style={{ textDecoration: 'none' , color:'black'}}>
                                        Create New Routine
                                    </Link>
                            </Button>
                        </Box>
                        <div id="greeting">
                            <Box mx={1}>
                               <p style={{margin:"10px"}}> <b >Hello, {userData.username}</b> </p>
                                <Button variant="contained" className= { classes.button } onClick = {onLogOutClick} style={{ textDecoration: 'none' , color:'black'}}>
                                    Log Out
                                </Button>
                            </Box>
                        </div>
 
                    </div>
               
                ) : (
                    
                    <>
                        <div id="loginRegister">
                        <Button variant="contained" className= { classes.button }>
                            <Link to='/register'>Register</Link>
                        </Button>

                        <Button variant="contained" className= { classes.button }>
                            <Link to='/login'>Login</Link>
                        </Button>
                        </div>
                    </>
                )}

        <h1 id="forum">Stranger's Things Forum</h1>

            {isLoggedIn ? (
                    <>
                        <h2>{userData.username}'s Profile Home</h2>
                        <h3>My Routines</h3>
                        <div id="routines">
                            {userData.posts.map((post) => (

                                post.active 
                                ?
                                
                                    <div key={post._id} >
                                        <SinglePost posts={posts} post={post} token={token} isMe={true} />
                                    </div>
                                    
                                :
                                null
                            ))}                           
                        </div>
                        
                    </>

            ) : (
                
                <>
                <h3>Current Routines</h3>
                    <div id="routines">
                                {routines.map((routine) => (
                                    <div key={routine._id} >
                                        <SingleRoutine routines={routines} routine={routine} token={token} />
                                    </div>))}
                            </div>
            </>
                )}
            </Route>

            <Route exact path="/routines">
                <RoutineList routines={routines} token={token} onLogOutClick={onLogOutClick} />
            </Route>

            <Route exact path="/posts/:postId">
                <SingleRoutine routines={routines} token={token} />
            </Route>

            <Route exact path="/editpost/:postId">
                <EditRoutine routines={routines} token={token} />
            </Route>

            <Route exact path="/createNewPost">
                <CreateNewRoutine token = {token} />
            </Route>
 
            <Route path ='/register'>
                <Register action='register' setToken={setToken} />
            </Route>

            <Route path ='/login'>
                <Register action='login' setToken={setToken} />
            </Route>
        </div>
        </>
    );
};

export default App;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SingleRoutine from './SingleRoutine';
import {  makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ViewPost from './XViewPost';

const useStyles = makeStyles( theme => ({
    button : {
        backgroundColor : "#C19A6B",
        color: "black"
    }
}))

const Search = (post, searchTerm) => {

    const searchTermLowerCase = searchTerm.toLowerCase();

    const {
        description,
        location,
        title,
        author: { username },
        price,
    } = post;

    const toMatch = [description, location, title, username, price];
    for (const field of toMatch) {
        if (field.toLowerCase().includes(searchTermLowerCase)) {
            return true;
        }
    }

    return false;
   
};



const RoutineList = ({ posts, token }) => {

    const classes = useStyles();

    const [searchTerm, updateSearchQuery] = useState('');
    
    const filteredPosts = posts.filter(post => Search(post, searchTerm));
    const postsToDisplay = searchTerm.length ? filteredPosts : posts;
   
    return (
        <>
        <Button id="home" variant="contained" className= { classes.button }>
            <Link to={'/'} style={{ textDecoration: 'none' , color:'black'}}>Home</Link>
        </Button><br></br>

        <h2 id="search">Search Posts</h2>

        <input id="searchbar"
                    type="text"
                    placeholder="Search for posts"
                    value={searchTerm}
                    onChange={(event) => {
                        updateSearchQuery(event.target.value);
                    }} />

        <h2 id="poststitle">Posts</h2>
        <div id="posts">
        {postsToDisplay.map((post) => (
            <div key={post._id}>
                <SingleRoutine posts={posts} post={post} token={token} />
                <ViewRoutine posts={posts} post={post}/>
            </div>
        ))}
        </div>
        </>
    );
};

export default RoutineList;
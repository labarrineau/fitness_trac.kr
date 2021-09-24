import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SingleActivity from './SingleActivity';
import {  makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ViewActivity from './ViewActivity';

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



const PostsList = ({ posts, token }) => {

    const classes = useStyles();

    const [searchTerm, updateSearchQuery] = useState('');
    
    const filteredActivities = activities.filter(activity => Search(activity, searchTerm));
    const activityToDisplay = searchTerm.length ? filteredActivities : posts;
   
    return (
        <>
        <Button id="home" variant="contained" className= { classes.button }>
            <Link to={'/'} style={{ textDecoration: 'none' , color:'black'}}>Home</Link>
        </Button><br></br>

        <h2 id="search">Search Activities</h2>

        <input id="searchbar"
                    type="text"
                    placeholder="Search for posts"
                    value={searchTerm}
                    onChange={(event) => {
                        updateSearchQuery(event.target.value);
                    }} />

        <h2>Activities</h2>
        <div id="activity">
        {activityToDisplay.map((post) => (
            <div key={post._id}>
                <SingleActivity posts={posts} post={post} token={token} />
                <ViewActivity posts={posts} post={post}/>
            </div>
        ))}
        </div>
        </>
    );
};

export default ActivityList;
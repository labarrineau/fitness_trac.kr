import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { callApi } from "../api";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const CreateNewPost = ({token}) => {
  

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [willDeliver, setWillDeliver] = useState(false);

    const history=useHistory();

    const useStyles = makeStyles( theme => ({
        button : {
            backgroundColor : "#C19A6B",
            color: "black"
        }
    }))

    const classes = useStyles();

    const postSubmit = async (event) => {
        event.preventDefault();

        const data = await callApi({
            url: `/posts`,
            method: 'POST',
            token:  token ,
              body: {    
                  post: {
                    title: title,
                    description: description,
                    price: price,
                    location: location ? location : '[On Request]',
                    willDeliver: willDeliver,
              }} 
        });
        
        history.push('/posts');
        window.location.reload()
      };


    return (

        <>
        <Button id="home" variant="contained" className= { classes.button }>
            <Link to={'/'} style={{ textDecoration: 'none' , color:'black'}}>Home</Link>
        </Button>
        <h2 id="createAPost">Please Enter New Post Information Below</h2>

            <form onSubmit={postSubmit}>

                <input
                    type="text"
                    placeholder="Title"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}>
                </input>
                <br></br>
                <input className ="description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}>
                </input>
            <br></br>
                <input
                    type="text"
                    placeholder="Price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}>
                </input>
            <br></br>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}>
                </input>
            <br></br>
                <p>Check "Yes" if you will Deliver your item.</p>
                <input
                    type="checkbox"
                    id="willDeliver"
                    value={willDeliver}
                    onChange={(event) => setWillDeliver(event.target.checked)}>
                </input>
              <label htmlFor="willDeliver">Yes, I will deliver.</label><br></br>
                    
                <Button variant="contained" 
                        className= { classes.button } 
                        type="submit" 
                        style={{ textDecoration: 'none' , color:'black'}}>
                    Create Post
                </Button>

            </form>
        </>
    );
};

export default CreateNewPost;


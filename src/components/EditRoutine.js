import React, { useState } from "react";
import { Link, useParams, useHistory } from 'react-router-dom';
import { callApi } from "../api";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';


const EditPost = ({posts, token}) => {

    const { postId } = useParams();
  
    if (posts.length === 0) return null;

    let postToRender = posts.find((post) => postId === post._id);

    const [title, setTitle] = useState(postToRender.title);
    const [description, setDescription] = useState(postToRender.description);
    const [price, setPrice] = useState(postToRender.price);
    const [location, setLocation] = useState(postToRender.location);
    const [willDeliver, setWillDeliver] = useState(postToRender.willDeliver);

    const history=useHistory();

    const useStyles = makeStyles( (theme) => ({
        button : {
            backgroundColor : "#C19A6B",
            color: "black",
        }
    }))
    
    const classes = useStyles();

    const editSubmit = async (event) => {
        event.preventDefault();

        const data = await callApi({
            url: `/posts/${postToRender._id}`,
            method: 'PATCH',
            token:  token ,
              body: {    
                  post: {
                    title: title,
                    description: description,
                    price: price,
                    location: location,
                    willDeliver: willDeliver,
              }} 
        });
        
        history.push('/posts');
        window.location.reload()
      };


    return (

        <>
        <Box mx={1} my={1}>
            <Button id="home"
                    variant="contained" 
                    className= { classes.button } 
                    type="submit" 
                    style={{ textDecoration: 'none' , color:'black'}}>
                <Link to={'/'}>Home</Link>
            </Button>
        </Box>

        <h2 id="createAPost">Please Edit The Post Information Below</h2>

            <form onSubmit={editSubmit}>

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
                <p><b>Check "Yes" if you will Deliver your item.</b></p>
                <input
                    type="checkbox"
                    id="willDeliver"
                    value={willDeliver}
                    onChange={(event) => setWillDeliver(event.target.checked)}>
                </input>
              <label for="willDeliver"><b>Yes, I will deliver.</b></label><br></br>
                    
                <Box mx={1} my={1}>     
                    <Button variant="contained" 
                            className= { classes.button } 
                            type="submit" 
                            style={{ textDecoration: 'none' , color:'black'}}>
                        Edit Complete
                    </Button>
                </Box>


            </form>
        </>
    );
};

export default EditPost;


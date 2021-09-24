  
import React from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { callApi } from "../api";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'


const SingleActivity = ({ posts, post,  token, isMe}) => {


    const useStyles = makeStyles( theme => ({
        button : {
            backgroundColor : "#C19A6B",
            color: "black"
        }
    }))

    const classes = useStyles();

    const { postId } = useParams();
    const history=useHistory();

    if (posts.length === 0) return null;

    let postToRender;

    if (post) {
        postToRender = post;
    } else {
        postToRender = posts.find((post) => postId === post._id);
    }


const postDelete = async (event) => {
    event.preventDefault();

    const data = await callApi({
        url: `/posts/${postToRender._id}`,
        method: 'DELETE',
        token:  token ,

    });
    
    history.push('/posts');
    window.location.reload()

  };

   return (

        <div className="junkwrap">
        <div className="post">
            <h2>{postToRender.title}</h2>
            {postToRender.author.username
            ?
            <div><b>Submitted by:</b> {postToRender.author.username}</div>
            :
            null}
            <div><b style={{ fontSize:"25px"}}>Date Posted:</b> {`${new Date(postToRender.createdAt)}`}</div>
            <div><b>Description:</b> {postToRender.description}</div>
            <div><b>Price:</b> {postToRender.price}</div>
            <div><b>Location:</b> {postToRender.location}</div>
            <div><b>Delivers:</b> {postToRender.willDeliver ? 'Yes' : 'No'}</div>

            {posts.filter(()=>{
                        posts.messages}) 
                        ?
                        <MessagesToMe posts={posts} post={post} token={token} />
                        :
                        null
            }
           
        </div>



        {postToRender.isAuthor || isMe
        
        ? 
        <div>
            <Box mx={1} my={1}>
                <Button id="delete"  
                        variant="contained" 
                        className= { classes.button } 
                        style={{ textDecoration: 'none' , color:'black'}} 
                        onClick={postDelete}>
                    Delete Post
                </Button>
            </Box>
            <Box mx={1} my={1}>
                <Button id="edit" 
                        variant="contained" 
                        className= { classes.button }>
                    <Link to={`/editpost/${ postToRender._id }`} style={{ textDecoration: 'none' , color:'black'}}>
                        Edit Post
                    </Link>
                </Button>
            </Box>
        </div>

        : 
        <>
            <p style ={{color: "yellow" , 
                        background:"black", 
                        borderRadius: "5px",
                        border:"black"}}>
                            <b>Interested? Message to This Post.</b>
            </p>
            <WriteAMessage postId={postToRender._id} token={token} />
        </>
        }
        
        {!post 
            ? 
            <Button id="delete" variant="contained" className= { classes.button } >
               <Link to="/posts" style={{ textDecoration: 'none' , color:'black'}}>
                   Back to all posts
                </Link>
            </Button> 
            : 
            null
            }

        </div> 

             
    );
};

export default SingleActivity;
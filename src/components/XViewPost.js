
import React from 'react';
import { Link, useParams} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'


const ViewPost = ({ posts, post}) => {


    const useStyles = makeStyles( (theme) => ({
        button : {
            backgroundColor : "#C19A6B",
            color: "black"
        }
    }))

    const classes = useStyles();

    const { postId } = useParams();
 
    if (posts.length === 0) return null;

    let postToRender;

    if (post) {
        postToRender = post;
    } else {
        postToRender = posts.find((post) => postId === post._id);
    }

   

return(
       
            <Box mx={1} my={1}>
                <Button  variant="contained" className= { classes.button }>
                    <Link to={`/posts/${ postToRender._id }`} style={{ textDecoration: 'none' , color:'black'}}>
                        View Post
                    </Link>
                </Button>
            </Box>
                 
);
};

export default ViewPost;
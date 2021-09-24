//USER ROUTERS

const express = require ('express');
const usersRouter = express.Router();
const { requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const { getPublicRoutinesByUser,
        getUserByUsername, 
        createUser, 
        getUserById,
        getUser } = require('../db');



//REGISTER USER
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      if (password.length < 8) {
            next({
                name: 'PasswordLength<8CharError',
                message: 'Your password needs to be longer than 8 Characters'
            });
            return;
      }
      if (await getUserByUsername(username)){
        next({
          name: 'UsernameAlreadyInUse',
          message: 'That username is already in use'
          });
        return;
      };
        const user = await createUser(req.body);
        const token = jwt.sign({ 
                                id: user.id, 
                                username: user.username}, 
                                process.env.JWT_SECRET, {
                                expiresIn: '1w'});
        res.send({ 
          message: "thank you for signing up",
          user,
          token 
        });
        } catch ({ name, message }) {
            next({ name, message });
      } 
  });


  //LOGIN USER
usersRouter.post('/login', async (req, res, next) => {
    try {
        const user = await getUser(req.body);
        if (user.username) {
            const token = jwt.sign({id: user.id, 
                                    username: user.username},
                                    process.env.JWT_SECRET,{
                                    expiresIn: '1w'
                                    });
            res.send({ message: "you're logged in!", user, token });
        } else {
            next({ 
              name: 'IncorrectCredentialsError', 
              message: 'Username or password is incorrect'
            });
        }
    } catch({ name, message }) {
        next({ name, message });
    }
});


//GET /ME  
usersRouter.get('/me', requireUser, async ( req, res, next ) => {
    try{
        const user = await getUserById(req.user.id);
        res.send( user );
    } catch ({ name, message}){
        next({ name, message});
    }

});

//GET /:USERNAME/ROUTINES
usersRouter.get('/:username/routines',  async ( req, res, next ) => {
  try{
    const routines = await getPublicRoutinesByUser( req.params );
    res.send(routines);
} catch ( { name,message}){
    next({ name,message});
}
});


module.exports= usersRouter;
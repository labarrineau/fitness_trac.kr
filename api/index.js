//API INDEX

require('dotenv').config();
const express = require('express');
const apiRouter = express.Router();


const usersRouter = require('./users');
const routinesRouter = require('./routines');
const activitiesRouter = require('./activities');
const routine_activitiesRouter = require('./routine_activities');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) { 
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
       
        if (id) {
          req.user = {id};
          next();
        }
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });
  
///GET /HEALTH
apiRouter.get('/health',  async ( req, res, next ) => {
    try{
        res.send(
          {message: "Server is healthy"}
          );

     } catch(error){
          next(error)};
});

 
apiRouter.use('/users', usersRouter);
apiRouter.use('/routines', routinesRouter); 
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routine_activities', routine_activitiesRouter);

 
module.exports =  apiRouter ;
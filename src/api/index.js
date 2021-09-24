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






//Strangers Things CALLAPI section

export const API_URL = 'https://fitnesstrac-kr.herokuapp.com/api'

export const callApi = async ({ url, method, token, body}) => {
  console.log ('callApi:', { url, method, token, body})

  try {
      const options = {
                      method: method ? method.toUpperCase() : 'GET',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(body),
                      };
       

      console.log("api index token :", token)

      if (token){
          options.headers['Authorization'] = `Bearer ${token}`;
      }

      console.log ('api/index.js request URL:', API_URL + url);

      const response = await fetch(API_URL + url, options);
      const data = await response.json();

      console.log('api/index.js data:', data);

      if (data.error){
          throw data.error;
      }
      return data;
  } catch (error){
      console.error('api/index.js Error:', error)
  }
};
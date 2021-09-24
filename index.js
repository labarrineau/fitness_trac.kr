// create the express server here
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = require('./src/api');
const server = express();
const { PORT = 3000 } = process.env
const { client } = require('./db/client');

server.use(morgan('dev'));
server.use(bodyParser.json());

server.use('/api', apiRouter);

server.use('*',(req, res, next) =>{
  res.status(404);
  res.send('URL route not found');
});

server.use((error, req, res, next) =>{
  res.status(500);
  res.send(error);
});

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
  client.connect();

});

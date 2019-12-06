const express = require('express');

const server = express();
server.use(logger);
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h2>server is running</h2>`);
});


const projectsRouter = require('./projects/projectsRouter.js');

server.use('/api/projects/', projectsRouter);

const actionsRouter = require('./actions/actionsRouter.js');

server.use('/api/actions/', actionsRouter);



//custom middleware

function logger(req, res, next) {
  // console.log(req);
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}

const port = 8001;
server.listen(port, () => console.log(`api running on port ${port}`));
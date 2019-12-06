const express = require('express');

const router = express.Router();

const db = require('../data/helpers/projectModel.js');

router.post('/', validateProject, (req, res) => {
  db.insert(req.body).then(project => {
      res.status(200).json(project);
  })
  .catch(err => {
      res.status(500).json({ error: "There was an error while saving the project to the database" });
  });
});
router.get('/', (req, res) => {
  db.get().then(projects => {
      res.status(200).json(projects);
  })
  .catch(err => {
      res.status(500).json({ error: "There was an error while getting projects from the database" });
  });
});
router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});
router.put('/:id', validateProjectId, validateProject, (req, res) => {
  db.update(req.params.id, req.body).then(project => {
        res.status(200).json(project);
  })
  .catch(err => {
      res.status(500).json({ error: "The project information could not be modified." });
  });
});
router.delete('/:id', validateProjectId, (req, res) => {
    db.remove(req.params.id)
      .then(project => {
        res.status(200).json(project);
      })
      .catch(err => {
          res.status(500).json({ error: "The user could not be removed" });
      });
  });
router.get('/:id/actions', validateProjectId, (req, res) => {
    db.getProjectActions(req.params.id)
      .then(actions => {
          res.status(200).json(actions);
      })
      .catch(err => {
          res.status(500).json({message: `Could not retrieve the project's actions`});
      })
    });

    
//custom middleware
function validateProjectId(req, res, next) {
  console.log('id: ', req.params.id);
  db.get(req.params.id).then(project => {
      if(project){
          req.project = project;
          next();
      }
      else{
          res.status(404).json({ message: "The project with the specified ID does not exist." });
      }
  })
  .catch(err => {
      res.status(500).json({ error: "The project information could not be retrieved."});
  });
}
function validateProject(req, res, next) {
  if (req.body){
    if (!req.body.name){
      res.status(400).json({ message: "Missing required name field" });
    }
    else if (!req.body.description){
      res.status(400).json({ message: "Missing required description field" });
    }
    else{
      next();
    }
  }
  else{
    res.status(400).json({ message: "Missing project data" });
  }
}

module.exports = router;
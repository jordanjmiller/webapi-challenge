const express = require('express');

const router = express.Router();

const db = require('../data/helpers/actionModel.js');

router.post('/', validateAction, (req, res) => {
    db.insert(req.body).then(action => {
        res.status(200).json(action);
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the action to the database" });
    });
  });
router.get('/', (req, res) => {
db.get().then(actions => {
    res.status(200).json(actions);
})
.catch(err => {
    res.status(500).json({ error: "There was an error while getting actions from the database" });
});
});
router.get('/:id', validateActionId, (req, res) => {
res.status(200).json(req.action);
});
router.put('/:id', validateActionId, validateAction, (req, res) => {
db.update(req.params.id, req.body).then(action => {
        res.status(200).json(action);
})
.catch(err => {
    res.status(500).json({ error: "The action information could not be modified." });
});
});
router.delete('/:id', validateActionId, (req, res) => {
    db.remove(req.params.id)
    .then(action => {
        res.status(200).json(action);
    })
    .catch(err => {
        res.status(500).json({ error: "The action could not be removed" });
    });
});


//custom middleware
function validateActionId(req, res, next) {
  console.log('id: ', req.params.id);
  db.get(req.params.id).then(action => {
      if(action){
          req.action = action;
          next();
      }
      else{
          res.status(404).json({ message: "Invalid action id" });
      }
  })
  .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved."});
  });
}
function validateAction(req, res, next) {
  if (req.body){
    if (!req.body.project_id){
      res.status(400).json({ message: "Missing required project id field" });
    }
    else if (!req.body.description){
      res.status(400).json({ message: "Missing required description field" });
    }
    else if (!req.body.notes){
      res.status(400).json({ message: "Missing required notes field" });
    }
    else{
      next();
    }
  }
  else{
    res.status(400).json({ message: "Missing action data" });
  }
}


module.exports = router;
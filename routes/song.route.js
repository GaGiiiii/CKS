const express = require('express');
const router = express.Router();

// Require The Controllers

const songController = require('../controllers/song.controller');

// Routes

router.get('/', songController.getAll);
router.get('/song/create', ensureAuthenticated, songController.createView);
router.post('/song/create', ensureAuthenticated, songController.create);
router.get('/song/:id', songController.read);
router.get('/song/update/:id', ensureAuthenticated, songController.updateView);
router.post('/song/update/:id', ensureAuthenticated, songController.update);
router.post('/song/delete/:id', ensureAuthenticated, songController.delete);

// Access Control

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

// Export Router

module.exports = router;
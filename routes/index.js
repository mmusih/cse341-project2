const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

// router.get('/', (req, res) => {
//     //#swagger.tags=['cse project2']
//     res.send('cse341-project2')});

router.use('/teachers', require('./teachers'));
router.use('/contacts', require('./contacts'));


// Start GitHub login
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Logout
router.get('/logout', function(req, res, next) {
  req.logout( function(err) {
    if (err) {return next(err);}
    res.redirect('/');
  });
});

module.exports = router;
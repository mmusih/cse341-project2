const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['cse project2']
    res.send('cse341-project2')});

router.use('/teachers', require('./teachers'));

module.exports = router;
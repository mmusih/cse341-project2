const express = require('express');
const router = express.Router();

const teachersController = require('../controllers/teachers');
const validation = require('../middleware/validate');

const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', teachersController.getAll);
router.get('/:id', teachersController.getSingle);
router.post('/', isAuthenticated, validation.saveTeacher, teachersController.createTeacher);
router.put('/:id', isAuthenticated, validation.saveTeacher, teachersController.updateTeacher);
router.delete('/:id',isAuthenticated, teachersController.deleteTeacher)

module.exports = router;
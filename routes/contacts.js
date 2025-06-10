const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');
const validation = require('../middleware/validate');

const { isAuthenticated } = require("../middleware/authenticate");

router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getSingle);
router.post('/', isAuthenticated, validation.saveContact, contactsController.createContact);
router.put('/:id', isAuthenticated, validation.saveContact, contactsController.updateContact);
router.delete('/:id', isAuthenticated, contactsController.deleteContact)

module.exports = router;
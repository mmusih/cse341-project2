const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Contacts']
  //#swagger.summary = 'Display all Contacts'
  try {
    const db = mongodb.getDatabase().db();
    const contacts = await db.collection('contacts').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    res.status(400).json({ message: err.message || err });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Contacts']
  //#swagger.summary = 'Display single contact by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Must use a valid contact ID to find a contact.' });
    }

    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase().db();
    const result = await db.collection('contacts').find({ _id: userId }).toArray();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

const createContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  //#swagger.summary = 'Create a Contact'
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to create contact.' });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'An error occurred while creating the contact.' });
  }
};

const updateContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  //#swagger.summary = 'Update a Contact'
  try {
    const contactId = ObjectId.createFromHexString(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Contact not found or no changes made.' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'An error occurred while updating the contact.' });
  }
};

const deleteContact = async (req, res) => {
  //#swagger.tags=['Contacts']
  //#swagger.summary = 'Delete a Contact'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Must use a valid contact id to delete a contact.' });
    }

    const contactId = ObjectId.createFromHexString(req.params.id);
    const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Contact not found.' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'An error occurred while deleting the contact.' });
  }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};
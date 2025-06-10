const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  //#swagger.tags = ['Teachers']
  //#swagger.summary = 'Display all teachers'
  try {
    const db = mongodb.getDatabase().db();
    const teachers = await db.collection('teachers').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch teachers' });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags = ['Teachers']
  //#swagger.summary = 'Display a single teacher by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Must use a valid teacher id to find a teacher.');
    }

    const userId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase().db();
    const result = await db.collection('teachers').findOne({ _id: userId });

    if (!result) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching the teacher.' });
  }
};

const createTeacher = async (req, res) => {
  //#swagger.tags = ['Teachers']
  //#swagger.summary = 'Create a teacher'
  try {
    const teacher = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      hireDate: req.body.hireDate,
      department: req.body.department,
      specialization: req.body.specialization,
      status: req.body.status
    };

    const response = await mongodb.getDatabase().db().collection('teachers').insertOne(teacher);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Teacher created successfully', id: response.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create teacher' });
    }
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'An error occurred while creating the teacher' });
  }
};


const updateTeacher = async (req, res) => {
  //#swagger.tags = ['Teachers']
  //#swagger.summary = 'Update a teacher by ID'
  try {
    const teacherId = new ObjectId(req.params.id);
    const teacher = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      hireDate: req.body.hireDate,
      department: req.body.department,
      specialization: req.body.specialization,
      status: req.body.status
    };

    const response = await mongodb.getDatabase().db().collection('teachers').replaceOne({ _id: teacherId }, teacher);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Teacher not found or no changes made.' });
    }
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'An error occurred while updating the teacher.' });
  }
};


const deleteTeacher = async (req, res) => {
  //#swagger.tags = ['Teachers']
  //#swagger.summary = 'Delete a teacher by ID'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: 'Must use a valid teacher id to delete a teacher.' });
      return;
    }

    const teacherId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('teachers').deleteOne({ _id: teacherId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Teacher not found.' });
    }
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'An error occurred while deleting the teacher.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
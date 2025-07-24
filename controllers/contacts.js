const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllContacts = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('contacts').find();
    result.toArray().then((contacts) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleContact = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
      if (contacts.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDb().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb.getDb().collection('contacts').replaceOne({ _id: contactId }, contact);
    if (response.modifiedCount > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Contact not found or unchanged' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('contacts').deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact
};

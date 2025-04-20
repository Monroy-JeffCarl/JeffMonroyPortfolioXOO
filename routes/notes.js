const express = require('express');
const router = express.Router();
const { Note } = require('../models');
const checkPermission = require('../middlewares/checkPermission');

// View notes (accessible by all roles)
router.get('/', checkPermission('read_note'), async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create note (Admin and User only)
router.post('/', checkPermission('create_note'), async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      user_id: req.user.id
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update note (Admin and User only)
router.put('/:id', checkPermission('update_note'), async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await note.update(req.body);
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete note (Admin and User only)
router.delete('/:id', checkPermission('delete_note'), async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router; 
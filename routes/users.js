// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Registro de usuario (ya existente)
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).send('Usuario registrado');
});

// Obtener todos los usuarios (para que el administrador los gestione)
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Editar usuario
router.put('/:id', async (req, res) => {
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    res.json(updatedUser);
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

module.exports = router;

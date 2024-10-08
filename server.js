const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://andrelipe897:7uCvUpYLOrmWrboe@cluster0.kcc51.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const nodemailer = require('nodemailer');

// Configuración del transportador (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'andrelipe897@gmail.com',
        pass: 'ohzs fkum ymjg aosr'
    }
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'andrelipe897@gmail.com',
        subject: `Consulta de ${name}`,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar correo:', error);
            return res.status(500).send('Error al enviar el mensaje: ' + error.message);
        }
        res.status(200).send('Mensaje enviado');
    });
});


const bcrypt = require('bcrypt');
const User = require('./models/User');

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send('Usuario registrado');
});
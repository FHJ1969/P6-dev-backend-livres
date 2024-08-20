const mongoose = require('mongoose');
const express = require('express');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Permet de transformer le corps de la requête en objet JSON pour pouvoir l'exploiter (Avoir accès au corps de la requete)
app.use(express.json());

//Middleware pour gérer les erreurs CORS
//Route globale (sans chemin)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;
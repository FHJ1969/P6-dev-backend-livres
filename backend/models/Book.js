//Importation des dépendances
const mongoose = require('mongoose');

//Création d'un schéma mongoose définissant les informations a stocker dans la DB pour chaque livres
const bookSchema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    ratings: [
        {
        userId: {type: String, required: true},
        grade: {type: Number, required: true},
    }
    ],
    averageRating: {type: Number, required: true}
});

module.exports = mongoose.model('Book', bookSchema);
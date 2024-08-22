//Importation des dépendances
const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

//Création d'un schéma mongoose définissant les informations a stocker dans la DB pour chaque utilisateurs
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

userSchema.plugin(uniquevalidator);

module.exports = mongoose.model('User', userSchema);
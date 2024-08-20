const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const validator = require('email-validator');
const passwordValidator = require('../utils/passwordValidation')
require('dotenv').config()

/**
 * Crée un nouvel utilisateur au sein de l'application
 * @param req
 * @param res
 * @param next
 */
exports.signup = (req, res, next) => {
    
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: 'Le mail est obligatoire !' })
    }

    const isValid = validator.validate(email);
    if (!isValid)         
        return res.status(400).json({ error: "L'adresse mail n'est pas valide." });
    
    const password = req.body.password;
    const validationResult = passwordValidator(password);
    if (!validationResult.isSuccess)
        return res.status(400).json({ error: validationResult.failedReason });
    
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Authentifie l'utilisateur sur l'application
 * @param req
 * @param res
 * @param next
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
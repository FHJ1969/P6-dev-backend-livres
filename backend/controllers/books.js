//Importation des dépendances
const fs = require('fs');
const Book = require('../models/Book.js');

//controller prenant en charge la récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({error}));
};

//controller prenant en charge la création d'un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => {
            res.status(201).json({message: 'Le livre a été enregistré avec succès !'})
        })
        .catch(error => {
            res.status(400).json({error})
        })
}

//controller prenant en charge la récupération d'un livre
exports.getBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({error}));
};

//controller prenant en charge la modification d'un livre
exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                
                if (req.file){
                    const originalFilename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${originalFilename}`, (error) => {
                        if (error)
                            console.warn(error);
                    });
                }
                
                Book.updateOne({_id: req.params.id}, {...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Le livre a été modifié avec succès !'}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};

//controller prenant en charge la suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).json({message: 'Le livre a été supprimé avec succès !'})
                        })
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

//controller prenant en charge la notation d'un livre
exports.rateBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            const isRated = book.ratings.some(s => s.userId === req.auth.userId);
            if (isRated) {
                res.status(409).json({message: 'Vous avez déjà noté ce livre !'});
            } else {
               book.ratings.push({
                    userId: req.auth.userId,
                    grade: req.body.rating
                });

                const sum = book.ratings.map(m => m.grade).reduce((total, current) => total + current, 0);
                book.averageRating = sum / book.ratings.length;

                book.save()
                    .then(() => {
                        res.status(201).json(book)
                    })
                    .catch(error => {
                        res.status(500).json({error})
                    })
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

//controller prenant en charge la récupération des 3 livres les mieux notés
exports.getBestRatingBooks = (req, res, next) => {
    Book.find().sort({ averageRating: 'desc'}).skip(0).limit(3)
        .then(filteredBooks => res.status(200).json(filteredBooks))
        .catch(error => res.status(400).json({error}));
};
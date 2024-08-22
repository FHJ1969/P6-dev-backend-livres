//Importation des dépendances
const express = require('express');
const bookController = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

//Routes GET
router.get('/bestrating', bookController.getBestRatingBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);
//Routes POST
router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);
//Routes PUT
router.put('/:id', auth, multer, bookController.updateBook);
//Routes DELETE
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
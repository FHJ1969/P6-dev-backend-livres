const express = require('express');
const bookController = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/bestrating', bookController.getBestRatingBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);

router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);

router.put('/:id', auth, multer, bookController.updateBook);

router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
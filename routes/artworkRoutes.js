const express = require('express');
const { getFeaturedArtworks } = require('../controllers/artworkController');
const router = express.Router();


router.get('/featured', getFeaturedArtworks);

module.exports = router;

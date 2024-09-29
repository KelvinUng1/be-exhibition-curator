const express = require("express");
const { getFeaturedArtworks } = require("../controllers/artworkController");
const { getBrowseArtworks } = require("../controllers/browseArtController");
const { getArtworkById } = require("../controllers/artworkDetailController");

const router = express.Router();

router.get("/featured", getFeaturedArtworks);
router.get("/browse", getBrowseArtworks);
router.get("/:source/:id", getArtworkById);

module.exports = router;

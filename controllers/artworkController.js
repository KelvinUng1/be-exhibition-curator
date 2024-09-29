const axios = require("axios");
const { formatDate, extractArtistName } = require("../utils/helpers");

// Fetch 'featured' paintings from metapi
async function getClevelandPaintings() {
  const cmaPaintingsIDs = ["1976.2", "1942.647", "1958.31"]; //cruci, burning houses, and vangogh
  try {
    const paintings = await Promise.all(
      cmaPaintingsIDs.map(async (id) => {
        const objectResponse = await axios.get(
          `https://openaccess-api.clevelandart.org/api/artworks/${id}`
        );
        const artwork = objectResponse.data.data; // NEdd this to access the artwork ddata

        return {
          id: artwork.id,
          title: artwork.title || "Untitled",
          artist:
            artwork.creators && artwork.creators.length > 0
              ? extractArtistName(artwork.creators[0].description)
              : "Unknown Artist",
          image_url:
            artwork.images && artwork.images.web ? artwork.images.web.url : "",
          date: formatDate(artwork.creation_date) || "No date available",
        };
      })
    );

    return paintings;
  } catch (error) {
    console.error(
      "Error fetching paintings from Cleveland Museum of Art:",
      error.message
    );
    throw new Error("Failed to fetch paintings from Cleveland Museum of Art");
  }
}

// Fetch 'featured' paintings from aic api
async function getArtInstitutePaintings() {
  const aicPaintingsIDs = [6565, 27992, 28067]; // american gothic, la grande jatte and old guitarist
  try {
    const paintings = await Promise.all(
      aicPaintingsIDs.map(async (id) => {
        const objectResponse = await axios.get(
          `https://api.artic.edu/api/v1/artworks/${id}`
        );
        const artwork = objectResponse.data.data;

        return {
          id: artwork.id,
          title: artwork.title || "Untitled",
          artist: artwork.artist_display
            ? extractArtistName(artwork.artist_display)
            : "Unknown Artist",
          image_url: artwork.image_id
            ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
            : "",
          date: formatDate(artwork.date_display) || "No date available",
        };
      })
    );

    return paintings;
  } catch (error) {
    console.error(
      "Error fetching paintings from Art Institute of Chicago:",
      error.message
    );
    throw new Error("Failed to fetch paintings from Art Institute of Chicago");
  }
}

// Combine aic and cma APIs
const getFeaturedArtworks = async (req, res) => {
  try {
    const clevelandPaintings = await getClevelandPaintings();
    const artInstitutePaintings = await getArtInstitutePaintings();

    res.status(200).json({
      clevelandMuseumArt: clevelandPaintings,
      artInstituteChicago: artInstitutePaintings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeaturedArtworks };

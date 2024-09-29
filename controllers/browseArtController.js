const axios = require("axios");

const getBrowseArtworks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const searchKeyword = req.query.search || ''; 
  const startIndex = (page - 1) * limit;

  try {
    // fetch AIC artworks with pagination+search
    const aicCollectionResponse = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?is_on_view=1&artwork_type_id=Painting&is_public_domain=true&limit=${limit}&page=${page}&q=${searchKeyword}`
    );
    const aicArtworkIds = aicCollectionResponse.data.data.map(
      (artwork) => artwork.id
    );

    const aicArtworksPromises = aicArtworkIds.map((id) =>
      axios.get(`https://api.artic.edu/api/v1/artworks/${id}`)
    );
    const aicArtworksResponses = await Promise.all(aicArtworksPromises);
    const aicArtworks = aicArtworksResponses.map((response) => ({
      id: response.data.data.id,
      title: response.data.data.title || "Unknown Title",
      artist: response.data.data.artist_display || "Unknown Artist",
      image_url: response.data.config.iiif_url
        ? `${response.data.config.iiif_url}/${response.data.data.image_id}/full/843,/0/default.jpg`
        : "Image Not Available",
      date: response.data.data.date_display || "Unknown Date",
    }));

    // fetch CMA - pagination, painting, search keyword
    const cmaResponse = await axios.get(
      "https://openaccess-api.clevelandart.org/api/artworks/",
      {
        params: {
          q: `painting ${searchKeyword}`, 
          skip: startIndex,
          limit: limit,
          has_image: 1,
        },
      }
    );
    const cmaArtworks = cmaResponse.data.data.map((artwork) => ({
      id: artwork.id,
      title: artwork.title || "Unknown Title",
      artist:
        artwork.creators && artwork.creators.length > 0
          ? artwork.creators[0].description
          : "Unknown Artist",
      image_url:
        artwork.images && artwork.images.web
          ? artwork.images.web.url
          : "Image Not Available",
      date: artwork.creation_date || "Unknown Date",
      description: artwork.description || "No description available",
    }));

    // combine AIC and CMA data
    res.json({
      page,
      limit,
      artInstituteChicago: aicArtworks,
      clevelandMuseumArt: cmaArtworks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch artworks for browsing" });
  }
};

module.exports = { getBrowseArtworks };

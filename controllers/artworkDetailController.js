const axios = require('axios');
const { extractArtistName } = require('../utils/helpers');

// Fetch artwork details from CMA by id
async function getCMAArtworkById(id) {
  const response = await axios.get(`https://openaccess-api.clevelandart.org/api/artworks/${id}`);
  const artwork = response.data.data;
  return {
    //title and artist
    title: artwork.title || 'Untitled',
    artist: artwork.creators && artwork.creators.length > 0 ? artwork.creators[0].description : 'Unknown Artist', 
    date: artwork.creation_date || 'Unknown Date',
    //Caption
    description: artwork.description || 'No description available',
    //---artwork infomation
    //--details
    id: artwork.id,
    medium: artwork.type || 'Unknown Medium',
    //--Catalogue Entry
    catalogue_entry: artwork.citations && artwork.citations.length > 0 ? artwork.citations[0].citation : 'No catalogue entry available',
    //location
    museum: 'Cleveland Institute of Art',
    location: artwork.current_location || 'Unknown location',
    image_url: artwork.images && artwork.images.web ? artwork.images.web.url : 'Image Not Available',
  };
}

// Fetch artwork details from AIC by id
async function getAICArtworkById(id) {
  const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
  const artwork = response.data.data;
  return {
    //title and artist
    title: artwork.title || 'Untitled',
    artist: artwork.artist_display || 'Unknown Artist',
    date: artwork.date_display || 'Unknown Date',
    //caption
    description: artwork.short_description || artwork.description || 'No description available',
    //---artwork infomation
    //--details
    id: artwork.id,
    medium: artwork.medium_display || 'Unknown Medium',
    //--Catalogue Entry
    catalogue_entry: artwork.publication_history || 'No catalogue entry available',
    //location
    location:'Art Institute of Chicago',
    image_url: artwork.image_id ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` : 'Image Not Available',
  };
}

// artwork details by ID + source
const getArtworkById = async (req, res) => {
  const { id, source } = req.params; 
  //console.log(`fetchartwork from ${source} --- id ${id}`);
  try {
    let artwork;
    if (source === 'cma') {
      artwork = await getCMAArtworkById(id);
    } else if (source === 'aic') {
      artwork = await getAICArtworkById(id);
    } else {
      return res.status(400).json({ message: 'Invalid artwork source' });
    }
    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork by ID:', error.message);
    res.status(500).json({ message: 'Failed to fetch artwork details' });
  }
};

module.exports = { getArtworkById };




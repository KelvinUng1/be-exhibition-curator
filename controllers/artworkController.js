const axios = require('axios');

// helper function to format date
function formatDate(date) {
  // Replace / with dashes
  let formattedDate = date.replace('/', '–').trim();

  // "late 1903–early 1904" -> "ca. 1903–1904"
  if (formattedDate.includes('late') || formattedDate.includes('early')) {
    
    const yearMatch = formattedDate.match(/(\d{4}).*(\d{4})/);
    if (yearMatch) {
      formattedDate = `${yearMatch[1]}–${yearMatch[2].slice(-2)}`; 
    }
  }

  // shortened format ("1884–86")
  if (formattedDate.match(/(\d{4})–(\d{4})/)) {
    formattedDate = formattedDate.replace(/–(\d{2})/, '–$1'); 
  }

  return formattedDate;
}


// helper function to get only the artist's name
function extractArtistName(artistString) {
  return artistString.split('\n')[0].split('(')[0].trim();
}

// Fetch 'featured' paintings from MET API --- The Death of Socrates, Madonna and Child, Wheat Field with Cypresses
async function getMetPaintings() {
  const metPaintingsIDs = [436105, 438754, 436535]; 
  try {
    const paintings = await Promise.all(
      metPaintingsIDs.map(async (id) => {
        const objectResponse = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        const artwork = objectResponse.data;

        return {
          id: artwork.objectID,
          title: artwork.title || 'Untitled',
          artist: artwork.artistDisplayName || 'Unknown Artist',
          image_url: artwork.primaryImageSmall || '', 
          date: formatDate(artwork.objectDate) || 'No date available', 
        };
      })
    );

    return paintings;
  } catch (error) {
    console.error('Error fetching paintings from MET:', error.message);
    throw new Error('Failed to fetch paintings from MET');
  }
}

// Fetch 'featured' paintings from AIC API -> American Gothic, A Sunday on La Grande Jatte, The Old Guitarist
async function getArtInstitutePaintings() {
  const aicPaintingsIDs = [6565, 27992, 28067]; // 
  try {
    const paintings = await Promise.all(
      aicPaintingsIDs.map(async (id) => {
        const objectResponse = await axios.get(
          `https://api.artic.edu/api/v1/artworks/${id}`
        );
        const artwork = objectResponse.data.data;

        return {
          id: artwork.id,
          title: artwork.title || 'Untitled',
          artist: artwork.artist_display ? extractArtistName(artwork.artist_display) : 'Unknown Artist',
          image_url: artwork.image_id
            ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
            : '',
          date: formatDate(artwork.date_display) || 'No date available',
        };
      })
    );

    return paintings;
  } catch (error) {
    console.error('Error fetching paintings from Art Institute of Chicago:', error.message);
    throw new Error('Failed to fetch paintings from Art Institute of Chicago');
  }
}

// combin art from both APIs
const getFeaturedArtworks = async (req, res) => {
  try {
    const metPaintings = await getMetPaintings();
    const artInstitutePaintings = await getArtInstitutePaintings();

    res.status(200).json({
      met: metPaintings,
      artInstituteChicago: artInstitutePaintings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFeaturedArtworks };

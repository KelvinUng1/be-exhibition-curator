//only useful for homepage featured artworks
function formatDate(date) {
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
  
  // get only the artist name 
  function extractArtistName(artistString) {
    return artistString.split('\n')[0].split('(')[0].trim();
  }
  
  module.exports = { formatDate, extractArtistName };
  
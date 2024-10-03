# Exhibition-curator

## Summary
This is the backend for the **Exhibition Curator** project, providing an API that retrieves data about artworks from multiple museum sources, including The Art Institute of Chicago and The Cleveland Museum of Art. Users can search for artworks, browse by various criteria, and curate personalized exhibitions.

## Features

- Fetch artworks from multiple museum APIs.
- Search and browse artworks.
- Support for pagination.
- Curate a personalized exhibition of selected artworks.
- Built with Node.js, Express, and Axios.

This project is built with **JavaScript** and **Express**, with Axios for API requests, and is deployed on Render.

- **[Access API here](https://be-exhibition-curator.onrender.com/api/artworks/browse)**

1. Fetch Featured Artworks<br>
GET /api/artworks/featured<br>
Fetch a list of featured artworks from multiple museums.

2. Browse Artworks and Search Keyword<br>
GET /api/artworks/browse<br>
GET /api/artworks/browse?search=<keyword>&page=<pageNumber>&limit=<resultsPerPage><br>
Search artworks by keyword with pagination.

3. Fetch Artwork Details by ID and Source<br>
GET /api/artworks/:source/:id<br>
Fetch detailed information on a specific artwork.

## Setup instructions

### Minimum Requirements

- **Node.js**: Version ^14.0 or above

---

### To run this project locally:

1. **Clone the repository:**

   ```
   git clone https://github.com/KelvinUng1/be-exhibition-curator.git

   cd be-exhibition-curator
2. **Install dependencies**
    ```
    npm install
    ```
3. **Start the server**

    Run the following command to start the local development server:

    ```
    npm start
    ```
    Package documentation:<br>
    Express: https://expressjs.com/<br>
    Axios: https://axios-http.com/
---

### Minimum Requirements

- **Node.js**: Version ^14.x or above

---

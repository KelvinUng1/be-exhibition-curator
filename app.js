const express = require("express");
const cors = require("cors");
const artworkRoutes = require("./routes/artworkRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/artworks", artworkRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

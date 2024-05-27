const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const errorHandler = require('./Middleware/errorMiddleware')

const app = express();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // handle data coming from URL
app.use(bodyParser.json())

// Routes Middleware
app.use("/api/users", userRoute)

// Routes
app.get('/', (req, res) => {
    res.send("Home Page")
})


// Error Handler
app.use(errorHandler)

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

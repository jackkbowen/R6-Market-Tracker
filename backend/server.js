const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: './config.env' }); // Ensure this is called early
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

console.log(`PORT: ${process.env.PORT}`);
console.log(`DB_URL: ${process.env.DB_URI}`);

// Connect to the Database
const db = require("./app/db");
db.mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

require("./app/routes/market.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT; // Provide a default port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

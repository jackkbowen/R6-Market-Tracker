const cors = require("cors");
require("dotenv").config({ path: './config.env' }); // Ensure this is called early
const cron = require("node-cron");
const express = require("express");
const shell = require("shelljs");
const { exec } = require("child_process");
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
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// Landing page route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to R6 Market Backend."});
});

// Exposing backend api routes
require("./app/routes/market.routes")(app);
require("./app/routes/db.routes")(app);

// Set port, listen for requests
const PORT = process.env.PORT; // Provide a default port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Schedule the market scan
cron.schedule('*/30  * * * *', function(){
  var datetime = new Date().toLocaleString().replace(',','');
  console.log('[ ' + datetime + ' ] ' + 'Scanning market...');
  exec("python ../backend/app/scripts/scanMarket.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
  datetime = new Date().toLocaleString().replace(',','');
  console.log('[ ' + datetime + ' ] ' + "Market scan complete");
})

// Stagger the ETL pipeline to avoid conflicting with the market scan
// Appends the recent sold data to the database
cron.schedule('5,35 * * * *', function(){
  var datetime = new Date().toLocaleString().replace(',','');
  console.log('[ ' + datetime + ' ] ' + 'Starting ETL pipeline...');
  exec("python ../backend/app/scripts/ETLpipeline.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });

  datetime = new Date().toLocaleString().replace(',','');
  console.log('[ ' + datetime + ' ] ' + "ETL pipeline complete");
})


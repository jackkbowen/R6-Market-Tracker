const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URI;
db.marketplaceItem = require("../models/marketplaceItem.model.js")(mongoose);

module.exports = db;

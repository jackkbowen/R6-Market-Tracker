module.exports = (app) => {
    const mongoose = require("mongoose");
    const router = require("express").Router();
    const dbQuery = require("../controllers/db.controller.js");

    // Query all items in the marketplace
    router.get("/queryAll", dbQuery.queryAll);

    // Query the top 6 trending items in the marketplace
    router.get("/trendingItems", dbQuery.trendingItems);


    app.use("/db", router);
};




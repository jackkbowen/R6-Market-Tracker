module.exports = (app) => {
    const mongoose = require("mongoose");
    const router = require("express").Router();
    const marketplaceItem = require("../controllers/marketplaceItem.controller.js");

    // Add a new item to the marketplaceItem DB
    // All items should exist in DB already, need to grab the itemID from r6Market
    router.post("/add", marketplaceItem.newItem);


    // Scan the marketplace for changes in item prices
    // Using python script that will be run as a child process
    // Gets data through the ubisoft API
    router.get("/scanMarket", marketplaceItem.scanMarket);

    // Calls the ETL pipeline script to update the database
    // Stand alone function for if I have a use for it
    // Upserts data to append sales data to the existing data
    // TODO Should always be called after scanMarket. Need to find a way to run both in one call and have the server not crash, maybe just nodemon issue
    router.get("/updateDatabase", marketplaceItem.updateDatabase);


    app.use("/market", router);
};

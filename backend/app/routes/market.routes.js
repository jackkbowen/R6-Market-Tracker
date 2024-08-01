module.exports = (app) => {
    const mongoose = require("mongoose");
    const router = require("express").Router();
    const marketplaceItem = require("../controllers/marketplaceItem.controller.js");

    router.get("/", async (req, res) => {
        let items = await db.collection("marketplaceItems");
        let data = await items.find({}).toArray();
        res.send(data).status(200);
    });

    // Add a new item to the marketplaceItem DB
    // All items should exist in DB already, need to grab the itemID from r6Market
    router.post("/add", marketplaceItem.newItem);


    // Scan the marketplace for changes in item prices
    // Using python script that will be run as a child process
    // Gets data through the ubisoft API
    router.get("/scanMarket", marketplaceItem.scanMarket);


    app.use("/market", router);
};

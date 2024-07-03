module.exports = (app) => {
    const express = require("express");
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



    app.use("/market", router);
};

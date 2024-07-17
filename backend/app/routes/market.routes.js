module.exports = (app) => {
    const express = require("express");
    const mongoose = require("mongoose");
    const { exec } = require("child_process");
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
    router.get("/scanMarket", async (req, res) => {
        exec("python3 ../scripts/scanMarket.py", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        res.status(200).send("Market scanned successfully");


    });




    app.use("/market", router);
};

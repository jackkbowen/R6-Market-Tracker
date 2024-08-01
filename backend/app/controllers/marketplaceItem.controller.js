const Items = require('../models/marketplaceItem.model');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { fs } = require('fs');
const { exec } = require("child_process");


exports.newItem = asyncHandler(async (req, res) => {

    // Check if the item already exists in the database
    const itemExists = await Items.findOne({ itemID: req.body.itemID });
    if (itemExists) {
        res.status(400).send({  message: "ERROR: Item already exists. Please use the existing item.",
                                product: itemExists.name});
                                return
    }

    // Create a new item
    const newItem = new Items({
        itemID: req.body.itemID,
        itemName: req.body.itemName,
        itemType: req.body.itemType,
        itemTags: req.body.itemTags,
        itemAssetUrl: req.body.itemAssetUrl,
        itemPriceHistory: req.body.itemPriceHistory,
        marketData: req.body.marketData,
    });

    // Save the new item to the database
    newItem.save(newItem).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while creating the item."
        });
    });
});

exports.scanMarket = asyncHandler(async (req, res) => {
    const dataFile = '../backend/app/scripts/assets/data.json';
    // Check if the data file exists
    console.log(dataFile);
    /*
    fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Create an empty data file if it doesn't exist
                fs.writeFile(dataFile, JSON.stringify({}));

                fs.readFile(dataFile, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: "Error reading data file." });
                    }
                });
            }
        }
        console.log(data);
    });
    */


    exec("python3 ../backend/app/scripts/scanMarket.py", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.status(500).send({ message: "Error executing script" });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.status(500).send({ message: "Script execution error" });
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).send({ message: "Market scan started."});
    });
});

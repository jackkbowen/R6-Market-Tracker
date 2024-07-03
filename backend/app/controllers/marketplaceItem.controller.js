const Items = require('../models/marketplaceItem.model');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

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
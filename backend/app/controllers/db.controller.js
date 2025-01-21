const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

var connection = mongoose.connection;

const marketplaceItems = require('../models/marketplaceItem.model');

exports.queryAll = asyncHandler(async (req, res) => {

    await marketplaceItems.find({})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "No items found"
                });
                return;
            }
            res.status(200).send(data);
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving items."
            });
            return;
        });
});

exports.trendingItems = asyncHandler(async (req, res) => {
    await marketplaceItems.find({})
        .sort({ "Demand": -1 })
        .limit(6)
        .select({ id: 1, name: 1,  asset_url: 1, Demand: 1,  Supply: 1, AverageSold: 1 }) 
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "No items found"
                });
                return;
            }
            res.status(200).send(data);
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving trending items."
            });
            return;
        });
});


exports.expensiveItems = asyncHandler(async (req, res) => {
    const queryString = req.query.search_query;
    await marketplaceItems.find({})
        .sort({ "AverageSold": -1 })
        .limit(6)
        .select({ id: 1, name: 1,  asset_url: 1, Demand: 1,  Supply: 1, AverageSold: 1 }) 
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "No items found"
                });
                return;
            }
            res.status(200).send(data);
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving expensive items."
            });
            return;
        });
});


exports.searchItems = asyncHandler(async(req,res) => {
    console.log("In searchItems");
    const queryString = req.query.search_query;
    console.log("Query" + queryString);
    await marketplaceItems.find({name: {$regex: queryString, $options: 'i'}})
    .select({ id: 1, name: 1, asset_url: 1, Demand: 1,  Supply: 1, AverageSold: 1 })
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: "No products found matching: " + queryString });
            return;
        }
            res.status(200).send(data);
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving items from merketplace."});
            return;
        });
    });





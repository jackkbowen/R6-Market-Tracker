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


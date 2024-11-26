const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema(
    {
        itemID: {
            type: String,
            required: true,
            unique: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        itemType: {
            type: String,
            required: true,
        },
        itemTags: {
            type: [String],
            required: true,
        },
        itemAssetUrl: {
            type: String,
            required: true,
            default: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/1200px-Question_Mark.svg.png",
        },
        itemPriceHistory: {
            type: [[Number, Number]],
            required: true,
        },
        marketData: {
            type: [Number, Number, Number, Number, Number, Number],
            required: false,
            default: [null, null, null, null, null, null],
        },
        Season: {
            type: String,
            required: true,
        },
        Demand: {
            type: Number,
            required: true,
        },
        Supply: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true, upsert: true, collection : 'marketplaceItems' }
);

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
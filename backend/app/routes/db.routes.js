module.exports = (app) => {
    const mongoose = require("mongoose");
    const router = require("express").Router();
    const dbQuery = require("../controllers/db.controller.js");

    // Query all items in the marketplace
    router.get("/queryAll", dbQuery.queryAll);


    app.use("/db", router);
};




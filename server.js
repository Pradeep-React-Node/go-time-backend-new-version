"use strict";
//This file is AWS Lambda entry point
//All your business code (ExpressJS App) should be done in src/app.js

// const awsServerlessExpress = require("aws-serverless-express");
// const app = require("./app.js");
// const server = awsServerlessExpress.createServer(app);

// module.exports.handler = (event, context) =>
//   awsServerlessExpress.proxy(server, event, context);

// const awsServerlessExpress = require("aws-serverless-express");
const connectDatabase = require("./config/db_config");

module.exports.handler = (event, ctx) => {
    ctx.callbackWaitsForEmptyEventLoop = false;

    console.log("Connecting to database...");
    connectDatabase()
        .then(() => proxy(createServer(app.callback()), event, ctx))
        .catch((error) => {
            console.error("Could not connect to database", { error });
            throw error;
        });
};
const AWS = require("aws-sdk");

module.exports = new AWS.S3({
    accessKeyId: process.env.IM_AWS_ACCESS_KEY,
    signatureVersion: 'v4',
    region: "us-east-2",
    secretAccessKey: process.env.IM_AWS_SECRET_KEY
});
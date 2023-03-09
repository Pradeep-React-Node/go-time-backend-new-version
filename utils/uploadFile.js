const AWS = require("aws-sdk");
const fs = require("fs");
const s3 = require("../config/aws_config");

module.exports = {
    uploadFile: async (
        uploadData,
        successCallback = () => { },
        failCallback = () => { }
    ) => {
        var uploadParams = {
            Bucket: "gotime-assets",
            Key: uploadData?.key,
            Body: uploadData?.file,
            ContentType: uploadData?.type
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log(err, "uploaderror");
                failCallback(err);
            } else {
                console.log(`File uploaded successfully. ${data?.Location}`);
                successCallback(data?.Location);
            }
        });
    },

    deleteFile: async (
        path,
        successCallback = () => { },
        failCallback = () => { }
    ) => {
        var deleteParams = {
            Bucket: "hrms-user-documents",
            Key: path,
        };

        s3.deleteObject(deleteParams, function (err, data) {
            if (err) {
                console.log(err, "deleteerror");
                failCallback(err);
            } else {
                console.log(`File deleted successfully`);
                successCallback();
            }
        });
    },

    getPresignedUrl: async (
        path,
        successCallback = () => { },
        failCallback = () => { }
    ) => {
        const params = {
            Bucket: "hrms-user-documents",
            Key: path,
            Expires: 120,
        };
        try {
            const url = s3.getSignedUrl("getObject", params);
            successCallback(url);
            // return url;
        } catch (err) {
            if (err) {
                console.log(err, "myerror");
                failCallback(err);
            }
        }
    },
};
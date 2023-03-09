const categorySchema = require("../models/category");
var mongoose = require('mongoose');
const { uploadFile } = require("../utils/uploadFile");
const dateForFilename = require("../utils/dateForFilename");
const createFileExtension = require("../utils/createFileExtension");

module.exports = {
    createCategory: (req, res) => {
        try {
            var file = req?.files?.category;
            var filename = dateForFilename();
            var { is_deleted = false, name = "" } = req?.body

            var uploadToDatabase = (url) => {
                var created_id = mongoose.Types.ObjectId();
                query = { _id: _id ? _id : created_id }
                categorySchema?.findOneAndUpdate(query, url ? { image: url, is_deleted, name } : { is_deleted: is_deleted, name: name }, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, dbResponse) => {
                    if (!err) {
                        res.status(200).send({ status: "success", data: dbResponse })
                    } else {
                        res.status(200).send({ status: "failed", message: err?.message })
                    }
                })
            }

            var _id = req?.body?._id
            if (!_id && !file) {
                res.status(200).send({ status: "failed", message: "File not provided" })
            } else if (file) {
                var fileExtension = createFileExtension(req?.files?.category?.name);
                var key = `categories/${filename}.${fileExtension}`;
                uploadFile(
                    {
                        file: file?.data,
                        key: key,
                        type: file?.mimetype
                    },
                    (url) => {
                        uploadToDatabase(url);
                    },
                    (err) => {
                        res.status(200).send({ status: "failed", message: err?.message })
                    }
                )
            } else {
                uploadToDatabase();
            }
        } catch (err) {
            res.status(200).send({ status: "failed", message: err?.message });
        }
    },

    getCategories: (req, res) => {
        try {
            categorySchema?.find(req?.query, (err, dbResponse) => {
                if (!err) {
                    res.status(200).send({ status: "success", data: dbResponse })
                } else {
                    res.status(200).send({ status: "failed", message: err?.message })
                }
            })
        } catch (err) {
            res.status(200).send({ status: "failed", message: err?.message });
        }
    }
}
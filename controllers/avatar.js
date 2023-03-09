const avatarSchema = require("../models/avatar");
var mongoose = require('mongoose');
const { uploadFile } = require("../utils/uploadFile");
const dateForFilename = require("../utils/dateForFilename");
const createFileExtension = require("../utils/createFileExtension");

module.exports = {
    createAvatar: (req, res) => {
        try {
            var file = req?.files?.avatar;
            var filename = dateForFilename();
            var { is_deleted = false } = req?.body

            var uploadToDatabase = (url) => {
                var created_id = mongoose.Types.ObjectId();
                query = { _id: _id ? _id : created_id }
                avatarSchema?.findOneAndUpdate(query, url ? { image: url, is_deleted: is_deleted } : { is_deleted: is_deleted }, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, dbResponse) => {
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
                var fileExtension = createFileExtension(req?.files?.avatar?.name);
                var key = `avatars/${filename}.${fileExtension}`;
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

    getAvatars: (req, res) => {
        try {
            avatarSchema?.find(req?.query, (err, dbResponse) => {
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
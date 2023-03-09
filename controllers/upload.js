const toonify = require('toonify');
const fs = require("fs")
var dateForFilename = require("../utils/dateForFilename")
var createFileExtension = require("../utils/createFileExtension")
var { uploadFile } = require("../utils/uploadFile")
const request = require("request");
const userSchema = require("../models/user");

module.exports = async (req, res) => {
    try {
        var filename = dateForFilename();
        var file = req?.files?.image;
        var user_id = req?.body?.user_id;
        var fileExt = createFileExtension(file?.name)
        const cartoon = new toonify('cec9c424-7e49-4d7b-8d61-2cd7d6d87278');

        if (file && user_id) {
            uploadFile(
                {
                    file: file?.data,
                    key: `${user_id}/${filename}.${fileExt}`,
                    type: file?.mimetype
                },
                (url) => {
                    console.log(url, "uuurr");
                    newFunc(url)
                }
            )

            var newFunc = (url) => {
                cartoon.transform({
                    photo: url
                })
                    .then(data => {
                        uploadFile(
                            {
                                file: Buffer.from(data?.base64Image, "base64"),
                                key: `${user_id}/${filename}.${fileExt}`,
                                type: file?.mimetype
                            },
                            (url) => {
                                console.log(url, "url");
                                userSchema.findOneAndUpdate({ _id: user_id }, { profile_picture: url }, { new: true }, (err, data) => {
                                    if (!err) {
                                        res.status(200).send({ status: "success", data: data })
                                    } else {
                                        res.status(200).send({ status: "failed", message: err?.message })
                                    }
                                })
                            }
                        )
                    })
                    .catch(err => {
                        res.status(200).send({ status: "failed", message: "Please upload an image with proper face view" })
                    })

                // request({ url: resp?.output_url, encoding: null }, (err, response, body) => {
                //     console.log(body, "bodyy");

                // })
            }
        } else {
            res.status(200).send({ status: "failed", message: "All fields are required" });
        }
    } catch (err) {
        res.status(200).send({ status: "failed", message: "Please upload an image with proper face view" })
    }
}
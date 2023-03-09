const createFileExtension = require("../utils/createFileExtension");
const dateForFilename = require("../utils/dateForFilename");
const { uploadFile } = require("../utils/uploadFile");

module.exports = (req, res) => {
  try {
    var file = req?.files?.image || req?.files?.video;
    console.log(file?.mimetype, "fileeee");
    var filename = dateForFilename();
    var fileExtension = createFileExtension(file?.name);
    if (file) {
      uploadFile(
        {
          file: file?.data,
          key: `challenges/${filename}.${fileExtension}`,
          type: file?.mimetype
        },
        (url) => {
          res.status(200).send({ status: "success", url: url });
        },
        (err) => {
          res.status(200).send({ status: "failed", message: err?.message });
        }
      );
    } else {
      res.status(200).send({ status: "failed", message: "File is required" });
    }
  } catch (err) {
    res.status(200).send({ status: "failed", message: err?.message });
  }
};

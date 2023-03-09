const storeSchema = require("../models/store");
var mongoose = require("mongoose");
const userSchema = require("../models/user");
const { mapSeries } = require("async");
const storeRouter = require("../routes/store");
const { uploadFile } = require("../utils/uploadFile");
const dateForFilename = require("../utils/dateForFilename");
const createFileExtension = require("../utils/createFileExtension");

module.exports = {
  createStore: (req, res) => {
    try {
      var imageFile = req?.files?.image;
      var newBodyItems = ({
        _id,
        store_name,
        description,
        longitude,
        latitude,
        address,
        website_url,
        category,
        is_deleted = false,
      } = req?.body);

      if (
        !_id &&
        (!store_name ||
          !longitude ||
          !latitude ||
          !address ||
          !website_url ||
          !imageFile ||
          !category)
      ) {
        res
          .status(200)
          .send({ status: "failed", message: "All fields are required" });
        return;
      }

      if (imageFile) {
        var filename = dateForFilename();
        var fileExtension = createFileExtension(imageFile?.name);
      }

      console.log(req.body, "lakajagag");

      const addToDatabase = (url) => {
        var imageQuery = url ? { image: url } : {};
        var query =
          latitude && longitude
            ? {
                location:
                  longitude && latitude
                    ? {
                        type: "Point",
                        coordinates: [
                          parseFloat(newBodyItems?.longitude),
                          parseFloat(newBodyItems?.latitude),
                        ],
                      }
                    : undefined,
                store_name,
                website_url,
                description,
                address,
                category,
                is_deleted,
                ...imageQuery,
              }
            : _id && is_deleted
            ? { _id, is_deleted }
            : { ...req?.body, ...imageQuery };

        storeSchema?.findOneAndUpdate(
          { _id: _id ? _id : mongoose.Types.ObjectId() },
          query,
          { upsert: true, new: true, setDefaultsOnInsert: true },
          (err, response) => {
            if (!err) {
              res.status(200).send({ status: "success", data: response });
            } else {
              res.status(200).send({ status: "failed", message: err?.message });
            }
          }
        );
      };

      if (_id && !imageFile) {
        addToDatabase();
      } else {
        var uploadParams = {
          key: `stores/images/${filename}.${fileExtension}`,
          file: imageFile?.data,
          type: imageFile?.mimetype,
        };

        uploadFile(
          uploadParams,
          (url) => {
            addToDatabase(url);
          },
          (err) => {
            res.status(200).send({ status: "failed", message: err?.message });
          }
        );
      }
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getStoresPagination: async (req, res) => {
    try {
      var {
        _id,
        limit = 500,
        page = 1,
        longitude,
        latitude,
        category = [],
        is_deleted = false,
      } = req?.body;
      console.log(req?.body, "req?.bodyreq?.body");

      var categoryQuery =
        category?.length > 0 ? { query: { category: { $in: category } } } : {};

      var result = await storeSchema
        .aggregate([
          longitude && latitude
            ? {
                $geoNear: {
                  near: { type: "Point", coordinates: [longitude, latitude] },
                  distanceField: "calculated",
                  maxDistance: 200000,
                  includeLocs: "location",
                  ...categoryQuery,
                  spherical: true,
                },
              }
            : {
                $addFields: {
                  _id: {
                    $toString: "$_id",
                  },
                },
              },

          category?.length > 0
            ? { $match: { category: { $in: category } } }
            : _id
            ? { $match: { _id: _id } }
            : { $match: { _id: { $exists: true } } },
          { $match: { is_deleted } },
          { $limit: limit },
          { $skip: (page - 1) * limit },
        ])
        .sort("-createdAt");
      var totalPages;
      var allData = await storeSchema.find({});
      if (limit >= allData?.length) {
        totalPages = 1;
      } else {
        var tempPage = allData?.length / limit;
        var decimal = tempPage - Math.floor(tempPage);
        totalPages = tempPage - decimal + 1;
      }
      res.status(200).send({
        status: "success",
        data: {
          limit: limit,
          page: page,
          totalPages: totalPages,
          data: result,
        },
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },
};

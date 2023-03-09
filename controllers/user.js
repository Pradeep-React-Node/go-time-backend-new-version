const userSchema = require("../models/user");
var mongoose = require("mongoose");
var CryptoJS = require("crypto-js");
const userWalletSchema = require("../models/userWallet");

module.exports = {
  createUser: (req, res) => {
    try {
      var hashedPassword;
      var { _id, password, latitude, longitude, address, ...rest } = req?.body;
      if (req?.body?.password) {
        console.log(password, "pass");
        var cipher = CryptoJS.AES.encrypt(password, process.env.ENCRYPT_KEY);
        hashedPassword = cipher.toString();
        console.log(hashedPassword, "hashPass");
      }
      var created_id = mongoose.Types.ObjectId();
      query = _id ? { _id: _id } : { _id: created_id };
      var dataToSend =
        longitude && latitude
          ? {
              location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
              },
              address,
            }
          : req?.body?.password
          ? { ...rest, password: hashedPassword, location: {} }
          : { ...rest };
      console.log(dataToSend, "dtSe");
      userSchema?.findByIdAndUpdate(
        query,
        dataToSend,
        { upsert: true, new: true, setDefaultsOnInsert: true },
        async (err, dbResponse) => {
          console.log(err, "dbResponse");
          if (!err) {
            var { password, ...newRest } = { ...dbResponse?._doc };
            if (!_id) {
              await userWalletSchema?.create({
                user_id: newRest?._id,
                currency: "USD",
              });
              res.status(200).send({ status: "success", data: newRest });
            } else {
              res.status(200).send({ status: "success", data: newRest });
            }
          } else {
            res.status(200).send({ status: "failed", message: err?.message });
          }
        }
      );
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getUsers: (req, res) => {
    try {
      userSchema?.find(req?.query, "-password", (err, dbResponse) => {
        if (!err) {
          res.status(200).send({ status: "success", data: dbResponse });
        } else {
          res.status(200).send({ status: "failed", message: err?.message });
        }
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getUsersPagination: async (req, res) => {
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
        category?.length > 0
          ? { query: { categories: { $in: category } } }
          : {};

      var result = await userSchema
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
            : !longitude && !latitude && category?.length > 0
            ? { $match: { categories: { $in: category } } }
            : { $match: { _id: { $exists: true } } },
          { $limit: limit },
          { $skip: (page - 1) * limit },
        ])
        .sort("-createdAt");
      console.log(result, "result");
      var totalPages;
      var allData = await userSchema.find({});
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

  deleteUser: (req, res) => {
    try {
      userSchema?.deleteOne({ _id: req?.query?._id }, (err, response) => {
        if (!err) {
          res.status(200).send({ status: "success", data: response });
        } else {
          res.status(200).send({ status: "failed", message: err?.message });
        }
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },
};

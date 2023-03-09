const challengeSchema = require("../models/challenge");
var mongoose = require("mongoose");
const pagination = require("../utils/pagination");

module.exports = {
  createChallenge: (req, res) => {
    try {
      var _id = req?.body._id;
      console.log(req?.body, "mahBody");
      var created_id = mongoose.Types.ObjectId();
      query = { _id: _id ? _id : created_id };
      challengeSchema?.findOneAndUpdate(
        query,
        req?.body,
        { upsert: true, new: true, setDefaultsOnInsert: true },
        (err, dbResponse) => {
          if (!err) {
            res
              .status(200)
              .send({ status: "success", data: dbResponse, body: req?.body });
          } else {
            res.status(200).send({ status: "failed", message: err?.message });
          }
        }
      );
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getChallengesPaginate: async (req, res) => {
    try {
      var {
        limit = 10,
        page = 1,
        category,
        is_deleted = false,
        user_id,
        _id,
      } = req?.body;
      var query = category
        ? { category_id: { $in: category }, is_deleted: is_deleted }
        : _id
        ? { is_deleted: is_deleted, _id: _id }
        : user_id
        ? { created_by: user_id }
        : { is_deleted: is_deleted };

      pagination(limit, page, challengeSchema, query, (result) => {
        res.status(200).send({ status: "success", data: result });
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getChallenges: (req, res) => {
    try {
      challengeSchema.find({ ...req?.query }, (err, response) => {
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

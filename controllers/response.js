const responseSchema = require("../models/response");
const userSchema = require("../models/user");
var mongoose = require("mongoose");
const { mapSeries } = require("async");
const challengeSchema = require("../models/challenge");
const userWallet = require("../models/userWallet");

module.exports = {
  createResponse: (req, res) => {
    try {
      var _id = req?.body._id;
      var created_id = mongoose.Types.ObjectId();
      query = { _id: _id ? _id : created_id };
      console.log(req?.body);
      responseSchema?.findOneAndUpdate(
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

  // getResponses: async (req, res) => {
  //     const response = await responseSchema.aggregate([
  //         {
  //             $match: { ...req?.query },
  //         },
  //         {
  //             $addFields: {
  //                 _id: {
  //                     $toString: "$_id",
  //                 },
  //             },
  //         },
  //         {
  //             $lookup: {
  //                 from: "users",
  //                 let: { p_id: "$created_by" },
  //                 pipeline: [
  //                     {
  //                         $addFields: {
  //                             _id: {
  //                                 $toString: "$_id"
  //                             }
  //                         }
  //                     },
  //                     {
  //                         $match: {
  //                             $expr: {
  //                                 $and: [
  //                                     {
  //                                         $eq: ["$_id", "$$p_id"],
  //                                     }
  //                                 ],
  //                             },
  //                         },
  //                     },
  //                     {
  //                         $addFields: {
  //                             _id_of_user: "$_id",
  //                         },
  //                     },
  //                 ],
  //                 as: "user_details",
  //             },
  //         },
  //         {
  //             $replaceRoot: {
  //                 newRoot: {
  //                     $mergeObjects: [{ $arrayElemAt: ["$user_details", 0] }, "$$ROOT"],
  //                 },
  //             },
  //         },
  //     ]);

  //     if (response?.length > 0) {
  //         res.status(200).send({ status: "success", data: response })
  //     }
  // },

  getResponses: async (req, res) => {
    try {
      responseSchema.find({ ...req?.query }, (err, response) => {
        if (!err) {
          var dataToSend = [];

          mapSeries(
            response,
            (item, async_callback) => {
              userSchema?.find(
                { _id: item?.created_by },
                (err, responseUser) => {
                  if (!err) {
                    dataToSend = [
                      ...dataToSend,
                      { ...item?._doc, user_details: responseUser[0] },
                    ];
                    async_callback(null, null);
                  } else {
                    async_callback(null, null);
                  }
                }
              );
            },
            (err, result) => {
              if (!err) {
                res.status(200).send({ status: "success", data: dataToSend });
              } else {
                res
                  .status(200)
                  .send({ status: "failed", message: err?.message });
              }
            }
          );
        } else {
          res.status(200).send({ status: "failed", message: err?.message });
        }
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  makeWinner: async (req, res) => {
    try {
      var { response_id } = req?.body;
      responseSchema?.findOneAndUpdate(
        { _id: response_id },
        { is_winner: true },
        { new: true },
        (err, response) => {
          if (!err) {
            challengeSchema?.findOneAndUpdate(
              { _id: response?.challenge_id },
              {
                winner: { created_by: response?.created_by, response_id },
              },
              { new: true },
              async (err, challengeResponse) => {
                if (!err) {
                  var joiningAmount = challengeResponse?.joining_amount;
                  var responseCount = await responseSchema
                    ?.find({ challenge_id: challengeResponse?._id })
                    ?.countDocuments();
                  var existingWallet = await userWallet?.findOne(
                    { user_id: response?.created_by },
                    "amount"
                  );
                  var walletAmount =
                    parseInt(existingWallet?.amount) +
                    parseInt(joiningAmount) * responseCount;
                  userWallet?.findOneAndUpdate(
                    {
                      user_id: response?.created_by,
                    },
                    { amount: walletAmount },
                    { new: true },
                    (err, walletData) => {
                      if (!err) {
                        res
                          .status(200)
                          .send({ status: "success", data: challengeResponse });
                      } else {
                        res
                          .status(200)
                          .send({ status: "failed", message: err?.message });
                      }
                    }
                  );
                } else {
                  res
                    .status(200)
                    .send({ status: "failed", message: err?.message });
                }
              }
            );
          } else {
            res.status(200).send({ status: "failed", message: err?.message });
          }
        }
      );
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },
};

const eventSchema = require("../models/event");
var mongoose = require("mongoose");
const pagination = require("../utils/pagination");
const joinEventSchema = require("../models/joinEvent");
const userSchema = require("../models/user");
const { mapSeries } = require("async");

module.exports = {
  createEvent: (req, res) => {
    try {
      var newBodyItems = ({
        _id = mongoose.Types.ObjectId(),
        category = "",
        event_name = "",
        created_by = "",
        description = "",
        event_date = new Date(),
        start_time = new Date(),
        end_time = new Date(),
        max_players = 0,
        longitude = 0,
        latitude = 0,
        address = "",
        location_hint = "",
        is_deleted = false,
      } = req?.body);

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
              category,
              created_by,
              description,
              start_time,
              end_time,
              max_players,
              address,
              location_hint,
              event_name,
              event_date,
              is_deleted,
            }
          : { ...req?.body };

      eventSchema?.findOneAndUpdate(
        { _id: _id },
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
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getEvents: (req, res) => {
    try {
      eventSchema.find({ ...req?.query }, (err, response) => {
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

  getEventsPagination: async (req, res) => {
    try {
      var {
        _id,
        limit = 500,
        page = 1,
        longitude,
        latitude,
        category,
        user_id,
        is_deleted = false,
      } = req?.body;

      var result = await eventSchema
        .aggregate([
          longitude && latitude
            ? {
                $geoNear: {
                  near: { type: "Point", coordinates: [longitude, latitude] },
                  distanceField: "calculated",
                  maxDistance: 200000,
                  includeLocs: "location",
                  query: { category: { $in: category } },
                  spherical: true,
                },
              }
            : category
            ? { $match: { category: { $in: category } } }
            : user_id
            ? { $match: { created_by: user_id } }
            : { $match: { _id: { $exists: true } } },
          { $match: { is_deleted } },
          {
            $lookup: {
              from: "categories",
              let: { p_id: "$category" },
              pipeline: [
                { $addFields: { _id: { $toString: "$_id" } } },
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$_id", "$$p_id"],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "category_details",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  { $arrayElemAt: ["$category_details", 0] },
                  "$$ROOT",
                ],
              },
            },
          },
          { $limit: limit },
          { $skip: (page - 1) * limit },
        ])
        .sort("-createdAt");
      var totalPages;
      var allData = await eventSchema.find({});
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

  joinEvent: async (req, res) => {
    try {
      var event_id = req?.body?.event_id;
      var user_id = req?.body?.user_id;
      var event = await eventSchema.findOne({ _id: event_id });
      console.log(event);
      var maxPlayersLimit = parseInt(event?.max_players);
      var allEvents = await joinEventSchema.find({ event_id });
      console.log(maxPlayersLimit);
      console.log(allEvents?.length, "ev");

      if (maxPlayersLimit <= allEvents?.length) {
        res.status(200).send({
          status: "failed",
          message: `Players more than ${maxPlayersLimit} not allowed`,
        });
      } else {
        joinEventSchema.create(
          { event_id: event_id, user_id: user_id },
          (err, response) => {
            if (!err) {
              res.status(200).send({ status: "success", data: response });
            } else {
              res.status(200).send({ status: "failed", message: err?.message });
            }
          }
        );
      }
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getEventJoins: async (req, res) => {
    try {
      joinEventSchema.find({ ...req?.query }, (err, response) => {
        if (!err) {
          var dataToSend = [];

          mapSeries(
            response,
            (item, async_callback) => {
              userSchema?.find({ _id: item?.user_id }, (err, responseUser) => {
                if (!err) {
                  dataToSend = [
                    ...dataToSend,
                    { ...item?._doc, user_details: responseUser[0] },
                  ];
                  async_callback(null, null);
                } else {
                  async_callback(null, null);
                }
              });
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

  leaveEvent: (req, res) => {
    try {
      var event_id = req?.query?.event_id;
      var user_id = req?.query?.user_id;
      joinEventSchema.findOneAndDelete(
        { event_id: event_id, user_id: user_id },
        (err, response) => {
          if (!err) {
            res.status(200).send({ status: "success", data: response });
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

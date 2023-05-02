const storeSchema = require('../models/store');
var mongoose = require('mongoose');
const userSchema = require('../models/user');
const { mapSeries } = require('async');
const storeRouter = require('../routes/store');
const { uploadFile } = require('../utils/uploadFile');
const dateForFilename = require('../utils/dateForFilename');
const createFileExtension = require('../utils/createFileExtension');

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
        is_deleted = false,
      } = req?.body);

      if (
        !_id &&
        (!store_name ||
          !longitude ||
          !latitude ||
          !address ||
          !website_url ||
          !imageFile)
      ) {
        res
          .status(200)
          .send({ status: 'failed', message: 'All fields are required' });
        return;
      }

      if (imageFile) {
        var filename = dateForFilename();
        var fileExtension = createFileExtension(imageFile?.name);
      }

      console.log(req.body, 'lakajagag');

      const addToDatabase = (url) => {
        var imageQuery = url ? { image: url } : {};
        var query =
          latitude && longitude
            ? {
                location:
                  longitude && latitude
                    ? {
                        type: 'Point',
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
              res.status(200).send({ status: 'success', data: response });
            } else {
              res.status(200).send({ status: 'failed', message: err?.message });
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
            res.status(200).send({ status: 'failed', message: err?.message });
          }
        );
      }
    } catch (err) {
      res.status(200).send({ status: 'failed', message: err?.message });
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
      console.log(req?.body, 'req?.bodyreq?.body');

      var categoryQuery =
        category?.length > 0 ? { query: { category: { $in: category } } } : {};

      var result = await storeSchema
        .aggregate([
          longitude && latitude
            ? {
                $geoNear: {
                  near: { type: 'Point', coordinates: [longitude, latitude] },
                  distanceField: 'calculated',
                  maxDistance: 200000,
                  includeLocs: 'location',
                  ...categoryQuery,
                  spherical: true,
                },
              }
            : {
                $addFields: {
                  _id: {
                    $toString: '$_id',
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
        .sort('-createdAt');
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
        status: 'success',
        data: {
          limit: limit,
          page: page,
          totalPages: totalPages,
          data: result,
        },
      });
    } catch (err) {
      res.status(200).send({ status: 'failed', message: err?.message });
    }
  },
  getStoreById: async (req, res) => {
    const id = req.params.id;
    const query = { _id: id };
    try {
      const stores = await storeSchema.findOne(query);
      if (stores.length === 0) {
        return res
          .status(404)
          .json({ message: 'No events found for this user and category' });
      }
      res.status(200).send({ status: 'success', data: stores });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  // new api start from here  for store
  slotBooking: async (req, res) => {
    try {
      const { storeId, date, start, end, userId, sportId } = req.body;
      const sport = await storeSchema.findOne({ _id: storeId });
      if (!sport) {
        return res.status(404).json({ message: 'Sport not found' });
      }
      const sportData = sport.sports.filter((item) => item._id == sportId);
      const slot = sportData[0].timing.find(
        (t) => new Date(t.date).getTime() === new Date(date).getTime()
      );
      const availableSlots = slot.slots.find(
        (t) => t.start === start && t.end === end
      );
      if (!availableSlots) {
        return res.status(404).json({ message: 'Slot not found' });
      }
      if (availableSlots.booked) {
        return res.status(400).json({ message: 'Slot already booked' });
      }
      const booking = {
        user_id: userId,
        timing: { start_time: start, end_time: end },
        created_on: new Date(),
        date,
        id: new mongoose.Types.ObjectId().toString(),
        duration: `${availableSlots.start}-${availableSlots.end}`,
        sport_id: sportId,
      };
      availableSlots.booked = true;
      availableSlots.bookingId = booking._id;
      sport.bookings.push(booking);
      await sport.save();
      return res
        .status(201)
        .json({ message: 'Booking created successfully', booking });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  addStore: async (req, res) => {
    console.log(req.body);
    try {
      const {
        store_name,
        description,
        website_url,
        host_id,
        latitude,
        longitude,
        address,
        image,
      } = req.body;

      const store = new storeSchema({
        store_name,
        description,
        website_url,
        host_id,
        latitude,
        longitude,
        address,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        image,
      });

      await store.save();
      res.status(200).send({ status: 'success', data: store });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  createSport: async (req, res) => {
    try {
      const storeId = req.params.storeId;
      const store = await storeSchema.findById(storeId);
      if (!store) {
        return res.status(404).send({ message: 'Store not found' });
      }
      const sport = req.body;
      store.sports.push(sport);
      await store.save();
      res.status(201).send({ status: 'success', data: sport });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  },
};

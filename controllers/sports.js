const Sport = require('../models/sports');
// define the getSport_list endpoint
module.exports = {
  getSportList: async (req, res) => {
    try {
      const arena_id = req.query.arena_id;
      // query the database for the sports with the specified arena_id
      const sports = await Sport.find({ arena_id });
      // return the sports in the response
      res.json({ Sports: sports });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  },
};

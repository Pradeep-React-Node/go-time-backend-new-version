module.exports = (limit, page, schema, query, callback) => {
  schema
    .find(query, "-password")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec(async (err, result) => {
      var totalPages;
      var allData = await schema.find({ ...query });
      if (limit >= allData?.length) {
        totalPages = 1;
      } else {
        var tempPage = allData?.length / limit;
        var decimal = tempPage - Math.floor(tempPage);
        totalPages = tempPage - decimal + 1;
      }
      if (err) return err?.message;
      else
        return callback({
          limit: limit,
          page: page,
          totalPages: totalPages,
          data: result,
        });
    });
};

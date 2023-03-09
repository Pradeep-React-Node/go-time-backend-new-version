const userWalletSchema = require("../models/userWallet");

module.exports = {
  updateWallet: async (req, res) => {
    try {
      var { amountToDeduct, _id } = req?.body;
      console.log(amountToDeduct, _id, "pid");
      if (!amountToDeduct === 0 && !_id && (!amountToDeduct || !_id)) {
        res
          .status(200)
          .send({ status: "failed", message: "All Fields are required" });
        return;
      }
      var existingWalletAmount = await userWalletSchema?.findOne(
        { _id },
        "amount"
      );
      var finalAmount =
        parseInt(existingWalletAmount?.amount) - parseInt(amountToDeduct);
      userWalletSchema?.findOneAndUpdate(
        { _id },
        { amount: finalAmount?.toString() },
        { new: true },
        (err, result) => {
          if (!err) {
            res.status(200).send({ status: "success", data: result });
          } else {
            res.status(200).send({ status: "failed", message: err?.message });
          }
        }
      );
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  getWallet: (req, res) => {
    try {
      userWalletSchema?.find(req?.query, (err, dbResponse) => {
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
};

var userSchema = require("../models/user");
var CryptoJS = require("crypto-js");
const sendMail = require("../utils/sendMail");
const mailCopies = require("../utils/mailCopies");

module.exports = {
  changeUserPassword: async (req, res) => {
    const _id = req?.body?._id;
    const type = req?.body?.type;
    console.log(type, "myType");
    const old_pass = req?.body?.old_pass;
    const new_pass = req?.body?.new_pass;
    const confirm_new_pass = req?.body?.confirm_new_pass;

    if (!_id) {
      res.status(200).send({ status: "failed", message: "_id is required" });
    }

    if (old_pass || type === "Reset") {
      userSchema.findOne({ _id }, (err, user) => {
        var decrypted = CryptoJS.AES.decrypt(
          user?.password,
          process.env.ENCRYPT_KEY
        );
        original_password = decrypted.toString(CryptoJS.enc.Utf8);
        if (original_password === old_pass || type === "Reset") {
          if (new_pass) {
            if (confirm_new_pass) {
              if (new_pass === confirm_new_pass) {
                var cipher = CryptoJS.AES.encrypt(
                  new_pass,
                  process.env.ENCRYPT_KEY
                );
                var hashedPassword = cipher.toString();
                userSchema.findOneAndUpdate(
                  { _id },
                  { password: hashedPassword, is_password_reset: true },
                  { new: true },
                  async (err, updated) => {
                    if (!err) {
                      var subject = `Alert: Password ${
                        type === "Reset" ? "resetted" : "changed"
                      }`;
                      var sent = await sendMail(
                        { _id },
                        subject,
                        type === "Reset"
                          ? mailCopies?.resetPassword
                          : mailCopies?.changePassword
                      );
                      if (sent === true) {
                        res.status(200).send({
                          status: "success",
                          message: "Password has been changed successfully",
                          data: updated,
                        });
                      } else {
                        res.status(200).send({
                          status: "failed",
                          message: sent?.err?.message,
                        });
                      }
                    }
                  }
                );
              } else {
                res.status(200).send({
                  status: "failed",
                  message: "Th two passwords does not match !",
                });
              }
            } else {
              res.status(200).send({
                status: "failed",
                message: "Password confirmation is required",
              });
            }
          } else {
            res
              .status(200)
              .send({ status: "failed", message: "New password is required" });
          }
        } else {
          res
            .status(200)
            .send({ status: "failed", message: "Old password is Incorrect" });
        }
      });
    } else {
      res
        .status(200)
        .send({ status: "failed", message: "Old password is required" });
    }
  },
};

var CryptoJS = require("crypto-js");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const { sendOtp } = require("../utils/mailCopies");
const verificationSchema = require("../models/verification");

module.exports = {
  login: async (req, res) => {
    try {
      var user = await userSchema.findOne({ email: req.body?.email });
      if (!user) {
        res.status(200).send({
          status: "failed",
          message: "Email or Password doesn't match!!",
        });
        return;
      }
      if (user?.status === "Active") {
        if (
          req?.body?.login_type === "Google" ||
          req?.body?.login_type === "Facebook"
        ) {
          const user_details = await userSchema.findOne({
            email: req?.body?.email,
          });
          var token = jwt.sign(
            { _id: user_details?._id },
            process.env.ENCRYPT_KEY
          );
          const logged_in = await userSchema.updateOne(
            { email: req.body?.email },
            { is_logged_in: true, token: token }
          );
          if (logged_in.ok == 1) {
            res.status(200).send({
              status: "success",
              data: { user_details: { ...user?._doc }, token: token },
            });
          } else {
            res.status(200).send({
              status: "failed",
              message: "Unable to log you In. Please check your fields again",
            });
          }
        } else {
          // Checking if passwords are matching or no
          var decrypted = CryptoJS.AES.decrypt(
            user?.password,
            process.env.ENCRYPT_KEY
          );

          original_password = decrypted.toString(CryptoJS.enc.Utf8);
          console.log(original_password, req.body, "req.body");
          if (original_password !== req.body?.password) {
            res.status(200).send({
              status: "failed",
              message: "Email or Password doesn't match!!!",
            });
          } else {
            const user_details = await userSchema.findOne({
              email: req?.body?.email,
            });
            var token = jwt.sign(
              { _id: user_details?._id },
              process.env.ENCRYPT_KEY
            );
            const logged_in = await userSchema.updateOne(
              { email: req.body?.email },
              { is_logged_in: true, token: token }
            );
            if (logged_in.ok == 1) {
              res.status(200).send({
                status: "success",
                data: { user_details: { ...user?._doc }, token: token },
              });
            } else {
              res.status(200).send({
                status: "failed",
                message: "Unable to log you In. Please check your fields again",
              });
            }
          }
        }
      } else {
        res
          .status(200)
          .send({ status: "failed", message: "Account is not Active" });
      }
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  logout: async (req, res) => {
    try {
      const email = req.query?.email;
      const user = await userSchema.updateOne(
        { email },
        { is_logged_in: false }
      );
      if (user) {
        res
          .status(200)
          .send({ status: "success", message: "Logged out successfully" });
      } else {
        res.status(200).send({ status: "failed", message: "Can't Log out" });
      }
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },

  generateOtp: async (req, res) => {
    try {
      var otp = Math.floor(100000 + Math.random() * 900000);
      var email = req?.body?.email;
      var user_id;
      if (!email) {
        res
          .status(200)
          .send({ status: "failed", message: "Email is required" });
        return;
      }
      console.log(email, "mahEmail");
      var userData = await userSchema.find({ email });
      console.log(userData, "uset");

      if (userData?.length > 0) {
        user_id = userData[0]?._id;
      } else {
        res.status(200).send({
          status: "failed",
          message: "Please enter valid email address",
        });
        return;
      }

      verificationSchema.findOneAndUpdate(
        { user_id },
        { otp: otp?.toString(), expired: false },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        async (err, response) => {
          if (!err) {
            var subject = "Verfication: Change password";
            var sent = await sendMail({ _id: user_id }, subject, sendOtp);
            if (sent === true) {
              res.status(200).send({ status: "success", data: response });
            } else {
              res.status(200).send({
                status: "failed",
                message: "Please enter valid email address",
              });
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

  verifyOtp: (req, res) => {
    try {
      var otp = req?.query?.otp;
      var user_id = req?.query?.user_id;
      console.log(otp, user_id, "gggg");
      if (!user_id || !otp) {
        res
          .status(200)
          .send({ status: "failed", message: "All fields are required" });
        return;
      }
      verificationSchema.findOne({ user_id }, (err, response) => {
        if (!err) {
          console.log(response);
          if (response?.otp === otp) {
            if (response?.expired) {
              res
                .status(200)
                .send({ status: "failed", message: "OTP has been expired" });
              return;
            }

            if (
              response?.updatedAt?.getTime() + 300000 <
              new Date()?.getTime()
            ) {
              res
                .status(200)
                .send({ status: "failed", message: "Verification Timeout" });
            } else {
              verificationSchema?.findOneAndUpdate(
                { user_id },
                { expired: true },
                { new: true },
                (err, dbResponse) => {
                  console.log(dbResponse);
                  if (!err) {
                    res.status(200).send({
                      status: "success",
                      data: dbResponse,
                      message: "Verfication successful",
                    });
                  }
                }
              );
            }
          } else {
            res.status(200).send({ status: "failed", message: "Invalid OTP" });
          }
        } else {
          res.status(200).send({ status: "failed", message: err?.message });
        }
      });
    } catch (err) {
      res.status(200).send({ status: "failed", message: err?.message });
    }
  },
};

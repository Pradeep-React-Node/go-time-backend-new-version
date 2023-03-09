const verificationSchema = require("../models/verification");

module.exports = {
  sendOtp: async (userDetails) => {
    var response = await verificationSchema.findOne({
      user_id: userDetails?._id,
    });
    console.log(response, "res");
    if (response?.otp) {
      return `Hello ${userDetails?.full_name},\nYour verification OTP is ${response?.otp}\nNote: This OTP is valid for 5 minutes`;
    } else {
      return { err: "OTP doesn't exists" };
    }
  },
  changePassword: (userDetails) => {
    return `Hello ${userDetails?.full_name},\nYour password has been changed successfully`;
  },
  resetPassword: (userDetails) =>
    `Hello ${userDetails?.full_name},\nYour password has been resetted`,
};

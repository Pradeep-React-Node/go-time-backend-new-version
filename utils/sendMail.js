var nodemailer = require("nodemailer");
var userSchema = require("../models/user");

module.exports = async (query, subject, contentFunc, otherParams) => {
  try {
    console.log(otherParams, "myQ");
    var content;
    var userDetails = await userSchema.findOne(query);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onlyfortesting017@gmail.com",
        pass: "hjolzreniqcdjayx",
      },
    });

    if (otherParams) {
      content = await contentFunc(userDetails, otherParams);
    } else {
      content = await contentFunc(userDetails);
    }
    console.log(content, "cont");

    if (content?.err) {
      return { err: content?.err };
    }

    var mailOptions = {
      from: "aryandeveloper17@gmail.com",
      to: userDetails?.email,
      subject: subject,
      text: content,
    };

    var info = await transporter.sendMail(mailOptions);
    if (info.response) {
      return true;
    } else {
      return { err: "Mail doesn't sent" };
    }
  } catch (err) {
    console.log(err, "err");
    return { err: err };
  }
};

const mongoose = require("mongoose");

mongoose
    .connect(process.env.GO_TIME_DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongodb connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

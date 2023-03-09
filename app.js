const serverless = require('serverless-http');
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./config/db_config');
const cors = require('cors');
const upload = require('express-fileupload');
const categoryRouter = require('./routes/category');
const avatarRouter = require('./routes/avatar');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const eventRouter = require('./routes/event');
const challengeRouter = require('./routes/challenge');
const responseRouter = require('./routes/response');
const fileUploadRouter = require('./routes/fileUpload');
const arenaRouter = require('./routes/arena');
const bookingRouter = require('./routes/booking');
const sportsRouter = require('./routes/sports');
const app = express();
const CryptoJS = require('crypto-js');
const walletRouter = require('./routes/wallet');
const paymentRouter = require('./routes/payment');
const storeRouter = require('./routes/store');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());

app.use(upload());

app.use('/api/arena', arenaRouter);

app.use('/api/booking', bookingRouter);

app.use('/api/sport', sportsRouter);

app.use('/api/category', categoryRouter);

app.use('/api/avatar', avatarRouter);

app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

app.use('/api/event', eventRouter);

app.use('/api/challenge', challengeRouter);

app.use('/api/response', responseRouter);

app.use('/api/upload', fileUploadRouter);

app.use('/api/user/wallet', walletRouter);

app.use('/api/payment', paymentRouter);

app.use('/api/store', storeRouter);

// var decrypted = CryptoJS.AES.decrypt(
//     "U2FsdGVkX19rVqorCIjRofBCXhXvrJv1FbI9EPIPngNj6wQY69xD9SgjKS4/uBW8BqOMFGTsaVWExsNBP/Sk4w==",
//     process.env.ENCRYPT_KEY
// );

// original_password = decrypted.toString(CryptoJS.enc.Utf8);
// console.log(original_password, "orgp");
// set port, listen for requests

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports.handler = serverless(app);

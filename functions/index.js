const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const imageRoute = require("./routes/image");
const bookingRoute = require("./routes/booking");
const feedbackRoute = require("./routes/feedback");

const app = express();

app.use(cors());

app.use("/image", imageRoute);

app.use("/booking", bookingRoute);

app.use("/feedback", feedbackRoute);

exports.api = functions.region("asia-south1").https.onRequest(app);

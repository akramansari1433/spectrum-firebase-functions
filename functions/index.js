const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const imageRoute = require("./routes/image");
const bookingRoute = require("./routes/booking");
const feedbackRoute = require("./routes/feedback");
const adminRoute = require("./routes/admin");
const productRoute = require("./routes/product");
const rentRoute = require("./routes/rent");

const app = express();

app.use(cors());

app.use("/image", imageRoute);

app.use("/booking", bookingRoute);

app.use("/feedback", feedbackRoute);

app.use("/product", productRoute);

app.use("/rent", rentRoute);

app.use("/admin", adminRoute);

exports.api = functions.region("asia-south1").https.onRequest(app);

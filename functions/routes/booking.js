const express = require("express");
const { db } = require("../utils/admin");

const router = express.Router();

//book photoshoot
router.post("/photoshoot", (req, res) => {
   const photoshoot = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      category: req.body.category,
   };

   db.doc(`/photoshoots/${photoshoot.date.split("-").join("")}`)
      .get()
      .then((doc) => {
         if (doc.exists) {
            return res
               .status(400)
               .json({ error: "This date is already booked." });
         } else {
            db.collection("photoshoots")
               .doc(photoshoot.date.split("-").join(""))
               .set(photoshoot)
               .then(() => {
                  res.json({ message: "Photoshoot booked successfully" });
               });
         }
      });
});

//get all photoshoot
router.get("/getPhotoshoots", (req, res) => {
   db.collection("photoshoots")
      .orderBy("date", "desc")
      .get()
      .then((data) => {
         let photoshoots = [];
         data.forEach((doc) => {
            photoshoots.push({
               photoshootId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(photoshoots);
      })
      .catch((err) => console.log(err));
});

//delete photoshoot
router.delete("/photoshoot/:photoshootId", (req, res) => {
   const photoshoot = db.doc(`/photoshoots/${req.params.photoshootId}`);

   photoshoot
      .get()
      .then((doc) => {
         if (doc.exists) {
            photoshoot.delete();
            return res.json({ message: "Photoshoot deleted successfully." });
         } else {
            return res.json({ error: "Photoshoot not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

//book studio
router.post("/studio", (req, res) => {
   const booking = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
   };

   db.doc(`/studio/${booking.date.split("-").join("")}`)
      .get()
      .then((doc) => {
         if (doc.exists) {
            return res
               .status(400)
               .json({ error: "This date is already booked." });
         } else {
            db.collection("studio")
               .doc(booking.date.split("-").join(""))
               .set(booking)
               .then(() => {
                  res.json({ message: "Studio booked successfully" });
               });
         }
      });
});

//get all studio bookings
router.get("/getStudioBookings", (req, res) => {
   let bookings = [];
   db.collection("studio")
      .orderBy("date", "desc")
      .get()
      .then((data) => {
         data.forEach((doc) => {
            bookings.push({
               bookingId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(bookings);
      })
      .catch((err) => console.log(err));
});

//delete studio booking
router.delete("/studio/:bookingId", (req, res) => {
   const booking = db.doc(`/studio/${req.params.bookingId}`);

   booking
      .get()
      .then((doc) => {
         if (doc.exists) {
            booking.delete();
            return res.json({ message: "Booking deleted successfully." });
         } else {
            return res.json({ error: "Booking not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

module.exports = router;

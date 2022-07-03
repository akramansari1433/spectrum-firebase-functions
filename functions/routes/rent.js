const express = require("express");
const { db } = require("../utils/admin");
const { sendMail } = require("../utils/sendEmail");

const router = express.Router();

//book photoshoot
router.post("/", (req, res) => {
   const rentDetail = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      days: req.body.days,
      equipment: req.body.equipment,
      paymentId: req.body.paymentId,
      amount: req.body.amount,
   };

   db.collection("rent")
      .add(rentDetail)
      .then(() => {
         res.json({ message: "Product booked successfully" });
         sendMail(rentDetail);
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

//get all photoshoot
router.get("/getRents", (req, res) => {
   db.collection("rent")
      .orderBy("date", "desc")
      .get()
      .then((data) => {
         let rents = [];
         data.forEach((doc) => {
            rents.push({
               rentId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(rents);
      })
      .catch((err) => console.log(err));
});

//delete photoshoot
router.delete("/:rentId", (req, res) => {
   const rent = db.doc(`/rent/${req.params.rentId}`);

   rent
      .get()
      .then((doc) => {
         if (doc.exists) {
            rent.delete();
            return res.json({ message: "Rent deleted successfully." });
         } else {
            return res.json({ error: "Details not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

module.exports = router;

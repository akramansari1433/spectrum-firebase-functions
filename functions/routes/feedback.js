const express = require("express");
const { db } = require("../utils/admin");

const router = express.Router();

router.post("/", (req, res) => {
   const feedback = {
      message: req.body.message,
      name: req.body.name,
   };

   db.collection("feedbacks")
      .add(feedback)
      .then(() => {
         res.json({ message: "Feedback submitted successfully." });
      })
      .catch((err) => {
         console.log(err);
      });
});

//get all feedbacks
router.get("/getFeedbacks", (req, res) => {
   db.collection("feedbacks")
      .get()
      .then((data) => {
         let feedbacks = [];
         data.forEach((doc) => {
            feedbacks.push({
               feedbackId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(feedbacks);
      })
      .catch((err) => console.log(err));
});

//delete feedback
router.delete("/:feedbackId", (req, res) => {
   const feedback = db.doc(`/feedbacks/${req.params.feedbackId}`);

   feedback
      .get()
      .then((doc) => {
         if (doc.exists) {
            feedback.delete();
            return res.json({ message: "Feedback deleted successfully." });
         } else {
            return res.json({ error: "Feedback not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

module.exports = router;

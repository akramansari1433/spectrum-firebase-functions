const express = require("express");
const { db } = require("../utils/admin");

const router = express.Router();

//login
router.post("/login", (req, res) => {
   db.collection("admin")
      .get()
      .then((data) => {
         data.forEach((doc) => {
            if (
               doc.data().username === req.body.username &&
               doc.data().password === req.body.password
            ) {
               return res.json({ message: "Login successfull!" });
            } else {
               return res
                  .status(400)
                  .json({ error: "Invalid username or password." });
            }
         });
      })
      .catch((err) => console.log(err));
});

module.exports = router;

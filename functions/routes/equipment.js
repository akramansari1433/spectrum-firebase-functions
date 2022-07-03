const express = require("express");
const { config } = require("../utils/configs");
const { admin, db } = require("../utils/admin");

const router = express.Router();

//add equipments
router.post("/add", (req, res) => {
   const BusBoy = require("busboy");
   const path = require("path");
   const os = require("os");
   const fs = require("fs");

   let imageFileName;
   let imageToBeUploaded = {};
   let formData = {};

   const busboy = new BusBoy({ headers: req.headers });
   busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (
         mimetype !== "image/jpeg" &&
         mimetype !== "image/png" &&
         mimetype !== "image/jpg"
      ) {
         return res.status(400).json({ error: "Wrong file type submitted." });
      }

      const imageExtension =
         filename.split(".")[filename.split(".").length - 1];
      imageFileName = `${Math.round(
         Math.random() * 1000000
      )}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
   });
   busboy.on(
      "field",
      (
         fieldname,
         val,
         fieldnameTruncated,
         valTruncated,
         encoding,
         mimetype
      ) => {
         formData[fieldname] = val;
      }
   );
   busboy.on("finish", () => {
      admin
         .storage()
         .bucket()
         .upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
               contentType: imageToBeUploaded.mimetype,
            },
         })
         .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            const equipment = {
               ...formData,
               imageUrl,
            };
            return db.collection("equipment").add(equipment);
         })
         .then(() => {
            return res.json({ message: "Equipment added successfully!" });
         })
         .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
         });
   });
   busboy.end(req.rawBody);
});

//get all equipment
router.get("/getEquipments", (req, res) => {
   db.collection("equipment")
      .get()
      .then((data) => {
         let equipments = [];
         data.forEach((doc) => {
            equipments.push({
               equipmentId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(equipments);
      })
      .catch((err) => console.log(err));
});

//delete equipment
router.delete("/:equipmentId", (req, res) => {
   const equipment = db.doc(`/equipment/${req.params.equipmentId}`);

   equipment
      .get()
      .then((doc) => {
         if (doc.exists) {
            equipment.delete();
            return res.json({ message: "Equipment deleted successfully." });
         } else {
            return res.json({ error: "Equipment not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

//update availability
router.post("/updateAvailabilty/:equipmentId", (req, res) => {
   const equipment = db.doc(`/equipment/${req.params.equipmentId}`);

   equipment
      .update({ available: req.body.available })
      .then(() => {
         return res.json({ message: "Updated successfully!" });
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

module.exports = router;

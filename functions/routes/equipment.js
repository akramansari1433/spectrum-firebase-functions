const express = require("express");
const { config } = require("../utils/configs");
const { admin, db } = require("../utils/admin");

const router = express.Router();

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
            return res.json({ message: "Image uploaded successfully!" });
         })
         .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
         });
   });
   busboy.end(req.rawBody);
});

module.exports = router;

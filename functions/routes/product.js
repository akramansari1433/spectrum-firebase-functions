const express = require("express");
const { config } = require("../utils/configs");
const { admin, db } = require("../utils/admin");

const router = express.Router();

//add products
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
            const product = {
               ...formData,
               imageUrl,
            };
            return db.collection("product").add(product);
         })
         .then(() => {
            return res.json({ message: "Product added successfully!" });
         })
         .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
         });
   });
   busboy.end(req.rawBody);
});

//get all products
router.get("/getProducts", (req, res) => {
   db.collection("product")
      .get()
      .then((data) => {
         let products = [];
         data.forEach((doc) => {
            products.push({
               productId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(products);
      })
      .catch((err) => console.log(err));
});

//delete equipment
router.delete("/:productId", (req, res) => {
   const product = db.doc(`/product/${req.params.productId}`);

   product
      .get()
      .then((doc) => {
         if (doc.exists) {
            product.delete();
            return res.json({ message: "Product deleted successfully." });
         } else {
            return res.json({ error: "Product not found." });
         }
      })
      .catch((err) => {
         console.log(err);
         return res.status(500).json({ error: err.code });
      });
});

//update availability
router.post("/updateAvailabilty/:productId", (req, res) => {
   const product = db.doc(`/product/${req.params.productId}`);

   product
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

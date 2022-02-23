const express = require("express");
const config = require("../utils/configs");
const { admin, db } = require("../utils/admin");

const uploadImage = (req, res, cat) => {
   const BusBoy = require("busboy");
   const path = require("path");
   const os = require("os");
   const fs = require("fs");

   let imageFileName;
   let imageToBeUploaded = {};

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
            return db.collection(cat).add({ Image: imageUrl });
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
};

const router = express.Router();

router.post("/uploadWedding", (req, res) => {
   uploadImage(req, res, "wedding");
});

router.post("/uploadPreWedding", (req, res) => {
   uploadImage(req, res, "prewedding");
});

router.post("/uploadFashion&Portrait", (req, res) => {
   uploadImage(req, res, "fashion&portrait");
});

router.post("/uploadBaby", (req, res) => {
   uploadImage(req, res, "baby");
});

router.post("/uploadProduct", (req, res) => {
   uploadImage(req, res, "product");
});

//get wedding images
router.get("/getWeddings", (req, res) => {
   db.collection("wedding")
      .get()
      .then((data) => {
         let images = [];
         data.forEach((doc) => {
            images.push({
               imageId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(images);
      })
      .catch((err) => console.log(err));
});

//get pre-wedding images
router.get("/getPreWeddings", (req, res) => {
   db.collection("prewedding")
      .get()
      .then((data) => {
         let images = [];
         data.forEach((doc) => {
            images.push({
               imageId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(images);
      })
      .catch((err) => console.log(err));
});

//get fashion&portrait images
router.get("/getfashion&portraits", (req, res) => {
   db.collection("fashion&portrait")
      .get()
      .then((data) => {
         let images = [];
         data.forEach((doc) => {
            images.push({
               imageId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(images);
      })
      .catch((err) => console.log(err));
});

//get babyt images
router.get("/getbabies", (req, res) => {
   db.collection("baby")
      .get()
      .then((data) => {
         let images = [];
         data.forEach((doc) => {
            images.push({
               imageId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(images);
      })
      .catch((err) => console.log(err));
});

//get product images
router.get("/getProducts", (req, res) => {
   db.collection("product")
      .get()
      .then((data) => {
         let images = [];
         data.forEach((doc) => {
            images.push({
               imageId: doc.id,
               ...doc.data(),
            });
         });
         return res.json(images);
      })
      .catch((err) => console.log(err));
});

module.exports = router;

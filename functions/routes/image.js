const express = require("express");
const { db } = require("../utils/admin");
const { uploadImage } = require("../utils/UploadImage");
const { getImages } = require("../utils/GetImages");

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

//upload makeup aishwarya
router.post("/uploadMakeup/aishwarya", (req, res) => {
   uploadImage(req, res, "makeupAishwarya");
});

//upload makeup archana
router.post("/uploadMakeup/archana", (req, res) => {
   uploadImage(req, res, "makeupArchana");
});

//upload makeup shreya
router.post("/uploadMakeup/shreya", (req, res) => {
   uploadImage(req, res, "makeupShreya");
});

//get wedding images
router.get("/getWeddings", (req, res) => {
   getImages(req, res, "wedding");
});

//get pre-wedding images
router.get("/getPreWeddings", (req, res) => {
   getImages(req, res, "prewedding");
});

//get fashion&portrait images
router.get("/getFashion&Portraits", (req, res) => {
   getImages(req, res, "fashion&portrait");
});

//get babyt images
router.get("/getBabies", (req, res) => {
   getImages(req, res, "baby");
});

//get product images
router.get("/getProducts", (req, res) => {
   getImages(req, res, "product");
});

//get makeup aishwarya
router.get("/getMakeup/aishwarya", (req, res) => {
   getImages(req, res, "makeupAishwarya");
});

//get makeup archana
router.get("/getMakeup/archana", (req, res) => {
   getImages(req, res, "makeupArchana");
});

//get makeup shreya
router.get("/getMakeup/shreya", (req, res) => {
   getImages(req, res, "makeupShreya");
});

module.exports = router;

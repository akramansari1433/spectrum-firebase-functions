const { db } = require("../utils/admin");

const getImages = (req, res, cat) => {
   db.collection(cat)
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
};

module.exports = { getImages };

var nodemailer = require("nodemailer");

const sendMail = (mailOptions) => {
   var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "spectrumphotographyandfilms@gmail.com",
         pass: "gvsimyzxvizxrfqw",
      },
   });

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log("Email sent: " + info.response);
      }
   });
};

module.exports = { sendMail };

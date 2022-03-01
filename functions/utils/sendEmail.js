var nodemailer = require("nodemailer");

const sendMail = (data) => {
   var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "spectrumphotographyandfilms@gmail.com",
         pass: "Spectrum@123",
      },
   });

   var mailOptions = {
      from: "spectrumphotographyandfilms@gmail.com",
      to: data.email,
      subject: "Booking Successfull!",
      html: `
        <div style="padding:10px;border-style: ridge">
        <h3>Your Booking was successfull.</h3>
        <p>Booking Details:</p>
        <ul>
            <li>Name: ${data.name}</li>
            <li>Email: ${data.email}</li>
            <li>Phone: ${data.phone}</li>
            <li>Date: ${data.date}</li>
        </ul>`,
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log("Email sent: " + info.response);
      }
   });
};

module.exports = { sendMail };

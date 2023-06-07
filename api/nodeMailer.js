const { text } = require('express');
const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

const details = {
    from: "",
    to: "avmansoor2023@gmail.com",
    subject: "Sending email dddddddd",
    text: "wwwwwwwwwwwwwwwwwwwwww"
};

mailTransporter.sendMail(details,(err)=>{
    if(err){
        console.log("it has an error");
    }else{
        console.log("email has send");
    }

})

// module.exports = transporter;

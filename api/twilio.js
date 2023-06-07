require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const servicesSid = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);


const sendOtpApi = (number) =>{
    
    return new Promise ((resolve, reject) =>{

        client.verify.v2.services(servicesSid)
                        .verifications
                        .create({to: `+91${number}`, channel: 'sms'})
                        .then(verification => {resolve(verification.sid)});
    })
}


const otpVerify = (otp,number) =>{
    return new Promise((resolve,reject)=>{

        client.verify.v2.services(servicesSid)
      .verificationChecks
      .create({to: `+91${number}`, code: `${otp}`})
      .then(verification_check => {resolve(verification_check.status)});
    })
}


module.exports = {
    sendOtpApi,otpVerify,
}
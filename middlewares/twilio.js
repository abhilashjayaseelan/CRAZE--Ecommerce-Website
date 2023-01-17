const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const serviceSid = process.env.TWILIO_SERVICE_SID; 

const client = require('twilio')(accountSid, authToken)

module.exports = {

// api for sending otp to the user mobile number....
    send_otp: (mobileNo) => {
        return new Promise((resolve, reject) =>{
            client.verify
            .services(serviceSid)
            .verifications
            .create({
                to : `+91${mobileNo}`,
                channel :'sms'
            })
            .then((verifications) => {
               resolve(verifications.sid)
            });
        })
        
    },
// api for verifying the otp recived by the user 
    verifying_otp :(mobileNo, otp) =>{
        return new Promise((resolve, reject) =>{
            client.verify
            .services(serviceSid)
            .verificationChecks
            .create({
                to : `+91${mobileNo}`,
                code : otp
            })
            .then((verifications) => {
               resolve(verifications)
            })
        })
    }
}
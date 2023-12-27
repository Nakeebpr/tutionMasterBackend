

const twilioAcc = process.env.TWILIO_ACCOUNT_SID
const twilioAuth = process.env.TWILIO_AUTH_TOKEN

const sendWhatsApp = async (otp, phoneNo) => {

    const accountSid = twilioAcc;
    const authToken = twilioAuth;
    const client = require('twilio')(accountSid, authToken);

    try {

        if (otp) {
            const message = client.messages
                .create({
                    from: 'whatsapp:+14155238886',
                    body: `Hello, The OTP From Tution Master Is ${otp}`,
                    to: `whatsapp:+91${phoneNo}`
                })

            return message
        }

    } catch (error) {
        throw error
    }

}

module.exports = { sendWhatsApp }
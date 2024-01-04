

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


        // wati.io

        // try {

        //     const url = 'https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=919503093882';
        //     const data = {
        //         broadcast_name: 'dsf',
        //         parameters: [{ name: 'name', value: '123' }],
        //         template_name: 'newthanks'
        //     };
        //     const headers = {
        //         'Content-Type': 'text/json',
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjEzNDRlNi01NGQ5LTQ4ZjktODc2Yy1mZjkxMTliMGY5ZGIiLCJ1bmlxdWVfbmFtZSI6InJhdXRuYWtlZWJAZ21haWwuY29tIiwibmFtZWlkIjoicmF1dG5ha2VlYkBnbWFpbC5jb20iLCJlbWFpbCI6InJhdXRuYWtlZWJAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMTEvMDIvMjAyMyAxODozNzo0MiIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRSSUFMIiwiZXhwIjoxNjk5NTc0NDAwLCJpc3MiOiJDbGFyZV9BSSIsImF1ZCI6IkNsYXJlX0FJIn0.Bk89XenqNBhYfsRofi5fsUmcjA_akg3G_ttXEPPOjBU'
        //     };

        //     axios.post(url, data, { headers })
        //         .then(response => {
        //             console.log(response.data);
        //         })
        //         .catch(error => {
        //             console.error('error:', error);
        //         });



        // } catch (error) {
        //     res.status(200).json({
        //         "response_code": "200",
        //         "message": "Something Went Wrong...",
        //         "status": "Failure"
        //     })
        // }

    } catch (error) {
        throw error
    }

}

module.exports = { sendWhatsApp }
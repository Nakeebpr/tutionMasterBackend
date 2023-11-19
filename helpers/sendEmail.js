


var nodemailer = require("nodemailer")

const fromEmail = process.env.FROM_EMAIL
const gmailPass = process.env.GMAIL_PASS


const sendEmail = async (toEmail) => {


    const min = 1000; // Smallest 4-digit number
    const max = 9999; // Largest 4-digit number
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;


    try {

        let mailTransporter = nodemailer.createTransport({
            ame: 'box5294',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: fromEmail,
                pass: gmailPass
            }
        })

        let mailDetails = {
            from: fromEmail,
            to: toEmail,
            subject: 'Tution Master Notification',
            html: `<p>Your otp is ${randomNumber}</p>`
        };

        const emailResponse = await mailTransporter.sendMail(mailDetails);
        console.log("Email sent in sendEmail");
        return { emailResponse, randomNumber };

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }














    // return randomNumber
}

module.exports = { sendEmail }
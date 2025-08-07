const axios = require('axios');
const sgMail = require('@sendgrid/mail');
/********************************************************************************
 * Function Name   : sendOTP
 * Purposes        : This function is used to send OTP
 * Creation Date   : 19-12-2024
 * Created By      : Dilip Halder
 * Update By       : 
 * Update Date     : 
 ************************************************************************************/
exports.sendOTP = async ({ senderId, phone, message }) => {
    const ApiKey    = process.env.OTPAPIKEY//'26b+uKslzUhFgUz9+OSK0uyVD0kL3WKQqwuvfzGjhIM=';
    const ClientId  = process.env.OTPCLIENTID //'c310faf3-f103-4e29-a170-a4e02940907c';
    const CompanyId = process.env.OTPCOMPANYID //'7';
    const encodedMessage = message;
    const url       = process.env.OTPURL//`https://user.digitizebirdsms.com/api/v2/SendSMS`;
    senderId = process.env.OTPSENDERID
    try {
        const response = await axios.get(url, {
            params: {
                SenderId: senderId,
                Is_Unicode: false,
                Is_Flash: true,
                Message: encodedMessage,
                MobileNumbers: phone.replace('+',''),
                ApiKey,
                ClientId,
                CompanyId
            }
        });
        
        if (response.data) {
            return { status: true, message: 'OTP sent', data: response.data };
        } else {
            return { status: false, message: 'Failed to send OTP.' };
        }
    } catch (error) {
        return { status: false, message: 'OTP not sent.', error: error.message };
    }

};
exports.sendEmail = async ({email,subject,message})=>{
    try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email, // Recipient's email
            from: process.env.MAIL_FROM_MAIL, // Your verified SendGrid email
            subject: subject,
            // text: 'This is a plain text email using SendGrid and Node.js!',
            html: message,
        };
        sgMail.send(msg).then(() => {
            console.log('Email sent successfully!');
        }).catch((error) => {
            console.error('Error sending email:', error.response ? error.response.body : error);
        });
    }catch(error){

    }
};

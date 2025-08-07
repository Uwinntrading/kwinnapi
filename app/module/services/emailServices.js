const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,  // Your Mailjet Public API Key
    process.env.MJ_APIKEY_PRIVATE  // Your Mailjet Secret API Key
  );

const sgMail = require('@sendgrid/mail');
const path = require('path');
const ejs = require('ejs');

/**********************************************************************
 * Function Name    :   sendEmail
 * Purpose          :   This function is used for sent email
 * Created By       :   Afsar Ali
 * Created Data     :   02-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
const sendMailjetEmail = async (options) => {
    try {
        const {toEmail, toName, subject, textContent, htmlContent} = options
      const request = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.SENDER_EMAIL, 
                Name: process.env.SENDER_NAME || "Info",
              },
              To: [
                {
                  Email: toEmail,
                  Name: toName,
                },
              ],
              Subject: subject,
            //   TextPart: textContent,
              HTMLPart: htmlContent,
            },
          ],
        });
        // console.log('From : ', process.env.SENDER_EMAIL)
        // console.log('To : ', toEmail)
      // console.log("Email sent response : ", request.body);
    } catch (error) {
      console.error("Error sending email : ", error);
    } finally {
        console.log('Email sent successfully');
    }
  };

/**********************************************************************
 * Function Name    :   sendEmail
 * Purposs          :   This function is used for sent email
 * Created By       :   Afsar Ali
 * Created Data     :   02-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
**********************************************************************/
const sendEmail = async function (options) {
    try {
        // console.log('EMAIL_API_KEY : ', process.env.SENDGRID_API_KEY)
        sgMail.setApiKey("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");
        const {to, subject, text, html} = options;
        const msg = {
            to: to,
            from: process.env.SENDER_EMAIL, 
            subject: subject || `K-Winn ${new Date()}`,
            ...(text?{text : text}:null),
            html: html || '',
          };
          await sgMail.send(msg);
    } catch (error) {
        return Promise.reject(error);
    } finally{
        return true;
    }
  }//End of Function

  exports.sentVerificationOTP = async function (options){
    try {
        const {email, users_name, otp} = options;
        const htmlData = {
            users_name : users_name,
            otp : otp
        }
        const templatePath = path.join(__dirname, '../../', 'page','templets', 'OTP.ejs');
        ejs.renderFile(templatePath, { htmlData }, async (err, html) => {
        if (err) {
            console.log('err',err);
            // return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "No Data Found" }));
        }
        const invoiceHtml = html;
        const mailOptions = {
            toEmail : email,
            toName : users_name,
            subject : "Your Code to Unlock the Next Step 🔑",
            htmlContent : invoiceHtml
        }
        await sendMailjetEmail(mailOptions);
        });

    } catch (error) {
        console.log('error',error);
    } finally{
        console.log('sent email')
        return true;
    }
  }
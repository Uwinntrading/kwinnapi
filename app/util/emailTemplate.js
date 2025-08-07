const moment =require('moment');
exports.otpTemplate = async ({name,otp,message,header})=>{
    try{
        return template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ececec;">
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <!-- Header with Logo -->
    <div style="background-color: #ba1454; color: #ffffff; padding: 20px; text-align: center;">
      <img src="https://k-winn.com/admin/assets/admin/image/logo.png" alt="Company Logo" style="max-height: 100px;">
      <h2 style="margin: 0; font-size: 24px;"></h2>
    </div>
    
    <!-- Body with OTP -->
    <div style="padding: 20px; text-align: center;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">Hi ${name},</h1>
      <p style="font-size: 16px; color: #333; margin: 0px 40px; line-height: 28px;">${message}:</p>
      <div style="display: inline-block; margin: 20px 0; padding: 10px 10px 10px 20px; font-size: 28px; font-weight: bold; color: #ba1454; border: 2px dashed #ba1454; border-radius: 5px; letter-spacing: 10px;">
       ${otp}
      </div>
      <p style="font-size: 16px; color: #333;">If you did not make this request, please ignore this email or contact support.</p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #ba1454; font-size: 12px; color: #ffffff;">
      © ${moment().format('YYYY')} K-Winn. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
    }catch(error){

    }
};
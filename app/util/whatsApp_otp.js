const request = require('request');

/* ********************************************************************************
* Function Name   : sentOTP
* Purposes        : This function is used to sent OTP
* Creation Date   : 06-12-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.sentOTP = async (phone_no = '') => {
    return new Promise((resolve, reject) => {
        try {
            if (phone_no === '') {
                reject({ status: false, message: 'Phone number is required.' });
            } else {
                const options = {
                    'method': 'POST',
                    'url': 'https://utility.ekodemy.in/api/otp/send',
                    'headers': {
                      'apiKey': 'RuhEcmA8XHa75dLZCpBkGFnysfPqvT2N',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "phone": `${phone_no}`,
                      "channel": [
                        "WHATSAPP"
                      ]
                    })
                };
                
                request(options, (error, response) => {
                    const result = JSON.parse(response?.body);
                    if (error) {
                        reject({ status: false, message: 'OTP not sent.' });
                    } else {
                        resolve({ status: true, message: 'OTP sent' });
                    }
                });
            }
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
};

/* ********************************************************************************
* Function Name   : getAccountLookup
* Purposes        : This function is used to verify OTP
* Creation Date   : 06-12-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.verifyOTP = async (phone_no = '', otp='') => {
    return new Promise((resolve, reject) => {
        try {
            if (phone_no === '') {
                reject({ status: false, message: 'Phone number is required.' });
            } else if(otp == ''){
                reject({ status: false, message: 'One time password (OTP) is required.' });
            } else {
                const options = {
                    'method': 'POST',
                    'url': 'https://utility.ekodemy.in/api/otp/verify',
                    'headers': {
                      'apiKey': 'RuhEcmA8XHa75dLZCpBkGFnysfPqvT2N',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "phone": `${phone_no}`,
                        "otp": `${otp}`
                      })
                };
                
                request(options, (error, response) => {
                    const result = JSON.parse(response?.body);

                    if (result.errorMessage != null) {
                        reject({ status: false, message: 'OTP not verity.' });
                    } else if(result.success == true) {
                        resolve({ status: true, message: 'OTP verify' });
                    }else{
                        reject({ status: false, message: 'OTP not verity.' });
                    }
                });
            }
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}


const request = require('request');
const axios = require('axios');
const {RECHARGE_API, RECHARGE_BASE_URL} = require('../config/constant');

/* ********************************************************************************
* Function Name   : getAccountLookup
* Purposes        : This function is used to get country and region
* Creation Date   : 30-11-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.getAccountLookup = async (phone_no = '') => {
    return new Promise((resolve, reject) => {
        try {
            if (phone_no === '') {
                reject({ status: false, message: 'Phone number is required.' });
            } else {
                const options = {
                    method: 'GET',
                    url: `${RECHARGE_BASE_URL}/GetAccountLookup?accountNumber=${phone_no}`,
                    headers: { api_key: `${RECHARGE_API}` }
                };
                
                request(options, (error, response) => {
                    const result = JSON.parse(response?.body);
                    if (error) {
                        reject({ status: false, message: error.message });
                    } else {
                        resolve({ status: true, result: result });
                    }
                });
            }
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}

/* ********************************************************************************
* Function Name   : getProvider
* Purposes        : This function is used to get provider
* Creation Date   : 30-11-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.getProvider = async (postData={}) => {
    return new Promise((resolve, reject) => {
        try {
            const {countryIsos='',regionCodes='',accountNumber=''} = postData;
            const options = {
                method: 'GET',
                url: `${RECHARGE_BASE_URL}/GetProviders?countryIsos=${countryIsos}&regionCodes=${regionCodes}&accountNumber=${accountNumber}`,
                headers: { api_key: `${RECHARGE_API}` }
            };
            request(options, (error, response) => {
                const result = JSON.parse(response?.body);
                if (error) {
                    reject({ status: false, message: error.message });
                } else {
                    resolve({ status: true, result: result });
                }
            });
        } catch (error) {
            console.log(error, error);
            reject({ status: false, message: error.message });
        }
    });
}

/* ********************************************************************************
* Function Name   : getPlans
* Purposes        : This function is used to get plans
* Creation Date   : 30-11-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.getPlans = async (postData={}) => {
    return new Promise((resolve, reject) => {
        try {
            const {countryIsos='',providerCodes='',regionCodes='',accountNumber=''} = postData;
            const options = {
                method: 'GET',
                url: `${RECHARGE_BASE_URL}/GetProducts?countryIsos=${countryIsos}&providerCodes=${providerCodes}&regionCodes=${regionCodes}&accountNumber=${accountNumber}`,
                headers: { api_key: `${RECHARGE_API}` }
            };
            
            request(options, (error, response) => {
                const result = JSON.parse(response?.body);
                if (error) {
                    reject({ status: false, message: error.message });
                } else {
                    resolve({ status: true, result: result });
                }
            });
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}

/* ********************************************************************************
* Function Name   : getPlansDetails
* Purposes        : This function is used to get all country
* Creation Date   : 03-12-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.getPlansDetails = async (postData={}) => {
    return new Promise((resolve, reject) => {
        try {
            const {skuCodes='',languageCodes='en'} = postData;
            const options = {
                method: 'GET',
                url: `${RECHARGE_BASE_URL}/GetProductDescriptions?languageCodes=${languageCodes}&skuCodes=${skuCodes}`,
                headers: { api_key: `${RECHARGE_API}` }
            };
            
            request(options, (error, response) => {
                const result = JSON.parse(response?.body);
                if (error) {
                    reject({ status: false, message: error.message });
                } else {
                    resolve({ status: true, result: result });
                }
            });
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}

/* ********************************************************************************
* Function Name   : getPlans
* Purposes        : This function is used to get plans
* Creation Date   : 30-11-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.sendTransfer = async (postData) => {
    return new Promise((resolve, reject) => {
        try {
            const {SkuCode='',SendValue='',AccountNumber='',DistributorRef='',ValidateOnly, SendCurrencyIso=''} = postData;
            const options = {
                method: 'POST',
                url: `${RECHARGE_BASE_URL}/SendTransfer`,
                headers: { 
                    'Content-Type': 'application/json',
                    'api_key': `${RECHARGE_API}`
                },
                body : JSON.stringify({
                    "SkuCode": SkuCode,
                    "SendValue": SendValue,
                    "AccountNumber": AccountNumber,
                    "DistributorRef": DistributorRef,
                    // "ValidateOnly": ValidateOnly, //Validate Only
                    "ValidateOnly": false, //Live mode
                    "SendCurrencyIso": SendCurrencyIso
                })
            };
            request(options, (error, response) => {
                const result = JSON.parse(response?.body);
                // console.log('recharge ',response?.body)
                if (error) {
                    reject({ status: false, message: error.message });
                } else {
                    if(result.ResultCode === 1 || result.ResultCode === true){
                        resolve({ status: true, result: result });
                    }else{
                        resolve({ status: false, message: JSON.stringify(result.ErrorCodes) });
                    }
                }
            });
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}

exports.sendTransferByAxios = async (postData) => {
    return new Promise((resolve, reject) => {
        try {
            const {SkuCode='',SendValue='',AccountNumber='',DistributorRef='',ValidateOnly, SendCurrencyIso=''} = postData;
            const options = {
                method: 'POST',
                url: `${RECHARGE_BASE_URL}/SendTransfer`,
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': `${RECHARGE_API}`,
                },
                data: {
                    SkuCode,
                    SendValue,
                    AccountNumber,
                    DistributorRef,
                    ValidateOnly,
                    SendCurrencyIso,
                },
            };
            
            axios(options)
                .then((response) => {
                    const result = response.data;
                    // console.log('result', result);
                    if (result.ResultCode === 1 || result.ResultCode === true) {
                        resolve({ status: true, result });
                    } else {
                        resolve({ status: false, message: JSON.stringify(result.ErrorCodes) });
                    }
                })
                .catch((error) => {
                    reject({ status: false, message: error.message });
                });
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}

/* ********************************************************************************
* Function Name   : getAllCountries
* Purposes        : This function is used to get all country
* Creation Date   : 03-12-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.getAllCountries = async () => {
    return new Promise((resolve, reject) => {
        try {
            const options = {
                method: 'GET',
                url: `${RECHARGE_BASE_URL}/GetCountries`,
                headers: { api_key: `${RECHARGE_API}` }
            };
            
            request(options, (error, response) => {
                const result = JSON.parse(response?.body);
                if (error) {
                    reject({ status: false, message: error.message });
                } else {
                    resolve({ status: true, result: result });
                }
            });
        } catch (error) {
            reject({ status: false, message: error.message });
        }
    });
}


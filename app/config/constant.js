const basePath = __basePath;

module.exports = {
    apikey : "4a1fc76a90fd7469e2d84d145e3b1eab",//Frisbee project developed by Algosoft under Afsar Ali Started on Feb-2024
    APPKEY : "d42a0d190464a2be90977c3996382811",//APP API BY ALGOSOFT DEVELOPED BY AFSAR ALI
    WEBAPIKEY : "d42a0d190464a2be90977c3996382811",//APP API BY ALGOSOFT DEVELOPED BY AFSAR ALI
    path: {
        base                        : basePath,
        app                         : basePath + 'app/',
        module                      : basePath + 'app/module/controller/',
        log                         : basePath + 'asset/log/',
        moduleV1                    : basePath + 'app/module/controller/v1/',
        lboardImg                    : '/lboard.jpg',
        faviconImg                  : '/favicon.ico'
    },
    crypto: {
        secretKey: 'DilipHalder',
        algo: 'aes-128-cbc',
        digest: 'hex',
        encoding: 'utf8',
        iv: '\x00\x01\x04\x03\x09\x05\x08\x06\x08\x07\x0a\x0b\x0c\x0d\x0f\x0f'
    },
    roles:{
        SUPERADMIN:"SUPERADMIN",
        SUBADMIN:"SUBADMIN",
        USER:"USER",
        INVESTOR:"Investor",
        COMPANY:"Company",
    },
    superadminAuthIssuerName: "SUPERADMIN",
    authTokenSuperAdminAuthExpiresIn:"365 days",
    
    subadminAuthIssuerName: "SUBADMIN",
    authTokenSubAdminAuthExpiresIn:"365 days",

    userAuthIssuerName: "USER",
    authTokenUserAuthExpiresIn:"365 days",

    investorAuthIssuerName: "Investor",
    authTokeninvestorAuthExpiresIn:"365 days",

    companyAuthIssuerName: "Company",
    authTokenCompanyAuthExpiresIn:"365 days",
    
    OtpExpiry:{
            value:1,
            duration:"minutes"
        },
    OtpRetry:{
            value:1,
            duration:"minutes"
    },
    pageLimit: 10,
    pageSkip:0,
    adminForgotPasswordPostFix: "FORGOTPASSWORD",
    userForgotPasswordPostFix: "FORGOTPASSWORD",
    USERTYPE : {
        USER        : "User",
        SUPERADMIN  : "Super Admin",
        SUBADMIN    : "Sub Admin",
        INVESTOR    : "Investor",
        COMPANY    : "Company"
    },
    PAYMENTSTATUS : {
        INITIALIZE  : "Initialize",
        FAIL        : "Fail",
        CANCEL      : "Cancel",    
        SUCCESS     : "Success",
    },
    AWSS3BUCKETCONFIG : {
        // BUCKETNAME : "frisbee-llc",
        // REGION     : "me-central-1",
        // ACCESSKEYID: "AKIAZI2LEVVL3XQQJPCV",
        // SECRETACCESSKEY : "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",
        // AWSIMAGEBASEURL : "https://frisbee-llc.s3.me-central-1.amazonaws.com/"
    },
    EMAILS_CREDENTIALS: {
        NOREPLY_EMAIL : 'afsar.algosoft@gmail.com',
        NOREPLY_PASS : 'vwnuijvmfshmgfgo'
    },
    FRONT_BASE_URL : 'https://algodev.in:61000',
    // RECHARGE_API  : 'EJFgkl8WV8j6QdeHiJTS9S',
    RECHARGE_API  : 'FPrg0DRx9xK5YSMR67rlHj',
    RECHARGE_BASE_URL  : 'https://api.dingconnect.com/api/V1'
};


const rechargeAPI = require( "../../../util/rechargeAPIs");
const countryFlag = require("../../../public/flag_json.json");
const CountryModel = require("../../../models/kw_recharge_countries");
const ProviderModel = require("../../../models/kw_recharge_providers");
const PlansModel = require('../../../models/kw_recharge_plans');
/*********************************************************************************
 * Function Name    :   getCountries
 * Purpose          :   This function is used for store all country details
 * Created By       :   Afsar Ali
 * Created Data     :   05-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.getCountries = async () => {
    try {
        const countryList = await rechargeAPI.getAllCountries();
        if(countryList.status === true){
            const dataList  = countryList?.result?.Items || [];
            const prepareData = await Promise.all(
                dataList.map(async items => {
                    const flag = await getUnicodeByName(items.CountryName);
                    return { ...items, flag };
                })
            );
            // console.log('prepareData',prepareData[0]);
            await CountryModel.deleteMany();
            await CountryModel.insertMany(prepareData);
            return true;
        }
    } catch (error) {
        console.log('error',error)
    }
}; //End of Function

const getUnicodeByName = async (name) => {
    const country = countryFlag.find(item => item.name.toLowerCase() === name.toLowerCase());
    return country ? country.unicode : '';
}
/*********************************************************************************
 * Function Name    :   getAllPlans
 * Purpose          :   This function is used for store all operator
 * Created By       :   Afsar Ali
 * Created Data     :   05-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.syncAllOperators = async () => {
    try {
        const providerList = await rechargeAPI.getProvider();
        if(providerList.status === true){
            await ProviderModel.deleteMany();
            await ProviderModel.insertMany(providerList?.result?.Items);
        }
        return true;
    } catch (error) {
        console.log('error',error)
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   syncAllPlans
 * Purpose          :   This function is used for store all plans
 * Created By       :   Afsar Ali
 * Created Data     :   05-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.syncAllPlans = async () => {
    try {
        const planList = await rechargeAPI.getPlans();
        
        if(planList.status === true){
            const list = planList?.result?.Items || [];
            if(list.length > 0){
                // console.log('list',list[0]);
                const planDetails = await rechargeAPI.getPlansDetails();
                if(planDetails.status === true){
                    const detailsList = planDetails?.result?.Items || [];
                    // console.log('detailsList',detailsList[0]);
                    const prepareData = await Promise.all(
                        list.map(async items => {
                            // console.log('key', items.SkuCode);
                            const detail = await detailsList.find(item => item.LocalizationKey === items.SkuCode);
                            return { ...items, Details : detail || {} };
                        })
                    );
                    await PlansModel.deleteMany();
                    await PlansModel.insertMany(prepareData);
                }
            }
        }else{
            console.log('else');
        }
        return true;
    } catch (error) {
        console.log('error',error)
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   testRechargeAPI
 * Purpose          :   This function is used for store all plans
 * Created By       :   Afsar Ali
 * Created Data     :   05-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.testRechargeAPI = async () => {
    try {
        const  option = {
            // skuCodes : "AXBD60842",
            languageCodes : "en"
        }
        return await rechargeAPI.getPlansDetails(option);
        // const option = {
        //     countryIsos : '',
        //     providerCodes : '',
        //     regionCodes : '',
        //     accountNumber : '8801859262729'
        // }
        // return rechargeAPI.getPlans(option);
    } catch (error) {
        console.log('error',error)
    }
}; //End of Function






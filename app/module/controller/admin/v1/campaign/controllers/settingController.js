const { getIpAddress, stringToObjectId, createSlug } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const campaignService  = require("../../../../../services/admin/v1/campaign/campaignServices");
const prizeServices    = require("../../../../../services/admin/v1/campaign/prizeServices");
const settingServices  = require("../../../../../services/admin/v1/campaign/settingServices");
const counterServices  = require("../../../../../services/counterService");
const imageHandler     = require("../../../../../../util/imageHandler");
const response         = require("../../../../../../util/response");


/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get campaign list
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.list = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;  
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { ...condition },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await settingServices.select_details(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await settingServices.select(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   addEditData
 * Purpose          :   This function is add/edit prize data
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.addEditData = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { 
            editId, 
            campaign_id, setting_type, 

            straight_game_name, straight_settings, straight_settings_default_check,
            rumble_game_name, rumble_settings, rumble_settings_default_check,
            chance_game_name, chance_settings, chance_settings_default_check,

            freezing_title, campaign_auto_freezing_mode, campaign_freezing_start_time, campaign_freezing_end_time,game_description ,manual_freezing

        } = req.body;
         
        const campaign_data = await campaignService.getCampaignById(campaign_id);
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!setting_type){
            return response.sendResponse(res, response.build('SETTING_TYPE_EMPTY', { }));
        } else if(setting_type === 'Campaign' && (!campaign_data || campaign_data?.status !== "A")){
            return response.sendResponse(res, response.build('CAMPAIGN_NOT_FOUND', { }));
        } else if(!straight_game_name){
            return response.sendResponse(res, response.build('STRAIGHT_GAME_NAME_EMPTY', { }));
        } else if(!rumble_game_name){
            return response.sendResponse(res, response.build('RUMBLE_GAME_NAME_EMPTY', { }));
        } else if(!chance_game_name){
            return response.sendResponse(res, response.build('CHANCE_GAME_NAME_EMPTY', { }));
        // } else if(!campaign_freezing_start_time){
        //     return response.sendResponse(res, response.build('FREEZING_START_TIME_EMPTY', { }));
        // } else if(!campaign_freezing_end_time){
        //     return response.sendResponse(res, response.build('FREEZING_END_TIME_EMPTY', { }));
        // } else if(!game_rule_image){
        //     return response.sendResponse(res, response.build('GAME_RULE_IMAGE_EMPTY', { }));
        // } else if(!game_description){
        //     return response.sendResponse(res, response.build('GAME_DESCRIPTION_EMPTY', { }));
        } else{
            let result = {};
            const ipAddress = await getIpAddress();
            
            let game_rule_image; 
            // if(req.file?.fieldname === 'game_rule_image'){
            //     game_rule_image = await imageHandler.upload_img(req.file,'prizes');
            // }

            const params = {
                ...(setting_type === 'Campaign' && { campaign_data : campaign_id }),
                
                straight_game_name : straight_game_name,
                ...(straight_settings? {straight_settings:straight_settings} : {straight_settings:'Disable'} ),
                ...(straight_settings_default_check? {straight_settings_default_check:straight_settings_default_check} :{ straight_settings_default_check:'Unchecked'}),
                
                rumble_game_name : rumble_game_name,
                ...(rumble_settings? {rumble_settings:rumble_settings} : {rumble_settings:'Disable'} ),
                ...(rumble_settings_default_check? {rumble_settings_default_check:rumble_settings_default_check} : {rumble_settings_default_check:'Unchecked'} ),
                
                chance_game_name : chance_game_name,
                ...(chance_settings? {chance_settings:chance_settings} : {chance_settings:'Disable'} ),
                ...(chance_settings_default_check? {chance_settings_default_check:chance_settings_default_check} : {chance_settings_default_check:'Disable'} ),
                ...(campaign_auto_freezing_mode  ? { campaign_auto_freezing_mode : campaign_auto_freezing_mode  } : {campaign_auto_freezing_mode:'Disable'} ),
                ...(campaign_freezing_start_time ? { campaign_freezing_start_time: campaign_freezing_start_time } : ''),
                ...(campaign_freezing_end_time   ? { campaign_freezing_end_time  : campaign_freezing_end_time   } : ''),
                
                freezing_title   : freezing_title,
                game_rule_image  : game_rule_image,
                game_description : game_description,
                manual_freezing  : manual_freezing

            }

            if(editId){
                const prizeData = await settingServices.getSettingById(editId);
                if(prizeData){
                    // if(prizeData !='' && game_rule_image){
                    //     await imageHandler.delete_img(prizeData.game_rule_image);
                    // }
                    const updateParam = {
                        condition : { _id : editId},
                        data : {
                            ...params,
                            update_ip : ipAddress,
                            update_by : usrId
                        }
                    }
                    result = await settingServices.updateData(updateParam);
                } else{
                    return response.sendResponse(res, response.build("PRIZE_NOT_FOUND", { }));
                }
            }else{
                const settingOption = {
                    type : "count",
                    condition : { 
                        ...(setting_type === "Global"?{setting_type : setting_type  }:{ campaign_data : campaign_id })
                    }
                }
                const settingCount = await settingServices.select(settingOption);
                

                
                if(settingCount > 0){
                    return response.sendResponse(res, response.build("SETTING_ALREADY_EXIST", { }));
                } else{
                    const seq_id = await counterServices.getSequence('kw_settings');
                    const insertParam = {
                        ...params,
                        seq_id : seq_id.seq,
                        setting_type : setting_type,
                        status : "A",
                        creation_ip : ipAddress,
                        created_by  : usrId
                    }
                    result = await settingServices.createData(insertParam);
                    if(result){
                        if(setting_type === "Campaign"){
                            const updateParam = {
                                condition : { _id : campaign_id },
                                data : { 
                                    settingData : result._id,
                                    update_ip   : ipAddress,
                                    update_by   : usrId
                                }
                            }
                            await campaignService.updateData(updateParam);
                        }
                    }
                }
            }
            return response.sendResponse(res, response.build("SUCCESS", { result}));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

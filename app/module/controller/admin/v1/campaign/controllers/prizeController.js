const response = require("../../../../../../util/response");
const { getIpAddress, stringToObjectId, createSlug } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const campaignService = require("../../../../../services/admin/v1/campaign/campaignServices");
const prizeServices = require("../../../../../services/admin/v1/campaign/prizeServices");
const imageHandler     = require("../../../../../../util/imageHandler");
const counterServices = require("../../../../../services/counterService");

/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get prize list
 * Created By       :   Afsar Ali
 * Created Data     :   15-01-2025
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
            const result = await prizeServices.select_details(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await prizeServices.select(countOption);
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
            campaign_id, enable_title, title, description, 
            image_alt, 
            enable_straight_prize_heading, straight_prize_heading, straight_shared_prize, 
            straight_prize1, straight_prize2, straight_prize3, straight_prize4, straight_prize5, straight_prize6, straight_prize7,

            enable_rumble_prize_heading, rumble_prize_heading, rumble_shared_prize, 
            rumble_prize1, rumble_prize2, rumble_prize3, rumble_prize4, rumble_prize5, rumble_prize6, rumble_prize7,

            enable_chance_prize_heading, chance_prize_heading, chance_shared_prize, 
            chance_prize1, chance_prize2, chance_prize3, chance_prize4, chance_prize5, chance_prize6, chance_prize7,
            
        } = req.body;
        const campaign_data = await campaignService.getCampaignById(campaign_id);

        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!campaign_data || campaign_data?.status !== "A"){
            return response.sendResponse(res, response.build('CAMPAIGN_NOT_FOUND', { }));
        // } else if(!image){
        //     return response.sendResponse(res, response.build('IMAGE_EMPTY', { }));
        } else{

            let image; 
            if(req.file?.fieldname === 'image'){
                image = await imageHandler.upload_img(req.file,'prizes');
            }

            let result = {};
            const ipAddress = await getIpAddress();
            const params = {
                campaign_data : campaign_id,
                description : description,
                image : image,
                image_alt: image_alt,
                lotto_type : campaign_data.lotto_type,

                enable_title : enable_title, 
                title : title,

                ...(enable_straight_prize_heading === 'Y' ? {
                    enable_straight_prize_heading : "Y", straight_prize_heading : straight_prize_heading
                }:{
                    enable_straight_prize_heading : "N",
                }),
                ...(campaign_data.straight_add_on_amount > 0 && {
                    ...(straight_shared_prize ? {straight_shared_prize :JSON.parse(straight_shared_prize)} : straight_shared_prize),
                    ...(straight_prize1 && { straight_prize1 : straight_prize1 }),
                    ...(straight_prize2 && { straight_prize2 : straight_prize2 }),
                    ...(straight_prize3 && { straight_prize3 : straight_prize3 }),
                    ...(straight_prize4 && { straight_prize4 : straight_prize4 }),
                    ...(straight_prize5 && { straight_prize5 : straight_prize5 }),
                    ...(straight_prize6 && { straight_prize6 : straight_prize6 }),
                    ...(straight_prize7 && { straight_prize7 : straight_prize7 }),  
                }),

                ...(campaign_data.rumble_add_on_amount > 0 && {
                    ...(enable_rumble_prize_heading === 'Y' ? {
                        enable_rumble_prize_heading : "Y", rumble_prize_heading : rumble_prize_heading
                    }:{
                        enable_rumble_prize_heading : "N",
                    }),
                    ...(rumble_shared_prize ? {rumble_shared_prize :JSON.parse(rumble_shared_prize)} : rumble_shared_prize),
                    ...(rumble_prize1 && { rumble_prize1 : rumble_prize1 }),
                    ...(rumble_prize2 && { rumble_prize2 : rumble_prize2 }),
                    ...(rumble_prize3 && { rumble_prize3 : rumble_prize3 }),
                    ...(rumble_prize4 && { rumble_prize4 : rumble_prize4 }),
                    ...(rumble_prize5 && { rumble_prize5 : rumble_prize5 }),
                    ...(rumble_prize6 && { rumble_prize6 : rumble_prize6 }),
                    ...(rumble_prize7 && { rumble_prize7 : rumble_prize7 }),
                }),


                ...(campaign_data.chance_add_on_amount > 0 && {
                    ...(enable_chance_prize_heading === 'Y' ? {
                        enable_chance_prize_heading : "Y", chance_prize_heading : chance_prize_heading
                    }:{
                        enable_chance_prize_heading : "N",
                    }),
                    ...(chance_shared_prize ? {chance_shared_prize :JSON.parse(chance_shared_prize)} : chance_shared_prize),
                    ...(chance_prize1 && { chance_prize1 : chance_prize1 }),
                    ...(chance_prize2 && { chance_prize2 : chance_prize2 }),
                    ...(chance_prize3 && { chance_prize3 : chance_prize3 }),
                    ...(chance_prize4 && { chance_prize4 : chance_prize4 }),
                    ...(chance_prize5 && { chance_prize5 : chance_prize5 }),
                    ...(chance_prize6 && { chance_prize6 : chance_prize6 }),
                    ...(chance_prize7 && { chance_prize7 : chance_prize7 }),
                })

            }
            
            if(editId){
                const prizeData = await prizeServices.getPrizeById(editId);
                if(prizeData){
                    if(prizeData !='' && image){
                        await imageHandler.delete_img(prizeData.image);
                    }
                    const updateParam = {
                        condition : { _id : editId},
                        data : {
                            ...params,
                            update_ip : ipAddress,
                            update_by : usrId
                        }
                    }
                    result = await prizeServices.updateData(updateParam);
                } else{
                    return response.sendResponse(res, response.build("PRIZE_NOT_FOUND", { }));
                }
            }else{
                const prizeOption = {
                    type : "count",
                    condition : { campaign_data : campaign_id }
                }
                const prizeCount = await prizeServices.select(prizeOption);
                if(prizeCount > 0){
                    return response.sendResponse(res, response.build("PRIZE_ALREADY_EXIST", { }));
                } else{
                    const seq_id = await counterServices.getSequence('kw_prizes');
                    const insertParam = {
                        ...params,
                        seq_id : seq_id.seq,
                        status : "A",
                        creation_ip : ipAddress,
                        created_by  : usrId
                    }

                    result = await prizeServices.createData(insertParam);
                    if(result){
                        const updateParam = {
                            condition : { _id : campaign_id },
                            data : { 
                                prizeData : result._id,
                                update_ip : ipAddress,
                                update_by : usrId
                            }
                        }
                        await campaignService.updateData(updateParam);
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



const response = require("../../../../../../util/response");
const { getIpAddress, stringToObjectId, createSlug } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const campaignService   = require("../../../../../services/admin/v1/campaign/campaignServices");
const counterServices   = require("../../../../../services/counterService");
const imageHandler      = require("../../../../../../util/imageHandler");
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
            const result = await campaignService.select(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await campaignService.select(countOption);
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
 * Function Name    :   addEditGeneralData
 * Purpose          :   This function is add/edit campaign data
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.addEditData = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { editId, title, description, image, category, sub_category, straight_add_on_amount, rumble_add_on_amount, chance_add_on_amount, countdown_status, lotto_type, draw_date, draw_time, enable_number_range_prefix, number_range_prefix, ticket_number_repeat, lotto_range_start, lotto_range_end, show_on , seq_order } = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!title){
            return response.sendResponse(res, response.build('TITLE_EMPTY', { }));
        } else if(!description){
            return response.sendResponse(res, response.build('DESCRIPTION_EMPTY', { }));
        // } else if(!image){
        //     return response.sendResponse(res, response.build('IMAGE_EMPTY', { }));
        } else if(!category){
            return response.sendResponse(res, response.build('CATEGORY_EMPTY', { }));
        } else if(!sub_category){
            return response.sendResponse(res, response.build('SUB_CATEGORY_EMPTY', { }));
        } else if(!straight_add_on_amount){
            return response.sendResponse(res, response.build('STRAIGHT_AMOUNT', { }));
        } else if(!rumble_add_on_amount){
            return response.sendResponse(res, response.build('RUMBLE_AMOUNT', { }));
        } else if(!chance_add_on_amount){
            return response.sendResponse(res, response.build('REVERSE_AMOUNT', { }));
        } else if(!lotto_type){
            return response.sendResponse(res, response.build('LOTTO_TYPE_EMPTY', { }));
        } else if(!draw_date){
            return response.sendResponse(res, response.build('DRAW_DATE_EMPTY', { }));
        } else if(!draw_time){
            return response.sendResponse(res, response.build('DRAW_TIME_EMPTY', { }));
        // } else if(!lotto_range_prefix){
        //     return response.sendResponse(res, response.build('RANGE_PREFIX_EMPTY', { }));
        } else if(!ticket_number_repeat){
            return response.sendResponse(res, response.build('TICKET_NUMBER_REPEAT_EMPTY', { }));
        } else if(!lotto_range_start.toString()){  
            return response.sendResponse(res, response.build('NUMBER_RANGE_START_EMPTY', { }));
        } else if(!lotto_range_end){
            return response.sendResponse(res, response.build('NUMBER_RANGE_END_EMPTY', { }));
        } else if(!show_on || show_on.length === 0){
            return response.sendResponse(res, response.build('SHOW_ON_EMPTY', { }));
        } else{

            let result = {};
            const ipAddress = await getIpAddress();

            let image , product_image;
            if(req.files?.image && req.files?.image[0].fieldname === 'image'){
                image = await imageHandler.upload_img(req.files.image[0],'products');
            }
            if(req.files?.product_image && req.files?.product_image[0].fieldname === 'product_image'){
                product_image = await imageHandler.upload_img(req.files.product_image[0],'products');
            }
           
            const params = {
                title                   : title,
                description             : description, 
                ...(image          ?   { image  : image  } :  ''),
                ...(product_image  ?   { product_image  : product_image  } : ''),
                category                : category, 
                sub_category            : sub_category, 

                straight_add_on_amount  : straight_add_on_amount || 0, 
                rumble_add_on_amount    : rumble_add_on_amount || 0, 
                chance_add_on_amount    : chance_add_on_amount || 0, 

                countdown_status        : countdown_status === 'Y'?'Y':'N', 
                lotto_type              : lotto_type, 

                ...(enable_number_range_prefix === "Y" ? {
                        enable_number_range_prefix  : enable_number_range_prefix,
                        number_range_prefix         : number_range_prefix
                    } : {
                        enable_number_range_prefix : 'N'
                    }), 
                ticket_number_repeat    : ticket_number_repeat, 
                lotto_range_start       : parseInt(lotto_range_start), 
                lotto_range_end         : parseInt(lotto_range_end), 
                show_on                 : JSON.parse(show_on),
                seq_order               : seq_order,
            }
            if(editId){
                const campaignData = await campaignService.getCampaignById(editId);
                if(campaignData !='' && image){
                    await imageHandler.delete_img(campaignData.image);
                }

                if(campaignData){
                    const updateParam = {
                        condition : { _id : editId},
                        data : {
                            ...params,
                            update_ip : ipAddress,
                            update_by : usrId
                        }
                    }


                    result = await campaignService.updateData(updateParam);
                } else{
                    return response.sendResponse(res, response.build("CAMPAIGN_NOT_FOUND", { }));
                }
            }else{
                const seq_id = await counterServices.getSequence('kw_campaigns');
                const slug = await createSlug(title);
                const insertParam = {
                    ...params,
                    seq_id : seq_id.seq,
                    slug : slug,
                    draw_date               : new Date(draw_date), 
                    draw_time               : draw_time, 
                    draw_date_time          : `${draw_date} ${draw_time}`,
                    status : "A",
                    creation_ip : ipAddress,
                    created_by  : usrId
                }
                result = await campaignService.createData(insertParam);
                if(result){
                    const draw_seq = await counterServices.getSequence('kw_campaign_draws');
                    const drawParam = {
                        seq_id                  : draw_seq.seq,    
                        campaign_data           : result._id,
                        draw_date               : new Date(draw_date), 
                        draw_time               : draw_time, 
                        draw_date_time          : `${draw_date} ${draw_time}`,
                        status                  : "A"
                    }
                    const drawData = await campaignService.createDrawData(drawParam);
                    const updateParam = {
                        condition : { _id : result._id },
                        data : { draw_id : drawData._id }
                    }
                    await campaignService.updateData(updateParam);

                }
            }

            return response.sendResponse(res, response.build("SUCCESS", { result}));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   changeStatus
 * Purpose          :   This function is used for change campaign status 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.changeStatus = async function (req, res) {
    try{
        const usrId = req.user.userId;
        const { id,  status } = req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!status){
            return response.sendResponse(res, response.build('STATUS_EMPTY', { }));
        } else {
            const ipAddress = await getIpAddress(); 
            const data = await campaignService.getCampaignById(id)
            if(data){
                const updateData = {
                    condition : { _id : id },
                    data : {
                        status      : status,
                        update_ip   : ipAddress,
                        update_by   : usrId
                    }
                }
                const data = await campaignService.updateData(updateData);
                return response.sendResponse(res, response.build('SUCCESS', { result: data }));
            } else{
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch(error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of function

/*********************************************************************************
 * Function Name    :   changeDrawDate
 * Purpose          :   This function is used for change campaign draw date
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.changeDrawDate = async function (req, res) {
    try{
        const usrId = req.user.userId;
        const { id,  draw_date, draw_time } = req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!draw_date){
            return response.sendResponse(res, response.build('DRAW_DATE_EMPTY', { }));
        } else if(!draw_time){
            return response.sendResponse(res, response.build('DRAW_TIME_EMPTY', { }));
        } else {
            const ipAddress = await getIpAddress(); 
            const data = await campaignService.getCampaignById(id)
            if(data){
                const updateDrawOption = {
                    condition : { campaign_data : id, status : "A" },
                    data : { 
                        status : "C",
                        update_ip : ipAddress,
                        update_by :  usrId
                    }
                }
                await campaignService.updateDrawData(updateDrawOption);
                const draw_seq = await counterServices.getSequence('kw_campaign_draws');
                const drawParam = {
                    seq_id                  : draw_seq.seq,    
                    campaign_data           : id,
                    draw_date               : draw_date, 
                    draw_time               : draw_time, 
                    draw_date_time          : `${draw_date} ${draw_time}`,
                    status                  : "A"
                }
                const drawData    = await campaignService.createDrawData(drawParam);
                const updateParam = {
                    condition : { _id : id },
                    data : { 
                        draw_id         : drawData._id,
                        draw_date       : draw_date, 
                        draw_time       : draw_time, 
                        draw_date_time  : `${draw_date} ${draw_time}`,
                        update_ip       : ipAddress,
                        update_by       :  usrId
                    }
                }
                const result = await campaignService.updateData(updateParam);
                return response.sendResponse(res, response.build('SUCCESS', { result }));
            } else{
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch(error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of function

/*********************************************************************************
 * Function Name    :   autoDrawDate
 * Purpose          :   This function is used for change campaign draw date
 * Created By       :   Dilip kumar Halder
 * Created Data     :   15-04-2025
 ********************************************************************************/
exports.autoDrawDate = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const ipAddress = await getIpAddress();
        const { condition = {}, select = {}, limit, skip, sort = {}, type } = req.body;

        // Validate user ID
        if (!isValidObjectId(usrId)) {
            return response.sendResponse(res, response.build('PERMISSION_ERROR', {}));
        }

        // Construct query parameters
        const listWhere = {
            ...(type ? { type: type } : null),
            condition: { ...condition },
            ...(sort ? { sort: sort } : { sort: { _id: -1 } }),
            ...(select ? { select: select } : null),
            ...(limit ? { limit: limit } : 0),
            ...(skip ? { skip: skip } : 0)
        };

        // Fetch campaign data
        const result = await campaignService.select(listWhere);

        if (result && result.length > 0) {
            const currentDate = new Date();
            // console.log(currentDate);


            // Process all campaigns with past draw dates
            for (const item of result) {
                
                const drawDate = item.draw_date_time;

                if (currentDate > drawDate) {
                    console.log('draw - ',item.title , '-', drawDate)
                    // Set drawDate to currentDate + 1
                    const updatedDrawDate = new Date(currentDate);
                    updatedDrawDate.setDate(currentDate.getDate() + 1);

                    // Generate a sequence for the new draw
                    const drawSeq = await counterServices.getSequence('kw_campaign_draws');

                    const drawParam = {
                        seq_id: drawSeq.seq,
                        campaign_data: item._id,
                        draw_date: updatedDrawDate,
                        draw_time: item.draw_time,
                        draw_date_time: `${updatedDrawDate.toISOString().split('T')[0]} ${item.draw_time}`,
                        status: "A"
                    };

                    // Create new draw data
                    const drawData = await campaignService.createDrawData(drawParam);

                    // Update the campaign with the new draw details
                    const updateParam = {
                        condition: { _id: item._id },
                        data: {
                            draw_id: drawData._id,
                            draw_date: updatedDrawDate,
                            draw_time: item.draw_time,
                            draw_date_time: `${updatedDrawDate.toISOString().split('T')[0]} ${item.draw_time}`,
                            update_ip: ipAddress,
                            update_by: usrId
                        }
                    };

                    await campaignService.updateData(updateParam);
                }
            }

            return response.sendResponse(res, response.build('SUCCESS', { responce : 'Draw date updated' }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', {}));
        }
    } catch (error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; // End of function

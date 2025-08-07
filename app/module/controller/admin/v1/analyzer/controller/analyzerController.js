const moment = require('moment');
const momenttz = require('moment-timezone');
const response = require('../../../../../../util/response');
const compaignModel = require('../../../../../../models/kw_campaigns');
const orderModel = require('../../../../../../models/kw_campaign_orders');
// const sixMatchesModel = require('../../../../models/bw_6_matches_combination');
const _ = require('lodash');  // For utility functions like random sampling

/**
 * Get match suggestions for numbers
 * Created By: Ashif Iqbal
 * Created Date: 12-03-2024
 */

exports.list = async function (req, res) {
    try {
        let { game_id, draw_date, coupon, price, suggestions_count } = req.body;

        if (!game_id || !draw_date) {
            return response.sendResponse(res, response.build('ERROR_MISSING_FIELDS', { message: 'Missing required fields' }));
        }

        let draw_date_formatted = moment(draw_date).format('YYYY-MM-DD');
        const drawDateStart = momenttz.tz(draw_date_formatted + ' 00:00:00', 'Asia/Dubai').toDate();
        const drawDateEnd = momenttz.tz(draw_date_formatted + ' 23:59:59', 'Asia/Dubai').toDate();
        let num_suggestions = 5000 //suggestions_count || 177100; // Default 10 suggestions
        const compaigndata = await compaignModel.findOne({
            _id: game_id,
            status: 'A',
        }).populate({
            path: 'prizeData',  // Populate the ticket field (which is an array of ObjectIds referencing tickets)
            model: 'kw_prizes', // Specify the model to populate (bw_campaign_tickets)
            match: { status: 'A' },  // Optionally, filter the tickets based on their status (optional)
            
        });;
        if (!compaigndata) {
                    return response.sendResponse(res, response.build('ERROR_NOT_FOUND', { message: 'Campaign not found' }));
        }
        game_type = compaigndata.lotto_type;
        // console.log(game_type)
        // return response.sendResponse(res, response.build('SUCCESS', {compaigndata }));
        // Step 1: Fetch tickets from DB
        // const tickets = await ticketModel.find({
        //     campaign_data: game_id,
        //     status: 'Success',
        //     // $expr: { $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, draw_date_formatted] }
        // });
        const tickets = await orderModel.find({
            campaign_data: game_id,
            status: 'Success',
            draw_date_time: {
                $gte: drawDateStart,
                $lte: drawDateEnd
            }
        }).populate({
            path: 'ticket',  // Populate the ticket field (which is an array of ObjectIds referencing tickets)
            model: 'kw_campaign_tickets', // Specify the model to populate (bw_campaign_tickets)
            match: { status: 'Success' },  // Optionally, filter the tickets based on their status (optional)
            
        });
        
        // Now `tickets` will only contain those with matching `draw_date_time`
        // return response.sendResponse(res, response.build('SUCCESS', {orderticketData}));
        if (!tickets.length) {
            return response.sendResponse(res, response.build('SUCCESS', { message: 'No tickets found' }));
        }

        // Step 2: Process Ticket Numbers
        // const ticketData = tickets.map(ticket => ({
        //     ticket: ticket.ticket.split(',').map(num => parseInt(num.trim())),  // Convert numbers to integers for accurate matching
        //     order_id: ticket.order_id,
        //     ticket_id: ticket._id  // Include ticket ID in the data
        // }));
        if(game_type == 6 || game_type == 7){
            type=['rumble'];
        }else if(game_type < 6){
            type=['rumble','straight','chance'];
        }
        
            if (coupon) {
              const ticketData = tickets.flatMap(order => 
                  order.ticket.map(ticket => ({
                      ticket: ticket.ticket.split(',').map(num => parseInt(num.trim())),
                      order_id: ticket.order_id,
                      order_no: ticket.order_no,
                      area : order.seller_area,
                      ticket_id: ticket._id,
                      seller_first_name: ticket.seller_first_name,
                      seller_last_name: ticket.seller_last_name,
                      seller_mobile: ticket.seller_mobile,
                      seller_pos_number: ticket.seller_pos_number,
                      type: ticket.type
                      
                  }))
              );
            // If coupon is provided, check its match count
            const couponNumbers = coupon.split(',').map(num => parseInt(num.trim()));  // Ensure coupon numbers are parsed as integers
            const couponMatches = getMatchCounts(ticketData, couponNumbers, game_type, type,true); // Pass type (straight, rumble, chance)
            let mDetails=[];
            mDetails.push({numbers:couponNumbers,matches:couponMatches});
            
            const finaldata = prepareTableData(game_type, mDetails, price)
            console.log('data preapared success');
            
            return response.sendResponse(res, response.build('SUCCESS', {result:{ game_type,finaldata} }));
        } else {
              const ticketData = tickets.flatMap(order => 
                  order.ticket.map(ticket => ({
                      ticket: ticket.ticket.split(',').map(num => parseInt(num.trim())),
                  }))
              );
              
            // Suggest numbers from 1 to 25 with minimum matches first
            const { minMatchNumbers, matchDetails } = getRandomCombinationsFromRange(compaigndata.lotto_range_start, compaigndata.lotto_range_end, game_type, num_suggestions, ticketData, type);
            const finaldata = prepareTableData(game_type, matchDetails, price)
            console.log('data preapared success');
            return response.sendResponse(res, response.build('SUCCESS', {result:{ game_type,finaldata }}));
        }
    } catch (error) {
        console.error('Error:', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
/**
 * Function to prepare data for frontend
 */
function prepareTableData(game_type, mDetails, price=[]){
    try{
        finaldata=[];
        mDetails.forEach((data) => {
            
            finaldata.push({
                ticket:data.numbers,
                straight_count:data.matches.straight.count,
                straight:data.matches.straight.count * price.straight,
                straight_user:data.matches.straight.orders,

                rumble_count:data.matches.rumble.count,
                rumble_price:data.matches.rumble.count * price.rumble,
                rumble_user:data.matches.rumble.orders,

                match1_count:data.matches.match1.count,
                match1_price:data.matches.match1.count * price.match1,
                match1_user:data.matches.match1.orders,

                match2_count:data.matches.match2.count,
                match2_price:data.matches.match2.count * price.match2,
                match2_user:data.matches.match2.orders,

                match3_count:data.matches.match3.count,
                match3_price:data.matches.match3.count * price.match3,
                match3_user:data.matches.match3.orders,

                match4_count:data.matches.match4.count,
                match4_price:data.matches.match4.count * price.match4,
                match4_user:data.matches.match4.orders,

                match5_count:data.matches.match5.count,
                match5_price:data.matches.match5.count * price.match5,
                match5_user:data.matches.match5.orders,

                match6_count:data.matches.match6.count,
                match6_price:data.matches.match6.count * price.match6,
                match6_user:data.matches.match6.orders,

                match7_count:data.matches.match7.count,
                match7_price:data.matches.match7.count * price.match7,
                match7_user:data.matches.match7.orders,

                total_amount : data.matches.straight.count * price.straight + data.matches.rumble.count * price.rumble + data.matches.match1.count * price.match1 +  data.matches.match2.count * price.match2 + data.matches.match3.count * price.match3 + data.matches.match4.count * price.match4 + data.matches.match5.count * price.match5 + data.matches.match6.count * price.match6 + data.matches.match7.count * price.match7
            })
        })
        finaldata.sort((a, b) => a.total_amount - b.total_amount);

        return finaldata
        // console.log(finaldata);
        
    }catch(error){
        console.error('Error:', error);
        return response.sendResponse([], response.build('ERROR_SERVER_ERROR', { error }));
    }
}
/**
 * Function to generate random combinations from the range 1 to 25
 */
function getRandomCombinationsFromRange(start, end, gameType, numSuggestions, ticketData, matchType) {
    // Step 1: Frequency map
    
      // Step 1: Frequency map (1 to 25)
        const freqMap = Array(26).fill(0); // index 0 unused

        // Step 2: Count frequencies
        for (const { ticket } of ticketData) {
        for (const num of ticket) {
            freqMap[num]++;
        }
        }

        // Step 3: Convert to array of { number, count }
        const freqArray = [];
        for (let i = 1; i <= 25; i++) {
        freqArray.push({ number: i, count: freqMap[i] });
        }
        // console.log(freqArray);
        
        // Step 4: Sort by count ascending (lowest frequency first)
        freqArray.sort((a, b) => a.count - b.count);
        let minMatchNumbers = [];
        let matchDetails = [];
        for (let i = 0; i < numSuggestions; i++) {
        // Step 5: Pick top 6 least frequent numbers
        const shuffled = [...freqArray.slice(0, 12)].sort(() => Math.random() - 0.5);
        const randomCombination = shuffled.slice(0, 6).map(item => item.number);
        const matchCounts = getMatchCounts(ticketData, randomCombination, gameType, matchType,false);
            matchDetails.push({
                numbers: randomCombination,
                matches: matchCounts
            });
        }
        return { minMatchNumbers, matchDetails };
        // console.log("Suggested low-frequency ticket:", lowFreqTicket);
      
        // for (const ticket of existingTickets) {
        // for (const num of ticket) freqMap[num]++;
        // }

        // // Step 2: Sort by frequency
        // const sortedNumbers = [...Array(25).keys()].map(i => i + 1).sort((a, b) => freqMap[a] - freqMap[b]);

    const allNumbers = _.range(start, end + 1);  // Generates an array [1, 2, ..., 25]
    // let minMatchNumbers = [];
    // let matchDetails = [];

    for (let i = 0; i < numSuggestions; i++) {
        // Generate a random combination of numbers based on gameType (e.g., 6 numbers)
        const randomCombination = _.sampleSize(allNumbers, gameType);  // Random combination of `gameType` numbers from 1 to 25
        minMatchNumbers.push(randomCombination);

        // Get match details for the generated combination
        const matchCounts = getMatchCounts(ticketData, randomCombination, gameType, matchType,false);
        matchDetails.push({
            numbers: randomCombination,
            matches: matchCounts
        });
    }

    return { minMatchNumbers, matchDetails };
}

/**
 * Function to count matches for a given number set
 */
function getMatchCounts(ticketData, selectedNumbers, gameType, matchType,coupon_type=false) {
    let matchCounts = {
        "straight": { count: 0, orders: [] },
        "rumble": { count: 0, orders: [] },
        "match1": { count: 0, orders: [] },
        "match2": { count: 0, orders: [] },
        "match3": { count: 0, orders: [] },
        "match4": { count: 0, orders: [] },
        "match5": { count: 0, orders: [] },
        "match6": { count: 0, orders: [] },
        "match7": { count: 0, orders: [] }
    };
    
    if(coupon_type == true){
          ticketData.forEach(({ ticket, order_id, order_no, area, seller_first_name, seller_last_name, seller_mobile, seller_pos_number, type, ticket_id }) => {
            let matchCount = 0;
            
            for(i=0;i<matchType.length; i++){
                if (matchType[i] === 'straight' && type.toLowerCase() === 'straight') {
                    matchCount = countStraightMatches(ticket, selectedNumbers);
                    if(matchCount == ticket.length){
                        matchCounts[`straight`].count += 1;
                        matchCounts[`straight`].orders.push({ order_id, ticket_id, order_no,area,seller_first_name, seller_last_name, seller_mobile, seller_pos_number, type,ticket,user_matches:ticket.join(',') });
                    }
                    
                } 
                
                if (matchType[i] === 'rumble' && type.toLowerCase() === 'rumble' && gameType < 6) {
                    let {matchCount,matchNumbers} = countRumbleMatches(ticket, selectedNumbers);  // Call rumble-specific function
                    if(matchCount == ticket.length){
                        matchCounts[`rumble`].count += 1;
                        matchCounts[`rumble`].orders.push({ order_id, ticket_id,order_no,area,seller_first_name, seller_last_name, seller_mobile, seller_pos_number, type,ticket,user_matches:matchNumbers.join(',') });
                    }
                    
                }else if(matchType[i] === 'rumble' && type.toLowerCase() === 'rumble' && (gameType == 6 || gameType == 7)){
                    let {matchCount,matchNumbers} = countRumbleMatches(ticket, selectedNumbers); 
                    
                    if (matchCount >= 3 && matchCount <= gameType) {
                        
                        
                        matchCounts[`match${matchCount}`].count += 1;
                        matchCounts[`match${matchCount}`].orders.push({ order_id, ticket_id,order_no,area,seller_first_name, seller_last_name, seller_mobile, seller_pos_number, type,ticket,user_matches:matchNumbers.join(',') });
                    }
                    
                }
                if (matchType[i] === 'chance' && type.toLowerCase() === 'chance') {
                    let {matchCount,matchNumbers} = countMatches(ticket, selectedNumbers);
                    if (matchCount >= 1 && matchCount <= gameType) {
                        // Add ticket_id and order_id in the orders array
                        
                        matchCounts[`match${matchCount}`].count += 1;
                        matchCounts[`match${matchCount}`].orders.push({ order_id, ticket_id,order_no,area,seller_first_name, seller_last_name, seller_mobile, seller_pos_number, type,ticket,user_matches:matchNumbers.join(',') });
                    }
                }
        
            }
            
            
        });
    }else{
          ticketData.forEach(({ ticket}) => {
            let matchCount = 0;
            
            for(i=0;i<matchType.length; i++){
                if (matchType[i] === 'straight') {
                    matchCount = countStraightMatches(ticket, selectedNumbers);
                    if(matchCount == ticket.length){
                        matchCounts[`straight`].count += 1;
                        
                    }
                    
                }  
                if (matchType[i] === 'rumble' && gameType < 6) {
                    matchCount = countRumbleMatches(ticket, selectedNumbers);  // Call rumble-specific function
                    if(matchCount == ticket.length){
                        matchCounts[`rumble`].count += 1;
                    }
                    
                }else if(matchType[i] === 'rumble' && (gameType == 6 || gameType == 7)){
                    matchCount = countRumbleMatches(ticket, selectedNumbers); 
                    
                    if (matchCount >= 3 && matchCount <= gameType) {
                        matchCounts[`match${matchCount}`].count += 1;
                       
                    }
                    
                }
                if (matchType[i] === 'chance') {
                    matchCount = countMatches(ticket, selectedNumbers);
                    if (matchCount >= 3 && matchCount <= gameType) {
                        // Add ticket_id and order_id in the orders array
                        
                        matchCounts[`match${matchCount}`].count += 1;
                       
                    }
                }
        
            }
            
            
        });
    }

    return matchCounts;
}

/**
 * Function to count rumble matches (any order, full set match)
 */

// function countRumbleMatches(ticket, drawnNumbers) {
//     // Convert drawnNumbers into a Set for fast lookup
//     const drawnSet = new Set(drawnNumbers);
    
//     // Count how many numbers from ticket exist in drawnNumbers
//     let matchCount = 0;
//     let matchNumbers=[]
//     for (const num of ticket) {
//         if (drawnSet.has(num)) {
//             matchCount++;
//             matchNumbers.push(num);
//         }
//     }
//     return {matchCount,matchNumbers};
// }
function countRumbleMatches(ticket, drawnNumbers) {
    // Make a copy of drawnNumbers array
    const remainingDrawn = [...drawnNumbers];

    let matchCount = 0;
    let matchNumbers = [];

    for (const num of ticket) {
        const index = remainingDrawn.indexOf(num);
        if (index !== -1) {
            matchCount++;
            matchNumbers.push(num);
            remainingDrawn.splice(index, 1); // match hone ke baad use hata dena
        }
    }

    return { matchCount, matchNumbers };
}

/**
 * Function to count straight matches (exact order)
 */
function countStraightMatches(ticket, drawnNumbers) {
    return ticket.every((num, index) => num === drawnNumbers[index]) ? drawnNumbers.length : 0;
}

/**
 * Function to count matches between two sets of numbers (general)
 */
// function countMatches(ticket, drawnNumbers) {
//     return ticket.filter(num => drawnNumbers.includes(num)).length;
// }
function countMatches(ticket, drawnNumbers) {
    let matchCount = 0;
    let matchNumbers=[]
    for (let i = ticket.length - 1; i >= 0; i--) {
        if (ticket[i] !== drawnNumbers[i]) {
            break;  // Stop looping on first mismatch
        }
        matchCount++;
        matchNumbers.push(ticket[i]);
    }
    return {matchCount,matchNumbers};
}








// insertUpdatedb.js
const os = require('os');
const path = require('path');
const { Worker } = require('worker_threads');
const moment = require('moment');
const momenttz = require('moment-timezone');
const response = require('../../../../../../util/response');
const compaignModel = require('../../../../../../models/kw_campaigns');
const orderModel = require('../../../../../../models/kw_campaign_orders');
const _ = require('lodash');

// exports.insertUpdatedb = async function (req, res) {
//     try {
//         const { game_id, draw_date, coupon, suggestions_count, seller_name, seller_area, price } = req.body;

//         if (!game_id || !draw_date) {
//             return response.sendResponse(res, response.build('ERROR_MISSING_FIELDS', { message: 'Missing required fields' }));
//         }

//          let draw_date_formatted = moment(draw_date).format('YYYY-MM-DD');
//          const drawDateStart = momenttz.tz(draw_date_formatted + ' 00:00:00', 'Asia/Dubai').toDate();
//          const drawDateEnd = momenttz.tz(draw_date_formatted + ' 23:59:59', 'Asia/Dubai').toDate();
//         const compaigndata = await compaignModel.findOne({ _id: game_id, status: 'A' });

//         if (!compaigndata) {
//             return response.sendResponse(res, response.build('ERROR_NOT_FOUND', { message: 'Campaign not found' }));
//         }

//         const game_type = compaigndata.lotto_type;
//         const numSuggestions = game_type >= 6 ? 177100 : game_type === 3 ? 1000 : game_type === 4 ? 10000 : game_type === 5 ? 59049 : 100;
//         const matchTypes = game_type >= 6 ? ['rumble'] : ['rumble', 'straight', 'chance'];

//         const filterQuery = {
//             campaign_data: game_id,
//             status: 'Success',
//             draw_date_time: {
//                 $gte: drawDateStart,
//                 $lte: drawDateEnd
//             }
//         };

//         if (seller_name) filterQuery.seller_first_name = { $regex: seller_name, $options: 'i' };
//         if (seller_area) filterQuery.seller_area = { $regex: seller_area, $options: 'i' };

//         const tickets = await orderModel.find(filterQuery).populate({
//             path: 'ticket',
//             model: 'kw_campaign_tickets',
//             match: { status: 'Success' }
//         });

//         if (!tickets.length) {
//             return response.sendResponse(res, response.build('SUCCESS', { message: 'No tickets found' }));
//         }

//         const ticketData = tickets.flatMap(order =>
//             order.ticket.map(ticket => ({
//                 ticket: ticket.ticket.split(',').map(num => parseInt(num.trim()))
//             }))
//         );

//         let allCombinations = [];

//         if (coupon) {
//             allCombinations = [coupon.split(',').map(num => parseInt(num.trim()))];
//         } else {
//             const allNumbers = _.range(compaigndata.lotto_range_start, compaigndata.lotto_range_end + 1);
//             if (game_type < 6) {
//                 const uniqueSet = new Set();
//                 while (uniqueSet.size < numSuggestions) {
//                     const combo = Array.from({ length: game_type }, () => _.sample(allNumbers));
//                     uniqueSet.add(combo.join(','));
//                 }
//                 allCombinations = Array.from(uniqueSet).map(str => str.split(',').map(Number));
//             } else {
//                 allCombinations = Array.from({ length: numSuggestions }, () => _.sampleSize(allNumbers, game_type));
//             }
//         }

//         const cpuCount = os.cpus().length;
//         const workerCount = Math.min(Math.round((cpuCount * 70) / 100), allCombinations.length);
//         const chunks = _.chunk(allCombinations, Math.ceil(allCombinations.length / workerCount));

//         const workerResults = await Promise.all(
//             chunks.map(chunk => runWorker(chunk, ticketData, game_type, matchTypes, price))
//         );

//         const merged = _.flatten(workerResults);
//         merged.sort((a, b) => b.matches.total_amount - a.matches.total_amount);

//         const finalData = merged.map(data => ({
//             ticket: data.numbers,
//             total_amount: data.matches.total_amount,
//             ...data.matches.breakdown
//         }));

//         return response.sendResponse(res, response.build('SUCCESS', { result: { game_type, finaldata: finalData } }));
//     } catch (error) {
//         console.error('Error:', error);
//         return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
//     }
// };

// function runWorker(combinationChunk, ticketData, gameType, matchType, price) {
//     return new Promise((resolve, reject) => {
//         const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
//             workerData: { combinationChunk, ticketData, gameType, matchType, price }
//         });

//         worker.on('message', resolve);
//         worker.on('error', reject);
//         worker.on('exit', code => {
//             if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
//         });
//     });
// }



exports.insertUpdatedb = async function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // 🔁 Keep-alive ping every 10s
    const heartbeat = setInterval(() => {
        if (!res.writableEnded) {
            res.write('\n'); // Keeps the connection alive
            res.flush?.();
        }
    }, 10000);

    try {
        const { game_id, draw_date, coupon, suggestions_count, seller_name, seller_area, price,filter } = req.body;

        if (!game_id || !draw_date ||!filter) {
            clearInterval(heartbeat);
            return safeEnd(res, 400, response.build('ERROR_MISSING_FIELDS', { message: 'Missing required fields' }));
        }

        const draw_date_formatted = moment(draw_date).format('YYYY-MM-DD');
        const drawDateStart = momenttz.tz(draw_date_formatted + ' 00:00:00', 'Asia/Dubai').toDate();
        const drawDateEnd = momenttz.tz(draw_date_formatted + ' 23:59:59', 'Asia/Dubai').toDate();
        const compaigndata = await compaignModel.findOne({ _id: game_id, status: 'A' });
        if (!compaigndata) {
            clearInterval(heartbeat);
            return safeEnd(res, 404, response.build('ERROR_NOT_FOUND', { message: 'Campaign not found' }));
        }

        const game_type = compaigndata.lotto_type;
        const numSuggestions = game_type >= 6 ? 177100 : game_type === 3 ? 1000 : game_type === 4 ? 10000 : game_type === 5 ? 59049 : 100;
        const type = game_type >= 6 ? ['rumble'] : ['rumble', 'straight', 'chance'];

        const filterQuery = {
            campaign_data: game_id,
            status: 'Success',
            draw_date_time: {
                $gte: drawDateStart,
                $lte: drawDateEnd
            }
        };

        if (seller_name) filterQuery.seller_first_name = { $regex: seller_name, $options: 'i' };
        if (seller_area) filterQuery.seller_area = { $regex: seller_area, $options: 'i' };

        const tickets = await orderModel.find(filterQuery).populate({
            path: 'ticket',
            model: 'kw_campaign_tickets',
            match: { status: 'Success' }
        });

        if (!tickets.length) {
            clearInterval(heartbeat);
            return safeEnd(res, 200, response.build('SUCCESS', { message: 'No tickets found' }));
        }

        const ticketData = tickets.flatMap(order =>
            order.ticket.map(ticket => ({
                ticket: ticket.ticket.split(',').map(num => parseInt(num.trim())),
                order_id: ticket.order_id,
                order_no: ticket.order_no,
                area: order.area,
                ticket_id: ticket._id,
                seller_first_name: ticket.seller_first_name,
                seller_last_name: ticket.seller_last_name,
                seller_mobile: ticket.seller_mobile,
                seller_pos_number: ticket.seller_pos_number,
                ticket_type: ticket.type
            }))
        );
        console.log(ticketData)
        let allCombinations = [];
        if (coupon) {
            allCombinations = [coupon.split(',').map(num => parseInt(num.trim()))];
            
        } else {
           
            if (game_type < 6) {
                const allNumbers = _.range(compaigndata.lotto_range_start, compaigndata.lotto_range_end + 1);
                const uniqueSet = new Set();
                while (uniqueSet.size < numSuggestions) {
                    const combo = Array.from({ length: game_type }, () => _.sample(allNumbers));
                    uniqueSet.add(combo.join(','));
                }
                allCombinations = Array.from(uniqueSet).map(str => str.split(',').map(Number));
            } else {
                // allCombinations = Array.from({ length: numSuggestions }, () =>
                //     _.sampleSize(allNumbers, game_type)
                // );
                if(game_type == 7){
                    const allNumbers = _.range(compaigndata.lotto_range_start, compaigndata.lotto_range_end + 1);
                    
                    allCombinations = Array.from({ length: numSuggestions }, () =>
                            _.sampleSize(allNumbers, game_type)
                        );
                }else{
                    allCombinations = generateAllCombinations(game_type, compaigndata.lotto_range_start, compaigndata.lotto_range_end);
                }
                
                // console.log(allCombinations.slice(0,10));
                
            }
        }

        const combolengthitration = Math.ceil(allCombinations.length / 10000);
        const cpuCount = os.cpus().length;
        const finalData = [];
        console.log('working');
        
        res.write('[\n'); // Start of JSON array
        let newtenkcombo=[]
        for (let i = 1; i <= combolengthitration; i++) {
            if(i == combolengthitration){
                 newtenkcombo = allCombinations.slice((i - 1) * 10000, allCombinations.length);
            }else{
                 newtenkcombo = allCombinations.slice((i - 1) * 10000, i * 10000);
            }
            
            const workerCount = Math.min(Math.round(cpuCount * 0.9), newtenkcombo.length);
            const chunks = _.chunk(newtenkcombo, Math.ceil(newtenkcombo.length / workerCount));

            const workerResults = await Promise.all(
                chunks.map(chunk => runWorker(chunk, ticketData, game_type, type, price,filter))
            );

            const merged = _.flatten(workerResults);
            merged.sort((a, b) => a.matches.total_amount - b.matches.total_amount);

            // const preparedData = merged.map(data => ({
            //     ticket: data.numbers,
            //     total_amount: data.matches.total_amount,
            //     area: data?.matches?.area,
            //     ...data.matches.breakdown
            // }));
            const preparedData = merged.map(data =>{
                if (Object.keys(data.matches.breakdown || {}).length > 0) {
                    return {
                        ticket: data.numbers,
                        total_amount: data.matches.total_amount,
                        area: data?.matches?.area,
                        ...data.matches.breakdown
                    };
                }
                
            } ).filter(item => item !== undefined);
            finalData.push(preparedData);

            // 🔄 Stream live chunk response
            res.write(',');
            res.write(JSON.stringify(preparedData));
            // if (i !== combolengthitration) res.write(',');

            console.log(`✅ ${i * 10000} combos processed`);
        }

        res.write('\n]'); // Close JSON array
        clearInterval(heartbeat);
        return res.end();

    } catch (error) {
        console.log('Error:', error);
        clearInterval(heartbeat);
        console.log(' Error catch:', error);
        return safeEnd(res, 500, response.build('ERROR_SERVER_ERROR', { error }));
    }finally{
        console.log('connection closed:');
    }
};

// Worker Thread
function runWorker(combinationChunk, ticketData, gameType, matchType, price,filter) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
            workerData: { combinationChunk, ticketData, gameType, matchType, price,filter }
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
        });
    });
}

// Safe response
function safeEnd(res, statusCode, data) {
    if (!res.headersSent && !res.writableEnded) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
}


function generateAllCombinations(digitCount = 6, start = 1, end = 25) {
    const numbers = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    const result = [];
    
    // Helper function to generate combinations
    function combine(arr, n, start, currentCombination) {
        if (currentCombination.length === n) {
            result.push([...currentCombination]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            currentCombination.push(arr[i]);
            combine(arr, n, i + 1, currentCombination);
            currentCombination.pop();
        }
    }

    combine(numbers, digitCount, 0, []);
    return result;
}
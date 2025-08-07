const { parentPort, workerData } = require('worker_threads');
const _ = require('lodash');

function countMatches(ticket, drawnNumbers) {
  let count = 0;
  for (let i = ticket.length - 1; i >= 0; i--) {
      if (ticket[i] !== drawnNumbers[i]) break;
      count++;
  }
  return count;
}
// function countRumble(ticket, drawnNumbers) {
//   return ticket.filter(num => drawnNumbers.includes(num)).length;
//     // return countMatches(ticket, drawnNumbers);
// }
function countRumble(ticket, drawnNumbers) {
    let remainingDrawn = [...drawnNumbers]; // Copy drawn numbers
    let matchCount = 0;

    for (const num of ticket) {
        const index = remainingDrawn.indexOf(num);
        if (index !== -1) {
            matchCount++;
            remainingDrawn.splice(index, 1); // Remove matched number
        }
    }

    return matchCount;
}

function countStraight(ticket, drawnNumbers) {
    return ticket.every((num, i) => num === drawnNumbers[i]) ? ticket.length : 0;
}

function getMatchCounts(combination, tickets, gameType, types,price,filter) {
    let seller_area = [];
    let breakdown = {
        straight: 0,
        rumble: 0,
        match1: 0,
        match2: 0,
        match3: 0,
        match4: 0,
        match5: 0,
        match6: 0,
        match7: 0,
    };
    // console.log('tickets ; ',tickets[0]);
    tickets.forEach(({ ticket, order_id,order_no,area,ticket_id,seller_first_name,seller_last_name,seller_mobile,seller_pos_number,ticket_type }) => {
        // console.log(combination,'------------------- Area : ',area,'------ticket',ticket);
        
        let count = 0
        types.forEach(type => {
        // const normalizedArea = area.trim().toLowerCase(); 
        // console.log(normalizedArea);
        
            if (type === 'straight' && ticket_type.toLowerCase() === 'straight') {
                 count =  countStraight(ticket, combination)
                if (count === ticket.length) breakdown.straight += 1;
                if(count == ticket.length){
                    area.split(',').map(a => a.trim()).forEach(a => {
                        if (!seller_area.some(sa => sa.trim().toLowerCase() === a.toLowerCase())) {
                            seller_area.push(a.toLowerCase());
                        }
                    });
                }
                
            }
            
            if (type === 'rumble' && ticket_type.toLowerCase() === 'rumble') {
                 count = countRumble(ticket, combination);
                if (count === ticket.length) breakdown.rumble += 1;
                if (gameType >= 6 && count >= 3) breakdown[`match${count}`] += 1;

                if(gameType >= 6 && count >0){
                    area.split(',').map(a => a.trim()).forEach(a => {
                        if (!seller_area.some(sa => sa.trim().toLowerCase() === a.toLowerCase())) {
                            seller_area.push(a.toLowerCase());
                        }
                    });
                }else if(gameType <= 5 && count === ticket.length){
                    area.split(',').map(a => a.trim()).forEach(a => {
                        if (!seller_area.some(sa => sa.trim().toLowerCase() === a.toLowerCase())) {
                            seller_area.push(a.toLowerCase());
                        }
                    });
                }
            }
            if (type === 'chance' && ticket_type.toLowerCase() === 'chance') {
                 count = countMatches(ticket, combination);
                if (count >= 1) breakdown[`match${count}`] += 1;
                if(count >0){
                    area.split(',').map(a => a.trim()).forEach(a => {
                        if (!seller_area.some(sa => sa.trim().toLowerCase() === a.toLowerCase())) {
                            seller_area.push(a.toLowerCase());
                        }
                    });
                }
            }
        });
    });

    
  let total_amount = 0
    const matchKeys =
  gameType == 7
    ? ['match7', 'match6', 'match5', 'match4', 'match3']
    : gameType == 6
    ? ['match6', 'match5', 'match4', 'match3']
    : gameType == 5
    ? ['straight', 'rumble', 'match5', 'match4', 'match3', 'match2', 'match1']
    : gameType == 4
    ? ['straight', 'rumble', 'match4', 'match3', 'match2', 'match1']
    : gameType == 3
    ? ['straight', 'rumble', 'match3', 'match2', 'match1'] // removed match5 assuming it's a typo
    : [];

let shouldRemoveKeys = [];

    for (const key of matchKeys) {
        const value = breakdown[key];
        const condition = filter[key];
        const filterValue = filter[`${key}_number`];

        if (condition && filterValue !== undefined) {
            if (
            (condition === 'greater_than' && value < filterValue) ||
            (condition === 'less_than' && value > filterValue) ||
            (condition === 'equal_to' && value != filterValue)
            ) {
            // If condition fails, mark for deletion
            shouldRemoveKeys.push(key);
            }
        }
    }
    for (const key in breakdown) {
        // total_amount += (breakdown[key] || 0) * (price[key] || 0);
        if (shouldRemoveKeys.includes(key)) {
            // delete breakdown[key];
            breakdown={};
        } else {
            total_amount += (breakdown[key] || 0) * (price[key] || 0);
        }
    }
    return {
        breakdown,
        total_amount,
        area: _.uniq(seller_area)?.join(', '),
    };
}

const { combinationChunk, ticketData, gameType, matchType,price,filter } = workerData;
// console.log(ticketData);

const results = combinationChunk.map(numbers => {
    const matches = getMatchCounts(numbers, ticketData, gameType, matchType,price,filter);
    return { numbers, matches };
});

parentPort.postMessage(results);
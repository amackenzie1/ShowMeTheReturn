let results = {
    "Ending Balance": 1020,
    "Ending Date": "2023-01-12",
    "Starting Balance": 1000,
    "Starting Date": "2022-01-12",
    "Transaction2": {"Amount": 0, "Date": '2022-06-06', "Type": "Withdrawal"},
    "Transaction5": {"Amount": 0, "Date": '2022-08-01', "Type": 'Deposit'},
    "Transaction6": {},
    "Transaction7": {}
}

//converts a date of the form 2022-06-06 to a number of days since Jan 1, 1970

function date_to_number(given_date){
    let date = new Date(given_date);
    let milliseconds = date.getTime();
    let days = milliseconds / (1000 * 60 * 60 * 24);
    return days;
}


function clean(results){
    
    for (var key in results){
        if (key.includes("Transaction")){
            try {
                results[key]["Amount"] = parseInt(results[key]["Amount"]);
                if (results[key]["Amount"] === NaN){
                    delete results[key];
                }
            } catch (err){
                delete results[key];
            }
            
        }
    }
    console.log("starting logging");
    console.log(results);
    results["Starting Balance"] = parseInt(results["Starting Balance"]) || 0;
    results["Ending Balance"] = parseInt(results["Ending Balance"]) || 0;

    let start_day = date_to_number(results["Starting Date"]);

    results["Transactions"] = {};
    for (var key in results){
        if (key.includes("Transaction")){
            if (key === "Transactions"){
                continue;
            }
            let day = date_to_number(results[key]["Date"]) - start_day;
            if (day in results["Transactions"]){
                // set factor to be -1 if it's a withdrawal
                let factor = results[key]["Type"] === "Withdrawal" ? -1 : 1; 
                results["Transactions"][day] += (results[key]["Amount"] * factor);
            }
            else {
                let factor = results[key]["Type"] === "Withdrawal" ? -1 : 1; 
                results["Transactions"][day] = (results[key]["Amount"] * factor);
            }
            delete results[key];
        }
    }
    delete results["Starting Date"];
    results["Ending Date"] = date_to_number(results["Ending Date"]) - start_day;
    return results 
}

/* we're trying to find the daily rate of return that gives us the ending balance */

function try_rate(rate, results){
    let money = results["Starting Balance"];
    let day = 0;
    while (day < results["Ending Date"]){
        money *= (1 + rate);
        if (day in results["Transactions"]){
            money += results["Transactions"][day];
        }
        day += 1;
    }
    return money;
}

function binary_search_for_correct_rate(results){
    let start = -1;
    let end = 1;
    let mid = 0;
    let rate = 0;
    while (start < end){
        mid = (start + end) / 2;
        rate = try_rate(mid, results);
        /* stop if the ending balance is within 0.01 of our prediction */
        if (Math.abs(rate - results["Ending Balance"]) < 0.01){
            return mid;
        }
        else if (rate > results["Ending Balance"]){
            end = mid;
        }
        else {
            start = mid;
        }
    }
    return mid;
}

function get_yearly_rate(original_results){
    //copy original_results into results
    let results = Object.assign({}, original_results);
    results = clean(results);
    let rate = binary_search_for_correct_rate(results);
    console.log("Rate: " + rate);
    let yearly = (1 + rate)**365 - 1;
    console.log("Return: " + yearly);
    return Math.round(yearly * 10000) / 100;
}

export { get_yearly_rate };
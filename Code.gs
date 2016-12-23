function getFullAccountData() {

  refreshToken(); //Call the refresh token function
  
//Get the currently stored token.
  //Call the script properties service and get the script properties.
  var scriptProperties = PropertiesService.getScriptProperties(); 
  //Get the current token from the script properties service
  var token =  scriptProperties.getProperty('token'); 
  //Add "Bearer " to the beginning of the token string.
  token ='Bearer '+token; 
  


//Get basic account information
  //Call the requestBasicAccountData function, parse the JSON output and retreive the account information.
  var result = requestBasicAccountData(token);//call
  var account = JSON.parse(result).accounts;
  var acc_id = account[0].id
  var created = account[0].created
  var description = account[0].description


  
//Get balance and today's spend
  //Call the requestAccountBalance function, parse the JSON output and retreive the balance and spend information.
  var result = requestAccountBalance(token,acc_id)
  var balance = JSON.parse(result).balance;
  var spentToday = JSON.parse(result).spend_today;
  
  
  
//Get transactions list.
  //Call the requestTransactionsList function and parse the JSON output.
  var result = requestTransactionsList(token,acc_id);
  var transactions = JSON.parse(result).transactions;


//Get the spreadsheet and ranges.
  //Get the spreadsheet attached to this script.
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  //Get the data dump sheet.
  var sheet = ss.getSheetByName("DataDump"); 
  //Define the "A1" notation of the cells to be manipulated as a string.
  var cellRange = "A2:Q"; 
  //Get the range of cells to be manipulated.
  var range = sheet.getRange(cellRange); 
  //Get the values of the cell range to be manipulated.
  var rangeValues = range.getValues(); 
  
 
//Define variables to be used in the loop below.
  //Length of the range.
  var length = transactions.length;
  //Row number, incrimented while the do loop runs.
  var rowNum = 0;
  //Number of transactions.
  var transactionNum = length-1;
  //Variable used to trigger an exit from the loop.
  var exit = false

//Loop through each transaction to populate the spreadsheet, each value uses a try-catch loop to place values where a transaction does not contain some data.
  do{

    //Transaction ID
    try{rangeValues[rowNum][0] = transactions[transactionNum].id;}catch(err){exitLoop = true;}
    //Merchant Name
    try{rangeValues[rowNum][1] = transactions[transactionNum].merchant.name;}catch(err){rangeValues[rowNum][1] = "None"}
    //Local Currency
    try{rangeValues[rowNum][2] = transactions[transactionNum].local_currency;}catch(err){rangeValues[rowNum][2] = ""}
    //Local Amount
    try{rangeValues[rowNum][3] = transactions[transactionNum].local_amount;}catch(err){rangeValues[rowNum][3] = ""} 
    //Home Currenct Amount
    try{rangeValues[rowNum][4] = transactions[transactionNum].amount;}catch(err){rangeValues[rowNum][4] = ""}  
    //Notes
    try{rangeValues[rowNum][5] = transactions[transactionNum].notes;}catch(err){rangeValues[rowNum][5] = ""} 
    //Time / date created
    try{rangeValues[rowNum][6] = transactions[transactionNum].created;}catch(err){rangeValues[rowNum][6] = ""} 
    //Time / date settled
    try{rangeValues[rowNum][7] = transactions[transactionNum].settled;}catch(err){rangeValues[rowNum][7] = ""}  
    //Reason for decline
    try{rangeValues[rowNum][8] = transactions[transactionNum].decline_reason;}catch(err){rangeValues[rowNum][8] = ""} 
    //Account balance after transaction
    try{rangeValues[rowNum][9] = transactions[transactionNum].account_balance;}catch(err){rangeValues[rowNum][9] = ""} 
    //First category (Metadata added by this script)
    try{rangeValues[rowNum][10] = transactions[transactionNum].metadata.Category_1;}catch(err){rangeValues[rowNum][10] = ""} 
    //Second category (Metadata added by this script)
    try{rangeValues[rowNum][11] = transactions[transactionNum].metadata.Category_2;}catch(err){rangeValues[rowNum][11] = ""} 
    //Third category (Metadata added by this script)
    try{rangeValues[rowNum][12] = transactions[transactionNum].metadata.Category_3;}catch(err){rangeValues[rowNum][12] = ""} 
    
    //Decrement Transaction Number
    transactionNum--
    //Increment row number
    rowNum++
        
      //If the transaction number is below 0, set the flag to exit the loop.
      if(transactionNum < 0){exit = true};
  //Exit the loop.
  }while(exit == false)
    
  //Write the valued to the spreadsheet in a single call.
  range.setValues(rangeValues)
  
}

/*--------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------*/


function addKeysToAllTransactions(){
  
  //Call the refresh token function
  refreshToken(); 
  
//Get the currently stored token.
  //Call the script properties service and get the script properties.
  var scriptProperties = PropertiesService.getScriptProperties(); 
  //Get the current token from the script properties service
  var token =  scriptProperties.getProperty('token'); 
  //Add "Bearer " to the beginning of the token string.
  token ='Bearer '+token; 
  

  //Get the current spreadsheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  //Get the correct sheet.
  var sheet = ss.getSheetByName("DataDump");
  //Get a range from the spreadsheet.
  var range = sheet.getRange("A2:M");
  //Get values for the range for manipulation.
  var rangeValues = range.getValues();
  //Define a number to be used in the loop below.
  var num = 0;
  
  //Calculate number of transactions by looping over until the transaction ID is blank
  
  while(transactionID != ""){
  var transactionID = rangeValues[num][0];
    num++
  };
  // subtract 1 to prevent spilling over onto the first blank line
  var lastNum = num -1 
  
  //Reset the num variable to 0
  num = 0;
  
  //Loop over the range from the spreadsheet and get the categories, for each category send a PATCH request to add the data to the transaction.
  while(num < lastNum){
    //Get categories from each transaction listed on the spreadsheet.
    var transactionID = rangeValues[num][0];
    var cat_1 = rangeValues[num][10];
    var cat_2 = rangeValues[num][11];
    var cat_3 = rangeValues[num][12];

    //Increment the counter
    num++
      
    //Make an API call to add the data to each transaction.
    var url = "https://api.monzo.com/transactions/"+transactionID;
    var options = {
    'method': 'PATCH',
    'headers': {"Authorization" : token},
    'payload' : {'metadata[Category_1]': cat_1,
                'metadata[Category_2]': cat_2,
                'metadata[Category_3]': cat_3}};

    
        var retVal = UrlFetchApp.fetch(url,options).getContentText();


  };


 }


/*--------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------*/

function updateCategories(){
  
  

  refreshToken(); //Call the refresh token function
  
    //Define Variables
  var scriptProperties = PropertiesService.getScriptProperties();
  
 var token =  scriptProperties.getProperty('token');
  
 var token ='Bearer '+token;
  


  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DataDump");
    var range = sheet.getRange("A2:Q");
    var rangeValues = range.getValues();

  
  var result = requestBasicAccountData(token);

  var account = JSON.parse(result).accounts;
 // var account = out.accounts;
  
  var acc_id = account[0].id

  
  
  var result = requestTransactionsList(token,acc_id);
  var transactions = JSON.parse(result).transactions.reverse();
  var length = transactions.length - 1;
  
  var transactionList = [];
  Logger.log(transactionList);
  var num = 0;
  
  while(num<length){
    
    if(transactions[num].metadata.notes != rangeValues[num][5] || transactions[num].metadata.Category_1 != rangeValues[num][10] || transactions[num].metadata.Category_2 != rangeValues[num][11] ||transactions[num].metadata.Category_3 != rangeValues[num][12] ){

      transactionList.push(rangeValues[num][0])
      Logger.log(transactions[0].metadata.id)
      Logger.log(num)
      
      var transactionID = rangeValues[num][0]
      
      var url = "https://api.monzo.com/transactions/"+transactionID;
  var options = {
    'method': 'PATCH',
    'headers': {"Authorization" : token},
    'payload' : {'metadata[notes]': rangeValues[num][5],
                 'metadata[Category_1]': rangeValues[num][10],
                 'metadata[Category_2]': rangeValues[num][11],
                 'metadata[Category_3]': rangeValues[num][12]}
  };

    

      
        var retVal = UrlFetchApp.fetch(url,options).getContentText();
      
    }
    
    num++
  }
  
}

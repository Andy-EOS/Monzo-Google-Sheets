function doPost(e) {
  
  var scriptProperties = PropertiesService.getScriptProperties();
  
  var email_address = scriptProperties.getProperty('email_address');
  var storedWebhookVar = scriptProperties.getProperty('webhookVerification');
  var recdWebhookVar = e.parameter.webhookVar

  
  if(recdWebhookVar == storedWebhookVar){
    
    var rawdata = e.postData.getDataAsString();
    var webhookType = JSON.parse(rawdata).type;
    var data = JSON.parse(rawdata).data;
  
    if(webhookType == "transaction.created"){
    
      transactionCreated(data);

    }else{
      MailApp.sendEmail(email_address, "Unknown Webhook Type", "An unknown webhook type has been received: "+webhookType+"\n\n\nContent:\n\n"+data)
    }
 
  }else{
   MailApp.sendEmail(email_address, "Invalid Webhook", "An invalid webhook code has been received by the monzo scripting.\n\n"+e.parameter.webhookVar) 
    
  }
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


function transactionCreated(data){
  
  var ss = SpreadsheetApp.openById("1wxIau28By44vpJN_crHfy7GJXqhMmEcIgIRQFw1dwxg");
  var sheet = ss.getSheetByName("DataDump");
  
  var pickRange = sheet.getRange("A2:Q999");
  var pickValues = pickRange.getValues();
  var setRange = sheet.getRange("A3:Q1000");

  
  setRange.setValues(pickValues);
  
  var topLineRange = sheet.getRange("A2:Q");
  var topLine = topLineRange.getValues();
  
  


  
  topLine[0][0] = data.id;
  try{topLine[0][1] = data.merchant.name;}catch(err){topLine[0][1] = ""}
  try{topLine[0][2] = data.local_currency;}catch(err){topLine[0][2] = ""}
  try{topLine[0][3] = data.local_amount;}catch(err){topLine[0][3] = ""} 
  try{topLine[0][4] = data.amount;}catch(err){topLine[0][4] = ""}  
  try{topLine[0][5] = data.notes;}catch(err){topLine[0][5] = ""}  
  try{topLine[0][6] = data.created;}catch(err){topLine[0][6] = ""}  
  try{topLine[0][7] = data.settled;}catch(err){topLine[0][7] = ""}  
  try{topLine[0][8] = data.decline_reason;}catch(err){topLine[0][8] = ""}  
  try{topLine[0][9] = data.account_balance;}catch(err){topLine[0][9] = ""} 
  topLine[0][10] = "Not Assigned";
  topLine[0][11] = "Not Assigned";
  topLine[0][12] = "Not Assigned";
  
  topLineRange.setValues(topLine);
  
  var balance = data.account_balance / 100;  //Balance in pounds
  
  if(balance < 70){
feedBalanceLow(balance)
  }
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


function recreateWebhook(){
  
    refreshToken(); //Call the refresh token function
  
    //Define Variables
 var scriptProperties = PropertiesService.getScriptProperties();
 var token =  scriptProperties.getProperty('token');
 var token ='Bearer '+token;
 var webHookURL = scriptProperties.getProperty('redirect_uri');

//Get account ID
  var result = requestBasicAccountData(token);
  var account = JSON.parse(result).accounts;
  var acc_id = account[0].id
  
  //Generate a string to verify the webhook
    var scriptProperties = PropertiesService.getScriptProperties();
    var webhookVar = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 500; i++ ){
      webhookVar += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  scriptProperties.setProperty('webhookVerification', webhookVar);
  
  

  
  
  //Get existing webhooks
  
      var url = 'https://api.monzo.com/webhooks?account_id='+acc_id;
  var options = {
    'method': 'get',
    'headers': {"Authorization" : token},
};//
    var retVal = UrlFetchApp.fetch(url,options).getContentText();
      Logger.log(retVal+"\n\n\n\n")
  var json = JSON.parse(retVal).webhooks
  var prevWebhookID = json[0].id;
  Logger.log(prevWebhookID);
  

  
  //Delete existing webhook
  
        var url = 'https://api.monzo.com/webhooks/'+prevWebhookID;
  var options = {
    'method': 'delete',
    'headers': {"Authorization" : token},
};
    var retVal = UrlFetchApp.fetch(url,options).getContentText();
  

  
  
  
    //Register the webhook
  var url = "https://api.monzo.com/webhooks"
  var hookurl = webHookURL+"?webhookVar="+webhookVar
  
    var payload = {
         'account_id' : acc_id,
    'url' : hookurl 
  }
  
  var options = {
    'method': 'post',
    'headers': {"Authorization" : token},
    'payload': payload
  }
    
    
    
       var retVal = UrlFetchApp.fetch(url,options).getContentText();

}

function createInitialWebhook(){
  
      refreshToken(); //Call the refresh token function
  
    //Define Variables
 var scriptProperties = PropertiesService.getScriptProperties();
 var token =  scriptProperties.getProperty('token');
 var token ='Bearer '+token;
  var webHookURL = scriptProperties.getProperty('redirect_uri');

//Get account ID
  var result = requestBasicAccountData(token);
  var account = JSON.parse(result).accounts;
  var acc_id = account[0].id
  
    //Generate a string to verify the webhook
    var scriptProperties = PropertiesService.getScriptProperties();
    var webhookVar = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 500; i++ ){
      webhookVar += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  scriptProperties.setProperty('webhookVerification', webhookVar);
  
      //Register the webhook
  var url = "https://api.monzo.com/webhooks"
  var hookurl = webHookURL+"?webhookVar="+webhookVar
  
    var payload = {
         'account_id' : acc_id,
    'url' : hookurl 
  }
  
  var options = {
    'method': 'post',
    'headers': {"Authorization" : token},
    'payload': payload
  }
  
          var retVal = UrlFetchApp.fetch(url,options).getContentText();
  
}

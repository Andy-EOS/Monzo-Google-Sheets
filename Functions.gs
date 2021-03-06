function requestBasicAccountData(token) {
  
    var url = 'https://api.monzo.com/accounts';
  var options = {
    'method': 'get',
    'headers': {"Authorization" : token},
};
  

    var retVal = UrlFetchApp.fetch(url,options).getContentText();
  


  return(retVal)
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

function requestAccountBalance(token,accountID) {
  
    var url = 'https://api.monzo.com/balance?account_id='+accountID;
  var options = {
    'method': 'get',
    'headers': {"Authorization" : token},
};
    var retVal = UrlFetchApp.fetch(url,options).getContentText();


  
  return(retVal)
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

function requestTransactionsList(token,accountID){

var url = "https://api.monzo.com/transactions?expand[]=merchant&account_id="+accountID;
  var options = {
    'method': 'get',
    'headers': {"Authorization" : token}
  }
    
        var retVal = UrlFetchApp.fetch(url,options).getContentText();
    
      return(retVal)
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

function feedBalanceLow(balance){

  
  refreshToken();
  
 var scriptProperties = PropertiesService.getScriptProperties();
  
 var token =  scriptProperties.getProperty('token');
  
 var token ='Bearer '+token;
  
   var result = requestBasicAccountData(token);//call
  var account = JSON.parse(result).accounts;
 var accountID = account[0].id
  
  var url = "https://api.monzo.com/feed";
  var body = "Topup Needed. Balance: £"+balance;
  var title = 'Balance Low: £'+balance;

  
  var payload = {
    'account_id' : accountID
    ,'type' : 'basic'
    ,'params[title]' : title
    ,'params[image_url]' : 'http://businessinsurance.org/wp-content/uploads/2012/01/bankrupt/graph.jpg'
    ,'params[body]' : body
  }
  
  
  var options = {
    'method': 'post',
    'headers': {"Authorization" : token}
    ,'payload' : payload
  }
    
    
    
        var retVal = UrlFetchApp.fetch(url,options).getContentText();
    
      return(retVal)
    
    
  }

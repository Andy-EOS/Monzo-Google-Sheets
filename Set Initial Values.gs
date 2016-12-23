function setInitial() {
  
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('client_secret', 'Enter your value here'); // Take this from your monzo developer page.
  scriptProperties.setProperty('redirect_uri', 'Enter your value here'); //The url of this script when it's published.
  scriptProperties.setProperty('client_id', 'Enter your value here'); // Take this from your monzo developer page.
  scriptProperties.setProperty('email_address', 'Enter your value here'); // Your email address.
  
  

}

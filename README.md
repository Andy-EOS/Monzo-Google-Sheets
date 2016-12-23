# Monzo-Google-Sheets
Scripts to sync data betweeen a google sheet and Monzo account

This script polls the API and inputs transaction data into a google spreadsheet. It also allows you to add your own custom categories (these will not appear in the Monzo iphone or android app).
The scripts create a webhook which contains a random identifier (changed daily) as a basic check that any data received is genuine. This allows any new transactions you make to be added to the sheet instantly.

The OAUTH process is also contained, once you have initially logged in and set everything up per the instructions below tokens should refresh when required automatically.

If you have any problems drop me a line in the slack channel @andyl or the monzo community forums @Andy1

Disclaimers:

Some of the code is messy, poorly annotated and inneficient. Improvements will probably be made in time.
If you use this code you are taking it 'as is'. I offer no guarantees to it's reliability or sutibility for your use. But I will try to help you out.

I'll be adding some spending per category / sub-category breakdowns sometime soon.

I have not included the spreadsheet itself as it still needs work.

Instructions:

1. Copy ALL files from github into script files (open a google sheet ---> tools ----> script editor

2. Publish your script as a web app.

3. Create a client on the monzo developer tools page, the redirect URL is the address of the published script.

4. Populate and run the 'setInitial()' function and run it. Allow the permissions.

5. In the OAUTH file run the 'returnURL()' function. When it finished go View---> Logs. Copy then entire URL into a new browser tab.

6. You should end up at a Monzo auth screen, follow the instructions there.

7. The link you receive by email will send you to your script. If all goes well you should see the text 'Authentication complete'

8. On you Spreadsheet ensure you have a tab called "DataDump".

9. Run the script 'getFullAccountData()' this should populate the tab.

10. Columns K, L and M are there for you to assign your own categories. You can put anything you want here, I'll be doing some spending breakdown stuff using that when I have time. If you are not assigning either a first, second or third category please use 'None' or some other word to denote no category.

11. There are two functions, 'addKeysToAllTransactions()' will go through EVERY transaction on your list and add all three categories to them. This takes some time. If you have had a card for a long time it might timeout.
'updateCategories()' will check each transaction to see if the three categories AND the transaction note match, only non-matching transactions will be updated. 

12. Set up timed triggers for the for the two functions under 'Timed Triggers'
13. Under 'WebHooks' run 'createInitialWebhook()'.

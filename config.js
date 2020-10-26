function init_consts(num_entries) {
  /*---------------------------------------------------------------------------------*/ 
  /* This function contains all the static configurations needed to run the finance  */
  /* fetching scripts                                                                */
  /* PLEASE NOTE that a lot of data here is personal data that I have stripped before*/
  /* commiting to git - make sure that everything is configured according to your    */
  /* needs                                                                           */
  /*---------------------------------------------------------------------------------*/ 
  
  /*---------------------------------------------------------------------------------*/ 
  /* input num_entries - this is the number of monitored stock symbols */
  /*---------------------------------------------------------------------------------*/ 
  
  /*---------------------------------------------------------------------------------*/ 
  /* You can get your RAPID API key by making an account at Rapid Api  */
  /* This script uses Yahoo Finance by ApiDojo                         */
  /* You can try other Finance APIs - use the fetch method for it      */
  /* Attention - the Rapid API KEY is personal data !!                 */
  /* Replace your Rapid API KEY here:                                  */
  /*---------------------------------------------------------------------------------*/  
  const RAPID_API_KEY = "YOUR_PERSONAL_RAPID_API_KEY_HERE";
  
  /*---------------------------------------------------------------------------------*/ 
  /* This is the fetch command generated by the Rapid API                       */
  /* site using Yahoo Finance by ApiDojo                                        */
  /* Generate this fetch command at https://rapidapi.com/apidojo/api/yahoo-finance1?endpoint=apiendpoint_33e0cec5-0f8a-4f9f-a6dc-018e6762fbe7 */
  /* The fetch command can be found in the drop-down menu: Java Script -> fetch */
  /*---------------------------------------------------------------------------------*/  
  const RAPID_REQUEST = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?symbols= YOUR_MONITORED_STOCKS_WILL_BE_HERE_WITH_OTHER_CHARACTERS ";
  
  /*---------------------------------------------------------------------------------*/  
  /* In order to get the google sheet id you can copy-paste it directly from the URL:*/
  /* https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit#gid=<not_used_in_script> */
  /* Attention - the google Sheet ID is personal data !!                             */
  /* Replace your sheet ID here:                                                     */
  /*---------------------------------------------------------------------------------*/  
  const SHEET_ID = "YOUT_PERSONAL_SHEET_ID"; 
  
  /*---------------------------------------------------------------------------------*/
  /* In order to send emails when prices drop below a certain treshold, fill     */
  /* in your email address in the EMAIL_ADDRESS field                            */
  /* Attention - the email address is personal data !!                           */
  /* EMAIL_ALARM_MODE - 0 = NO alarm is being sent (no need for email address)   */
  /* EMAIL_ALARM_MODE - 1 = alarm is being sent only for the BUY alarm           */
  /* EMAIL_ALARM_MODE - 2 = alarm is being sent for any kind of alarm            */
  /*---------------------------------------------------------------------------------*/
  const EMAIL_ADDRESS = "YOUR_EMAIL_ADDRESS@PROVIDER.com";
  const EMAIL_ALARM_MODE = 2;
  
  /*--------------------------------------------------------------------------------*/
  /* This section specifies fields used inside the designated Google Sheet chosen   */
  /*--------------------------------------------------------------------------------*/
  const WR_SHEET_NUM = 1;                                    /* sheet number in which latest market data is written */
  const WR_SHEET_RANGE = "A2:D"+ (num_entries+1).toString(); /* write location column index */ 
  const PERCENT_RANGE = "D2:D"+ (num_entries+1).toString();  /* write location for % changes */
  const COLOR_RANGE = "D";                                   /* where to color % changes */
  const ALARM_RANGE = "E";                                   /* where to color BUY/SELL signals */
  const DATE_TXT_CELL = "A" + (num_entries + 3).toString();  /* where to write script execution date text */
  const DATE_CELL = "B" + (num_entries + 3).toString();      /* where to write script execution date */
  /*--------------------------------------------------------------------------------*/
  /* Inside the MOS sheet there should be 2 columns: 
  /* - one containing the stock symbols that you chose to monitor in the same order */ 
  /*   that you chose to monitor in the RAPID_REQUEST (ex: column A) */
  /* - one adiacent column (ex: column B) in whith you write your monitoring price  */ 
  /*   (ex: 76.25)     */
  /*--------------------------------------------------------------------------------*/
  const MOS_PRICE_SHEET = 0;                                 /* fetch the Margin Of Safety price from this sheet number */
  const MOS_CELL_RANGE = "B2:B"+ (num_entries+1).toString(); /* cells from which to fetch the MOS price - be carefull of the order */
  /*--------------------------------------------------------------------------------*/
 
  /* Bundle everything up in a usable object */
  var config = new Object();
  config.RAPID_API_KEY = RAPID_API_KEY;
  config.RAPID_REQUEST = RAPID_REQUEST;
  config.SHEET_ID = SHEET_ID;
  config.NUM_ENTRIES = num_entries;
  config.WR_SHEET_NUM = WR_SHEET_NUM;
  config.WR_SHEET_RANGE = WR_SHEET_RANGE;  
  config.PERCENT_RANGE = PERCENT_RANGE;
  config.COLOR_RANGE = COLOR_RANGE;
  config.ALARM_RANGE = ALARM_RANGE;
  config.DATE_TXT_CELL = DATE_TXT_CELL;
  config.DATE_CELL = DATE_CELL;
  config.MOS_PRICE_SHEET = MOS_PRICE_SHEET;
  config.MOS_CELL_RANGE = MOS_CELL_RANGE;
  config.EMAIL_ADDRESS = EMAIL_ADDRESS;
  config.EMAIL_ALARM_MODE = EMAIL_ALARM_MODE;
   
  return config;
}

function fetch_process_stocks() {
  /*---------------------------------------------------------------------------------*/ 
  /* This function is used to automatically monitor several stock values by using the  */
  /* google scripts and google sheets API and tools.                                   */
  /* In order to use this scripts please read the HowTo.txt and please configure your  */
  /* personal data as described in the HowTo.txt document and configuration comments   */
  /* I hope this script prooves usefull to you as it does to me - although right now   */
  /* the stock market is waaay overwalued (just between you and me :P )                */
  /*---------------------------------------------------------------------------------*/ 
  
  /*--------------------------------------------------------------------------------*/
  const NUM_ENTRIES = 8;     /* Watching 8 stocks */
  /*--------------------------------------------------------------------------------*/
  
  /* Initialize Rapid API KEY, sheet ID, sheet numbers and ranges */
  const config = init_consts(NUM_ENTRIES);
  
  /* The actual request and RAPID API key must be set in the configuration file */
  var response_fin = UrlFetchApp.fetch(config.RAPID_REQUEST, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		"x-rapidapi-key": config.RAPID_API_KEY
	}
   });  
  
  /* Parse the read data from the RAPID API request */
  var json = response_fin.getContentText();
  var data_fin = JSON.parse(json);
  
  /* Open a specific google sheets --------------------------------------- */  
  var spreadsheet = SpreadsheetApp.openById(config.SHEET_ID);
  
  /* Set the sheet to the MOS price sheet ---------------------------------*/
  var MOS_sheet = spreadsheet.getSheets()[config.MOS_PRICE_SHEET];
  var MOS_data = MOS_sheet.getRange(config.MOS_CELL_RANGE).getValues();
  
  /* Set the sheet to the writting sheet ----------------------------------*/
  var tst_sheet = spreadsheet.getSheets()[config.WR_SHEET_NUM];
  
  /* Set the first sheet as the active sheet */
  spreadsheet.setActiveSheet(tst_sheet);
  
  /* Write header names and date  ---------------------------------------- */
  spreadsheet.getRange('A1').setValue('Symbol');
  spreadsheet.getRange('B1').setValue('Current Value');
  spreadsheet.getRange('C1').setValue('Last Close');
  spreadsheet.getRange('D1').setValue('Evolution %');
  spreadsheet.getRange('E1').setValue('ALARM');
  
  var date = Utilities.formatDate(new Date(), "GMT+3", "G' 'dd/MM/yyyy' 'kk':'mm' 'a");
  spreadsheet.getRange(config.DATE_TXT_CELL).activate();
  spreadsheet.getRange(config.DATE_TXT_CELL).setBackground("yellow");
  spreadsheet.getCurrentCell().setValue("Date:");
  
  spreadsheet.getRange(config.DATE_CELL).activate();  
  spreadsheet.getRange(config.DATE_CELL).setFontWeight("bold");
  spreadsheet.getCurrentCell().setValue(date);
  
  spreadsheet.getRange(config.PERCENT_RANGE).setNumberFormat("#.###%");
  
  /* Process numbers that will go into google sheets --------------------- */
  /* Get a 2D array made out of cells  */
  var range = spreadsheet.getRange(config.WR_SHEET_RANGE).activate();
  var fin_data = spreadsheet.getRange(config.WR_SHEET_RANGE).getValues();
  
  /* Stock, quote and last_close not really needed, they could be directly put into fin_data  */  
  var idx = 0;
  var stock = new Array(config.NUM_ENTRIES);
  var quote = new Array(config.NUM_ENTRIES);
  var last_close = new Array(config.NUM_ENTRIES);
  var temp = 0;
  for(idx = 0; idx < config.NUM_ENTRIES; idx++)
  {
    /* placed for examples sake */
    stock[idx] = data_fin.quoteResponse.result[idx].symbol;
    quote[idx] = data_fin.quoteResponse.result[idx].regularMarketPrice;
    last_close[idx] = data_fin.quoteResponse.result[idx].regularMarketPreviousClose;
        
    /* fin_data will be used to fetch - put data into the sheets */
    fin_data[idx][0] = data_fin.quoteResponse.result[idx].symbol;
    fin_data[idx][1] = data_fin.quoteResponse.result[idx].regularMarketPrice;
    fin_data[idx][2] = data_fin.quoteResponse.result[idx].regularMarketPreviousClose;
    /* divide by 100 because we format the cell as % */
    fin_data[idx][3] = data_fin.quoteResponse.result[idx].regularMarketChangePercent/100;
  }
  
  /* write new range to google sheets ------------------------------------ */
  range.setValues(fin_data);  
  
  /* process the evolution percentages according to sign and color cells - */
  idx = 0;
  var color_cell, alarm_cell;
  var diff_to_MOS;
  var alarm_color_res;
  for(idx = 0; idx < config.NUM_ENTRIES; idx++)
  {
    color_cell = config.COLOR_RANGE + (idx+2).toString();
    spreadsheet.getRange(color_cell).activate(); 
    if(fin_data[idx][3] < 0) {
      spreadsheet.getRange(color_cell).setBackground("red");
    } else {
      spreadsheet.getRange(color_cell).setBackground("green");
    }
    
    /* Look for deals - send email if a deal pops up */
    alarm_cell = config.ALARM_RANGE + (idx+2).toString();
    diff_to_MOS = fin_data[idx][1] / MOS_data[idx] ;
    alarm_color_res = alarm(diff_to_MOS, fin_data[idx][0], fin_data[idx][1], config);
    spreadsheet.getRange(alarm_cell).setBackground(alarm_color_res.cell_color);
    spreadsheet.getRange(alarm_cell).setValue(alarm_color_res.cell_text);
  }
}

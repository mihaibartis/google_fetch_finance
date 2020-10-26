function alarm(diff_value, symbol, value, config) {
  /*---------------------------------------------------------------------------------*/ 
  /* This function is used in order to send email notifications and specifically color */
  /* price cells inside the targeted (configured) google sheet according to set price  */
  /* thresholds (set manually inside the MOS price google sheet)                       */
  /* inputs:                                                                           */
  /*     diff_value - difference between last close price and current price            */
  /*     symbol     - stock symbol for which the difference has been fed               */
  /*     value      - current value of the stock                                       */
  /*     config     - object copntaining script configuration                          */
  /*---------------------------------------------------------------------------------*/ 
  
  /* Select the default alarm color */
  var cell_alarm = new Object();
  var alarm_threshold = 1.5;        /* Set for EMAIL_ALARM_MODE = 2 by default */
  cell_alarm.cell_color = "ORANGE";
  cell_alarm.cell_text = "NADA";
    
  /* Switch the value of the difference */
  if (diff_value <= 1) {
    /* Lime means BUY when indicators are good  - MOS price reached */
    cell_alarm.cell_color = "LIME";
    cell_alarm.cell_text = "BUY";
  } else if ((diff_value > 1) && (diff_value <= 1.3)) {
    /* Current price between 0% and 30% more expensive then MOS price */
    cell_alarm.cell_color = "BLUE";
    cell_alarm.cell_text = "CAUTIOUS";
  } else if ((diff_value > 1.3) && (diff_value <= 1.5)) {
    /* Current market price between 30% and 50% larger than MOS price */
    cell_alarm.cell_color = "YELLOW";
    cell_alarm.cell_text = "WATCH";
  } 
      
  if(config.EMAIL_ALARM_MODE > 0) {
    /* if EMAIL_ALARM_MODE = 1 - everything under 1 triggers an email motification */
    if (config.EMAIL_ALARM_MODE == 1) {
      alarm_threshold = 1;
    }
    
    if (diff_value <= alarm_threshold) {
      var subject = cell_alarm.cell_text + ' ALARM on: ' + symbol;
      var message = "Stocks for: " + symbol + "are now at: " + value.toString() + " USD";
      MailApp.sendEmail(config.EMAIL_ADDRESS, subject, message);
    }
  }
  
  return cell_alarm;
    
}

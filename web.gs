//プレビュー表示用
function pon(){
  var html =  HtmlService.createHtmlOutputFromFile("linkman").setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(530).setWidth(1000);
  SpreadsheetApp.getUi().showModalDialog(html, "リンク集");
}

//プレビュー表示用
function doGet(){
  var html =  HtmlService.createHtmlOutputFromFile("linkman").setSandboxMode(HtmlService.SandboxMode.IFRAME).setHeight(530).setWidth(1000);
  return html;
}


//ウェブアプリケーションへデータをコールバック
function retdata(){
  var Properties = PropertiesService.getScriptProperties();
  var sheetid = Properties.getProperty("sheetid");
  
  //シートデータの取得
  var sheet = SpreadsheetApp.openById(sheetid);
  var ss = sheet.getSheetByName("data");
  var range = ss.getRange("A2:E").getValues();
  return JSON.stringify(range);
}
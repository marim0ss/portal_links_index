// V8は無効のままにしておく 追加修正時はdev用にコピーを別途作り、そこで作業→Git Pullでこの本番に反映する
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('▶リンク集作成')
      .addItem('セットアップ', 'setup')
      .addSeparator()
      .addItem('データ作成', 'openSidebar')
      .addSeparator()
      .addItem('プレビュー', 'pon')
      .addToUi();
}

//セットアップ
function setup(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetId = sheet.getId();
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.setProperty("sheetid",sheetId);
  
  SpreadsheetApp.getUi().alert("セットアップ完了");
}

//入力用コンソールをsidebarで表示する
function openSidebar() {
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.deleteProperty("url");
  var spfile = Properties.deleteProperty("name");
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createTemplateFromFile("index").evaluate().setTitle('データ作成').setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showSidebar(html);
}

//sidebarをリロードする
function reloadside(){
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createTemplateFromFile("index").evaluate().setTitle('データ作成').setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showSidebar(html);
}

//OAuth認証
function getOAuthToken() {
  DriveApp.getRootFolder();　//なにげにこの部分重要！！
  return ScriptApp.getOAuthToken();
}

//Pickerを開く
function showPicker(){
  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
      .setWidth(750).setHeight(480);
  SpreadsheetApp.getUi().showModalDialog(html, '対象物のURLを取得');
}

//Picker用コールバック関数
function telepon(url,id,title){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.setProperty("url",url);
  var spfile = Properties.setProperty("id",id);
  var spfile = Properties.setProperty("name",title);
  reloadside();
  SpreadsheetApp.getUi().alert("対象のURLを取得しました。");
}

//index.htmlロード時に自動的にロードする関数
function urlget(){
  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.getProperty("url");
  var spname = Properties.getProperty("name");
  
  var array = [];
  
  if(spfile == null){
    array.push("");
  }else{
    array.push(spfile);
  }

  if(spname == null){
    array.push("");
  }else{
    array.push(spname);
  }
  
  return JSON.stringify(array);
}

//index.htmlロード時に自動的にロードする関数２
function selectman(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName("setting");
  var range = ss.getRange("B2:B").getValues();
  var html = "<p><select title='リンク先の分類を選択' id='kinoko4' class='wasabi'><option>リンク先分類を選択</option>"
  
  //プルダウンメニューを構築
  for(var i = 0;i<range.length;i++){
    if(range[i] == ""){
      continue;
    }
    html += "<option>" + range[i] + "</option>";
  }
  
  html += "</select></p>";
  
  return JSON.stringify(html);

}

//レコードをappendRow
function insertPara(array){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName("data");
  var tempkoumoku = "GAファイル";
  
  //arrayデータを整形し直して、項目を追加する
  var dataArray = [];
  dataArray.push(array[1]);
  dataArray.push(array[0]);
  dataArray.push(array[2]);
  
  var str = String(array[0]);
  if(str.indexOf("folderview?id") != -1){
    //Folderの場合の処理
    tempkoumoku = "GAフォルダ";
  }else{
    if(str.indexOf("docs.google.com") != -1){
    }else{
      if(str.indexOf("drive.google.com") != -1){
      }else{
        tempkoumoku = "外部ページ";
      }
    }
  }
  
  dataArray.push(tempkoumoku);
  dataArray.push(array[3]);
  
  //スプレッドシートへレコード追加
  ss.appendRow(dataArray);

  var Properties = PropertiesService.getScriptProperties();
  var spfile = Properties.deleteProperty("url");
  var spfile = Properties.deleteProperty("name");

  sheet.toast('完了。無事追加されました。', "処理完了", 4);
  return true;

}
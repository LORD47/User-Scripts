// ==UserScript==
// @name         Whats this address
// @namespace    http://tampermonkey.net/
// @version      0.1.4.0
// @description  HG532e router Mac address device owner description
// @match        http://192.168.1.1/html/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

var $j = jQuery.noConflict(true);

var lang = {eng:{addBtn:"Add", updateBtn:"update", removeBtn:"Remove", closeBtn:"close", viewAllAddrBtn: {label: "i", title: "List of all saved MAC Addresses", noSavedAddr: "No saved MAC address!", noMoreAddr: 'No more saved MAC addresses!', confirmDelete: "Do you really want to remove this MAC Address?", tooltip: {view: "View all saved MAC Addresses", edit: "Validate this saved MAC address", remove: "Remove this saved MAC address"}}, addrMacInfo: "MAC Address", addrMacOwnerInfo: "of",
                 addError: "Invalid MAC Address or an empty name!", removeError: "Invalid MAC Address!"},
            fr:{addBtn:"Ajouter", updateBtn:"Modifier", removeBtn:"Supprimer", closeBtn:"Fermer", viewAllAddrBtn: {label: "i", title: "Liste de toutes les adresses MAC enregistrées", noSavedAddr: "Aucune addresse MAC enregistrée!", noMoreAddr: 'Aucune autre adresse MAC!', confirmDelete: "Voulez-vous vraiment supprimer cette adresse MAC?", tooltip: {view: "Voir toutes les adresses MAC enregistrées", edit: "Valider cette adresse MAC enregistrée", remove: "Supprimer cette adresse MAC enregistrée"}}, addrMacInfo: "Adresse MAC", addrMacOwnerInfo: "de",
                addError: "Adresse MAC invalide ou un nom vide!", removeError: "Adresse MAC invalide!"}};

function getDialogBox()
{
 var currentLang = getLang();

 var dlgBox = '<div id="wb-dlgBox" style="display: none; position: fixed; border:black solid 1px;  padding: 10px; margin:0 auto 0 auto; left: 10px; top: 20px; z-index:99; border-radius: 5px;">'
              +'<label for="wb-addr">'+ lang[currentLang].addrMacInfo +':</label><input type="text" id="wb-addr" value=""/>'
              +'<label for="wb-addrOwner" style="margin-left: 5px;">'+ lang[currentLang].addrMacOwnerInfo +':</label><input type="text" id="wb-addrOwner" value=""/>'
              +'<a id="viewAllSavedAddr" style="float: right; margin-left: 2px;" title="'+ lang[currentLang].viewAllAddrBtn.tooltip.view +'"><i class="material-icons md-18">info</i></a>'
              +'<br>'
              +'<button name="closeDlgBoxDiv" id="wb-closeDlgBoxDiv" style="float: right; margin: 5px 0px 0px 5px;">'+ lang[currentLang].closeBtn +'</button>'
              +'<button name="removeMacAddr" id="wb-removeMacAddr" style="float: right; margin: 5px 0px 0px 5px;">'+ lang[currentLang].removeBtn +'</button>'
              +'<button name="addMacAddr" id="wb-addMacAddr" style="float: right; margin-top: 5px">'+ lang[currentLang].addBtn +'</button>'
              +'</div>';

 return dlgBox;
}



function viewAllSavedAddr()
{
 var currentLang = getLang();

 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 var dlgBoxDiv = $j(topmostFramesMainBody).find('#wb-AllAddrBox');

 if(!dlgBoxDiv.length)
 {
  $j(topmostFramesMainBody).find('body').append('<div id="wb-AllAddrBox" style="width: 500px; height: 200px;"></div>');
   dlgBoxDiv = $j(topmostFramesMainBody).find('#wb-AllAddrBox');
 }

  var viewAllAddrBox = '';
  var addrs = loadAddresses();
  var idx = 0;

  Object.keys(addrs).forEach(function(key)
  {
   idx++;
   viewAllAddrBox += '<div>'
                      +'<label for="wb-addrOwner'+idx+'" class="mac-addr-list">'+ key.substr(1).replace(/(.{2})(?!$)/g,"$1:").toUpperCase() +'</label>'
                      +'<input type="text" id="wb-addrOwner'+idx+'" class="owner-name-list" value="'+ addrs[key] +'">'

                      +'<button class="editSavedAddr ui-button ui-corner-all ui-widget ui-button-icon-only ui-button-disabled ui-state-disabled" data-edit="'+idx+'"style="margin-left: 8px; width: 20px; padding: 8px;" title="'+ lang[currentLang].viewAllAddrBtn.tooltip.edit +'">'
                       +'<span class="ui-button-icon ui-icon ui-icon-check"></span>'
                      +'</button>'

                      +'<button class="removeSavedAddr ui-button ui-corner-all ui-widget ui-button-icon-only" data-remove="'+idx+'"style="margin-left: 5px; width: 20px; padding: 8px;" title="'+ lang[currentLang].viewAllAddrBtn.tooltip.remove +'">'
                       +'<span class="ui-button-icon ui-icon ui-icon-closethick"></span>'
                      +'</button>'
                     +'</div>';
  });

  if(idx == 0) // no saved MAC address
  {
   viewAllAddrBox += '<span>'+ lang[currentLang].viewAllAddrBtn.noSavedAddr+'</span>';
   $j(dlgBoxDiv).css({'display': 'flex', 'align-items': 'center', 'justify-content': 'center'}); // to center the "span" vertically and horizontally inside its parent "dlgBoxDiv"
  }
  else $j(dlgBoxDiv).css({'display': 'block', 'align-items': '', 'justify-content': ''}); // '' -> will remove the given property


  $j(dlgBoxDiv).html(viewAllAddrBox);

  $j( "#wb-AllAddrBox" ).dialog({title: lang[currentLang].viewAllAddrBtn.title, width: 500, height: 200, overflow:"auto"}).find('input').addClass("ui-widget ui-widget-content ui-corner-all ui-textfield")
    .css({"margin": "5px 0px","width": "170", "font-size": "12px", "height": "25px", "padding": "3px"})
    .siblings('label').css({"font-size": "13px", "display": "block", "width": "115px", "float": "left", "padding": "10px 10px 0px 0px", "text-align": "right"})
}


function getLang()
{
 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 var lang = "eng";

 var aLink = $j(topmostFramesMainBody).find('#setlogin');

 if(aLink.length)
 {
  lang = ($j(aLink).text().replace(/[^;]+\;(.+)/gi, '$1').toLowerCase() == 'logout' )? "eng" : "fr";
 }

return lang;
}



function loadAddresses()
{
 var addrs = {};

 if(GM_getValue("addresses", '') != '') // no saved address
 {
   addrs = JSON.parse(GM_getValue("addresses", ''));
 }

 return addrs;
}


function getSavedAddr(addr, defaultVal)
{

 var addrs = loadAddresses();
 var key = '_' + addr.toLowerCase().replace(/[\:\-\s]/gi, '');

 if(addrs.hasOwnProperty(key))
 {
   return addrs[key];
 }
 else return defaultVal;
}


function enableDisableBtns(selText, isMacAddr)
{
 // default function params
 isMacAddr = (typeof(isMacAddr) === 'undefined');

 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 var addrMacEle = getAddressOrOwner('addr');
 var addrOwnerEle = getAddressOrOwner('owner');
 var addrMacOwner;

 if(isMacAddr) // it's a MAC Address
 {
  if(isValidAddress(selText.trim())) // a valid MAC Address
  {
   $j(addrMacEle).removeClass('invalid-input');

   addrMacOwner = getSavedAddr(selText, '');
   $j(addrOwnerEle).prop('value', addrMacOwner);

   if(addrMacOwner == '') // a new MAC Address to be added
   {

    if($j(addrOwnerEle).val().trim() == '') // empty "Owner" value -> disable the "Add" button and highlight the "Owner" input field
    {
     $j(topmostFramesMainBody).find('#wb-addMacAddr').html(lang[getLang()].addBtn).prop("disabled", true);
     $j(addrOwnerEle).addClass('invalid-input');
    }
    else {
          $j(topmostFramesMainBody).find('#wb-addMacAddr').html(lang[getLang()].addBtn).prop("disabled", false);
          $j(addrOwnerEle).removeClass('invalid-input');
         }

    $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", true);

   }
   else { // an existing MAC Address
         if($j(addrOwnerEle).val().trim() == '') // empty "Owner" value -> disable the "Update" button and highlight the "Owner" input field
         {
          $j(topmostFramesMainBody).find('#wb-addMacAddr').html(lang[getLang()].updateBtn).prop("disabled", true);
          $j(addrOwnerEle).addClass('invalid-input');
         }
         else {
               $j(topmostFramesMainBody).find('#wb-addMacAddr').html(lang[getLang()].updateBtn).prop("disabled", false);
               $j(addrOwnerEle).removeClass('invalid-input');
              }

         $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", false);
        }
  }
  else {// an invalid MAC Address -> disable all buttons + highlight the "MAC Address" input field
        $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", true);
        $j(topmostFramesMainBody).find('#wb-addMacAddr').prop("disabled", true);

        $j(addrMacEle).addClass('invalid-input');
       }

 }
 else if(!isMacAddr) // it's the "Owner" value to be added/updated
 {
  addrMacOwner = getSavedAddr($j(addrMacEle).val(), '');

  if(selText.trim() == '') // empty "Owner" value -> disable all the buttons and highlight the "Owner" input field
  {
   $j(topmostFramesMainBody).find('#wb-addMacAddr').prop("disabled", true);
   $j(addrOwnerEle).addClass('invalid-input');
  }
  else {
        // check if MAC Address is valid
        if(isValidAddress($j(addrMacEle).val().trim())) // a valid MAC Address
        {
         $j(topmostFramesMainBody).find('#wb-addMacAddr').prop("disabled", false);
         $j(addrMacEle).removeClass('invalid-input');
        }
        else {// an invalid MAC Address -> disable all buttons + highlight the "MAC Address" input field
              $j(topmostFramesMainBody).find('#wb-addMacAddr').prop("disabled", true);
              $j(addrMacEle).addClass('invalid-input');
             }

        $j(addrOwnerEle).removeClass('invalid-input');
       }

  if(addrMacOwner.trim() == '') $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", true);
  else $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", false);
 }
 else {
       $j(topmostFramesMainBody).find('#wb-removeMacAddr').prop("disabled", true);
       $j(topmostFramesMainBody).find('#wb-addMacAddr').prop("disabled", true);
      }
}


function addInfo()
{
   // List Devices Names
   var topmostFramesMainBody = $j('frame[name="contentfrm"]', top.document)[0].contentDocument;

   if(topmostFramesMainBody !== null)
   {
    $j(topmostFramesMainBody).find("td[id*='Dispositifs'] tr.trTabContent, [id='LAN-Side Devices'] tr.trTabContent").each(function(i, trEle){
       var tdEle = $j(trEle).find('td').eq(0);
       $j(tdEle).html(getSavedAddr($j(trEle).find('td').eq(2).text(), $j(tdEle).text()) );
    });
   }

   //List Filtered Devices Names
   var wlanFilterDiv = $j('#wlMacFliter');

   if(wlanFilterDiv.length)
   {
    $j(wlanFilterDiv).find("tr.trTabContent").each(function(i, trEle){

       var tdEle = $j(trEle).find('td').eq(0);
       var addrMac = $j(tdEle).text().replace("&nbsp;","");
           addrMac = addrMac.toLowerCase().replace(/[\:\-\s]/gi, '');

       var tdEle2 = $j(trEle).find('td').eq(1);

       var chkbxEle = $j(tdEle2).find('input[type="checkbox"]').eq(0).after('<label>'+ getSavedAddr(addrMac, '') +'</label>');
    });
   }
}


//check if it's a Mac @
function isValidAddress(addr)
{
 var regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;

 return regexp.test(addr);
}


function getAddressOrOwner(query)
{
  var obj;
  var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;

  if(query == 'addr')
  {
   obj = $j(topmostFramesMainBody).find('#wb-addr');
  }
  else if(query == 'owner')
  {
   obj = $j(topmostFramesMainBody).find('#wb-addrOwner');
  }

 return obj;
}


function whoseThis(selText)
{
 var addrEle = getAddressOrOwner('addr');
 $j(addrEle).prop("value", selText);

 var addrMacOwner = getSavedAddr(selText, '');
 var addrOwnerEle = getAddressOrOwner('owner');
 $j(addrOwnerEle).prop('value', addrMacOwner);

 enableDisableBtns(selText);

 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 $j(topmostFramesMainBody).find('#wb-dlgBox').show();
}


function addNewAddress(address, owner)
{
 if(isValidAddress(address) && owner.trim() != '')
 {
  var validKey = '_' + address.replace(/[\:\-\s]/gi, '');

  var addrs = loadAddresses();
  addrs[validKey.toLowerCase()] = owner.trim();
  GM_setValue("addresses", JSON.stringify(addrs));
 }
 else alert(lang[getLang()].addError);
}


function removeAddress(address)
{
 var validKey = '_' + address.replace(/[\:\-\s]/gi, '').toLowerCase();

 if(isValidAddress(address))
 {
  var addrs = loadAddresses();
  delete addrs[validKey];
  GM_setValue("addresses", JSON.stringify(addrs));
 }
 else alert(lang[getLang()].removeError);

return (getSavedAddr(validKey, '') == '');
}


(function() {
    $j(document).ready(function(){

    var newCSS = GM_getResourceText ("customCSS");
    GM_addStyle (newCSS);

    // load  jquery UI CSS
    $j("head").append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/ui-darkness/jquery-ui.css"> rel="stylesheet" type="text/css">');

    GM_addStyle(".invalid-input { border: solid 3px red !important;} ");

    // increase document height (top parent "frameset") to make more room for the 1st frame that holds the pop-up dialog boxes
    var topFrameset = $j('frameset', top.document)[0];
        $j(topFrameset).attr('rows', "218,*,50");

    var selectionTxt ='';
    var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
    var dlgBoxDiv = $j(topmostFramesMainBody).find('#wb-dlgBox');

    if(!dlgBoxDiv.length)
    {
     $j(topmostFramesMainBody).find('body').append(getDialogBox());
    }

    // add displayed MAC addresses owners' infos
    addInfo();

    //
      $j(document).on('input', '#wb-addr', function(e){
        var address = $j(this).val().trim();
        enableDisableBtns(address);
      });

    //
      $j(document).on('input', '#wb-addrOwner', function(e){
        var address = $j(this).val().trim();
        enableDisableBtns(address, false);
      });

    // buttons click events {add , remove, close}
    // add new MAC address owner
    $j(document).on('click', '#wb-addMacAddr', function(){
       var addrEle = getAddressOrOwner('addr');

       $j('html, body').css('cursor','wait');
       addNewAddress($j(addrEle).val(), $j('#wb-addrOwner').val());
       enableDisableBtns($j(addrEle).val());
       $j('html, body').css('cursor', 'default');
    });

    // remove a stored MAC address owner
    $j(document).on('click', '#wb-removeMacAddr', function(){
       var addrEle = getAddressOrOwner('addr');

       $j('html, body').css('cursor','wait');

       if(removeAddress($j(addrEle).val()))
       {
        enableDisableBtns($j(addrEle).val());
       }

       $j('html, body').css('cursor', 'default');
    });

    // close infos dialog box
    $j(document).on('click', '#wb-closeDlgBoxDiv', function(){
        $j('#wb-dlgBox').hide();
    });


     // enable/disable "validate" button in the "all Mac addresses list" pop-up depending on the edited MAC address owner value
     $j(document).on('input', '#wb-AllAddrBox input.owner-name-list', function(){
        if($j(this).val().trim() != '')
        {
         $j(this).siblings('button.editSavedAddr').attr("disabled", false).removeClass("ui-state-disabled");
        }
        else $j(this).siblings('button.editSavedAddr').attr("disabled", true).addClass("ui-state-disabled");
     });

     // save the new edited MAC address owner value via the  "all Mac addresses list" pop-up
     $j(document).on('click', '#wb-AllAddrBox button.editSavedAddr', function(){
        if($j(this).siblings("input.owner-name-list").val().trim() != '')
        {

         var addrMac = $j(this).siblings("label.mac-addr-list").text().trim();

         // PS: addNewAddress alerts on error
         addNewAddress(addrMac, $j(this).siblings("input.owner-name-list").val().trim());

         if($j('#wb-addr').val().trim().toLowerCase() == addrMac.toLowerCase())
         {
          enableDisableBtns(addrMac);
         }
        }
        else {
              alert('invalid value');
             }

        $j(this).attr("disabled", true).addClass("ui-state-disabled");
     });

     // remove a saved MAC address and owner via the "all Mac addresses list" pop-up
     $j(document).on('click', '#wb-AllAddrBox button.removeSavedAddr', function(){
         var currentLang = getLang();

         if(confirm(lang[currentLang].viewAllAddrBtn.confirmDelete))
         {
          var addrMac = $j(this).siblings("label.mac-addr-list").text().trim();

          // PS: removeAddress alerts on error
          removeAddress(addrMac);
          $j(this).siblings("label.mac-addr-list").parent().remove();

          if($j('#wb-addr').val().trim().toLowerCase() == addrMac.toLowerCase())
          {
           enableDisableBtns(addrMac);
          }

          if(!$j('#wb-AllAddrBox label.mac-addr-list').length)
          {
           alert(lang[currentLang].viewAllAddrBtn.noMoreAddr);
           $j( "#wb-AllAddrBox" ).dialog('close');
          }

         }

     });


     // capture mouse text selection
    $j(document.body).bind('mouseup', function(e)
    {

        if(window.getSelection)
        {
         selectionTxt = window.getSelection();
        }
        else if (document.selection)
        {
         selectionTxt = document.selection.createRange();
        }

        // show info dialog box about the selected text if it's a valid MAC address
        if(isValidAddress(selectionTxt.toString().trim())) whoseThis(selectionTxt.toString().trim());

        $j(document).on('click', 'a#viewAllSavedAddr', function(){
          viewAllSavedAddr();
        });

   });

    });
})();

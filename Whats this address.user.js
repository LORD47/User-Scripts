// ==UserScript==
// @name         Whats this address
// @namespace    http://tampermonkey.net/
// @version      0.1.3.0
// @description  HG532e router Mac address device owner description
// @match        http://192.168.1.1/html/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

var $j = jQuery.noConflict(true);

var lang = {eng:{addBtn:"Add", updateBtn:"update", removeBtn:"Remove", closeBtn:"close", addrMacInfo: "MAC Address", addrMacOwnerInfo: "of",
                 addError: "Invalid MAC Address or an empty name!", removeError: "Invalid MAC Address!"},
            fr:{addBtn:"Ajouter", updateBtn:"Modifier", removeBtn:"Supprimer", closeBtn:"Fermer", addrMacInfo: "Adresse MAC", addrMacOwnerInfo: "de",
                addError: "Adresse MAC invalide ou un nom vide!", removeError: "Adresse MAC invalide!"}};

function getDialogBox()
{
var currentLang = getLang();

var dlgBox = '<div id="wb-dlgBox" style="display: none; position: fixed; border:black solid 1px;  padding: 10px; margin:0 auto 0 auto; left: 10px; top: 20px; z-index:9999999; border-radius: 5px;">'
             +'<label for="addr">'+ lang[currentLang].addrMacInfo +':</label><input type="text" id="wb-addr" value=""/>'
             +'<label for="addrOwner" style="margin-left: 5px;">'+ lang[currentLang].addrMacOwnerInfo +':</label><input type="text" id="wb-addrOwner" value=""/><br>'
             +'<button name="closeDlgBoxDiv" id="wb-closeDlgBoxDiv" style="float: right; margin: 5px 0px 0px 5px;">'+ lang[currentLang].closeBtn +'</button>'
             +'<button name="removeMacAddr" id="wb-removeMacAddr" style="float: right; margin: 5px 0px 0px 5px;">'+ lang[currentLang].removeBtn +'</button>'
             +'<button name="addMacAddr" id="wb-addMacAddr" style="float: right; margin-top: 5px">'+ lang[currentLang].addBtn +'</button>'
             +'</div>';

return dlgBox;
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


function enableDisableBtns(selText, isMacAddr)
{
 // default function params
 if (typeof(isMacAddr) === 'undefined') isMacAddr = true;

 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 var addrMacEle  = getAddressOrOwner('addr');
 var addrOwnerEle  = getAddressOrOwner('owner');
 var addrMacOwner;

 if(isMacAddr) // it's a MAC Address
 {
  if(isValidAddress(selText.trim())) // a valid MAC Address
  {
   $j(addrMacEle).removeClass('invalid-input');

   addrMacOwner = GM_getValue('_' + selText.toLowerCase().replace(/[\:\-\s]/gi, ''), '');
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
  addrMacOwner = GM_getValue('_' + $j(addrMacEle).val().toLowerCase().replace(/[\:\-\s]/gi, ''), '');

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
       $j(tdEle).html(GM_getValue('_' + $j(trEle).find('td').eq(2).text().toLowerCase().replace(/[\:\-\s]/gi, ''), $j(tdEle).text()) );
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

       var chkbxEle =  $j(tdEle2).find('input[type="checkbox"]').eq(0).after('<label>'+ GM_getValue('_' + addrMac, '')+'</label>');
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
 var addrEle  = getAddressOrOwner('addr');
 $j(addrEle).prop("value", selText);

 var addrMacOwner = GM_getValue('_' + selText.toLowerCase().replace(/[\:\-\s]/gi, ''), '');
 var addrOwnerEle  = getAddressOrOwner('owner');
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
  GM_setValue(validKey.toLowerCase(), owner.trim());
 }
 else alert(lang[getLang()].addError);
}


function removeAddress(address)
{
 var validKey = '_' + address.replace(/[\:\-\s]/gi, '');

 if(isValidAddress(address))
 {
  GM_deleteValue(validKey.toLowerCase());
 }
 else alert(lang[getLang()].removeError);

return (GM_getValue(validKey.toLowerCase(), '') == '');
}


(function() {
    $j(document).ready(function(){
   GM_addStyle(".invalid-input { border: solid 3px red !important;} ");

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
       var addrEle  = getAddressOrOwner('addr');

       $j('html, body').css('cursor','wait');
       addNewAddress($j(addrEle).val(), $j('#wb-addrOwner').val());
       enableDisableBtns($j(addrEle).val());
       $j('html, body').css('cursor', 'default');
    });

    // remove a stored MAC address owner
    $j(document).on('click', '#wb-removeMacAddr', function(){
       var addrEle  = getAddressOrOwner('addr');

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

        // show info dialog box about selected text if it's a valid MAC address
        if(isValidAddress(selectionTxt.toString().trim())) whoseThis(selectionTxt.toString().trim());

   });

    });
})();

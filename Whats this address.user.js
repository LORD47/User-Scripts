// ==UserScript==
// @name         Whats this address
// @namespace    http://tampermonkey.net/
// @version      0.1.2.0
// @description  HG532e router Mac address device owner description
// @match        http://192.168.1.1/html/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

var $j = jQuery.noConflict(true);

var dlgBox = '<div id="wb-dlgBox" style="display: none; position: fixed; border:black solid 1px;  padding: 10px; margin:0 auto 0 auto; left: 10px; top: 20px; z-index:9999999; border-radius: 5px;">'
             +'<label for="addr">Mac Address:</label><input type="text" id="addr" value=""/>'
             +'<label for="addrOwner" style="margin-left: 5px;">de:</label><input type="text" id="addrOwner" value=""/><br>'
             +'<button name="closeDlgBoxDiv" id="closeDlgBoxDiv" style="float: right; margin: 5px 0px 0px 5px;">Fermer</button>'
             +'<button name="addMacAddr" id="addMacAddr" style="float: right; margin-top: 5px">Ajouter</button>'
             +'</div>';

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
   obj = $j(topmostFramesMainBody).find('#addr');
  }
  else if(query == 'owner')
  {
   obj = $j(topmostFramesMainBody).find('#addrOwner');
  }

 return obj;
}


function whoseThis(selText)
{
 var addrEle  = getAddressOrOwner('addr');
 $j(addrEle).attr("value", selText);

 var addrOwnerEle  = getAddressOrOwner('owner');
 $j(addrOwnerEle).attr('value', GM_getValue('_' + selText.toLowerCase().replace(/[\:\-\s]/gi, ''), ''));

 var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
 $j(topmostFramesMainBody).find('#wb-dlgBox').show();
}


function addNewAddress(address, owner)
{
 var validKey = '_' + address.replace(/[\:\-\s]/gi, '');
 GM_setValue(validKey.toLowerCase(), owner.trim());
}


(function() {
    $j(document).ready(function(){

    var selectionTxt ='';
    var topmostFramesMainBody = $j('frame[name="logofrm"]', top.document)[0].contentDocument;
    var dlgBoxDiv = $j(topmostFramesMainBody).find('#wb-dlgBox');
      
    if(!dlgBoxDiv.length)
    {
     $j(topmostFramesMainBody).find('body').append(dlgBox);
    }

    addInfo();

    $j(document).on('click', '#addMacAddr', function(){
       var addrEle  = getAddressOrOwner('addr');

       addNewAddress($j(addrEle).val(), $j('#addrOwner').val());
    });

    $j(document).on('click', '#closeDlgBoxDiv', function(){
        $j('#wb-dlgBox').hide();
    });

     ///
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

        if(isValidAddress(selectionTxt.toString().trim())) whoseThis(selectionTxt.toString());

   });

    });
})();

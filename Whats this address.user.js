// ==UserScript==
// @name         Whats this address
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hint about selected text
// @match        http://192.168.1.1/html/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

var $j = jQuery.noConflict(true);

var dlgBox = '<div class="yt-uix-button" id="wb-dlgBox" style="display: block; position: fixed; border:black solid 1px;  padding: 10px; margin:0 auto 0 auto; top: 200px; z-index:9999999; background-color:#F1E9E9; border-radius: 5px;">'
             +'<label for="addr">Mac Address:</label><input type="text" id="addr" value=""/>'
             +'<label for="addrOwner" style="margin-left: 5px;">de:</label><input type="text" id="addrOwner" value=""/><br>'
             +'<button name="closeDlgBoxDiv" id="closeDlgBoxDiv" style="float: right; margin: 5px 0px 0px 5px;">Fermer</button>'
             +'<button name="addMacAddr" id="addMacAddr" style="float: right; margin-top: 5px">Ajouter</button>'
             +'</div>';



//check if it's a Mac @
function isValidAddress(addr)
{
  var regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;

 return regexp.test(addr);
}


function whoseThis(selText)
{
 $j('#addr').attr("value", selText);
 $j('#addrOwner').attr('value', GM_getValue('_' + selText.toLowerCase().replace(/[\:\-]/gi, ''), ''));


 $j('#wb-dlgBox').show();
}


function addNewAddress(address, owner)
{
 var validKey = address;
     validKey = '_' + address.replace(/[\:\-]/gi, '');

//alert(validKey.toLowerCase());
  GM_setValue(validKey.toLowerCase(), owner);
}


(function() {
    $j(document).ready(function(){

    var selectionTxt ='';
    var dlgBoxDiv = $j('#wb-dlgBox');


    if(!dlgBoxDiv.length)
    {
     $j('body').append(dlgBox);
    }

    $j(document).on('click', '#addMacAddr', function(){addNewAddress(selectionTxt.toString(), $j('#addrOwner').val()); });
    $j(document).on('click', '#closeDlgBoxDiv', function(){ $j('#wb-dlgBox').hide();});

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

        if(isValidAddress(selectionTxt.toString())) whoseThis(selectionTxt.toString());

   });

    });
})();

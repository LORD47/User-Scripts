// ==UserScript==
// @name       youtube dimmer
// @description  Turn the lights off
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @include    /https?://(www.)?youtube.com/*/
// @version        3.0
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);


function makeItShow(ele)
{
 if(ele.length)
 {
  $j(ele).css('z-index', '999999');
 }

}

function lightOff()
{
 var dimmer = $j('#dimmerDivMe');

 if(!dimmer.length) // div not created yet
 {
  $j('body').prepend('<div id="dimmerDivMe"></div>');
  dimmer = $j('#dimmerDivMe');
 }

 dimmer.css( {'width': '100%', 'height': '100%', 'left': '0px', 'top': '0px', 'position': 'fixed',
              'opacity': '0.8', 'z-index': '999', 'background': 'black'});

 dimmer.fadeToggle('slow');

 // the div that contains the video player, change its z-index to a value > our dimmer div to make it visible
 var playerDiv = $j('#player-api'); // youtube old layout
 var playerDiv_new  = $j('#player.ytd-watch'); // youtube new layout

 makeItShow(playerDiv);
 makeItShow(playerDiv_new);

 $j('#wb-lightbulb').attr('src', 'https://docs.google.com/uc?export=download&id=0B9FDK9Kf1tV1Mk1LRXRPZUcwS2s');
}




function lightOn()
{
 var dimmer = $j('#dimmerDivMe');

 if(!dimmer.length) // div not created yet
 {
  $j('body').prepend('<div id="dimmerDivMe"></div>');
  dimmer = $j('#dimmerDivMe');
 }

 dimmer.fadeOut('slow');

 $j('#wb-lightbulb').attr('src', 'https://docs.google.com/uc?export=download&id=0B9FDK9Kf1tV1b3Bnb25nZmV1cXc');
}



(function () {
    $j(document).ready(function(){

     // change the z-index of youtube search&+ div, so the darkening effect will take the entire screen
     $j('#masthead-positioner, #masthead-container').css('z-index', '10');


     //$j('#yt-masthead-user').find('a').eq(0).before('<a class="yt-uix-button" id="wb-lgtblb" style="box-shadow: 0 0 0;" title="Turn the lights off (Shortcut: Ctrl+Shift+L)"><img id="wb-lightbulb" src="https://docs.google.com/uc?export=download&id=0B9FDK9Kf1tV1b3Bnb25nZmV1cXc" width="16" height="24"></a>');

     // add a "light-bulb" turn on/off button just right to search bar
     $j('#search-form').after('<a id="wb-lgtblb" style="box-shadow: 0 0 0; margin: auto 10px auto; cursor: pointer;" title="Turn the lights off (Shortcut: Ctrl+Shift+L)"><img id="wb-lightbulb" src="https://docs.google.com/uc?export=download&id=0B9FDK9Kf1tV1b3Bnb25nZmV1cXc" width="16" height="24"></a>');

     $j(document).on("click", "#wb-lgtblb", lightOff);

     // assign a shortcut to toggle between the darken/undarken effect
     shortcut.add('ctrl+shift+l', lightOff);

     // undarken the screen by mouse click or ESC key
     $j(document).on("click", "#dimmerDivMe", lightOn);

     shortcut.add('esc', lightOn);

    });

})();


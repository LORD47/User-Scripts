// ==UserScript==
// @name       youtube dimmer
// @description  Turn the lights off
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @include    /https?://(www\.)?youtube.com/watch/*/
// @version        1.0
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

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
     
 // the div that contains the video player, change it's z-index to a value > our dimmer div to make it visible
 $j('#player-api').css('z-index', '1000');
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
}



(function () {
    $j(document).ready(function(){
     
     // change the z-index of youtube search&+ div, so the darkening effect will take the entire screen  
     $j('#masthead-positioner').css('z-index', '10');
        
     // assign a shortcut to toggle between the darken/undarken effect
     shortcut.add('ctrl+shift+l', lightOff);
        
        
        
     // undarken the screen by mouse click or ESC key
     $j(document).on("click", "#dimmerDivMe", lightOn);
     
     shortcut.add('esc', lightOn);   


    });
        
})();


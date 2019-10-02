// ==UserScript==
// @name         youtube dimmer
// @description  Turn the lights off
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @include      /https?://(www.)?youtube.com/*/
// @version      4.1
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

var dimmer = $j('#dimmerDivMe'), isDimmed = false;
var svgSrcOn = "PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0NjIuMzUgNDE5LjkxIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iODAlIiBoZWlnaHQ9IjEwMCUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxtZXRhZGF0YT48cmRmOlJERj48Y2M6V29yayByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPjxkYzp0aXRsZS8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMS4yMikiIGZpbGw9IiNGRkYiPgoJPHBhdGggZD0ibTIzNS43IDgxLjcyYzAtNC40ODctMy42MzMtOC4xMjktOC4xMjktOC4xMjktNDYuOTI2IDAtODUuMTA2IDM4LjE4LTg1LjEwNiA4NS4xMDYgMCA0LjQ4NyAzLjYzMyA4LjEyOSA4LjEyOSA4LjEyOSA0LjQ5NSAwIDguMTI5LTMuNjQyIDguMTI5LTguMTI5IDAtMzcuOTYgMzAuODg5LTY4Ljg0OSA2OC44NDktNjguODQ5IDQuNDk1IDAgOC4xMjgtMy42MzMgOC4xMjgtOC4xMjh6Ii8+Cgk8cGF0aCBkPSJtMTA4LjMgMTU4LjdjMCAyNy44OTcgOS4wMTUgNTQuMjc0IDI2LjA3NiA3Ni4yNzkgMC4wODEgMC4xMDYgMC4xNzEgMC4yMTEgMC4yNiAwLjMxNyAzNS41NzkgNDkuMzg5IDI2LjczNSA3Mi44ODEgMjYuNzM1IDcyLjkyMS0xLjkwMiA0LjA2NC0wLjE0NiA4LjkwMSAzLjkxOCAxMC44MTEgMS4xMTQgMC41MiAyLjI4NCAwLjc3MiAzLjQzOCAwLjc2NCAzLjA1NiAwIDUuOTgzLTEuNzMxIDcuMzY0LTQuNjgyIDEuNDcxLTMuMTIxIDEzLjA5NS0zMi4yMTQtMjguNjk0LTg5LjkxLTAuMTg3LTAuMjUyLTAuMzc0LTAuNDk2LTAuNTg1LTAuNzIzLTE0LjU1OC0xOS4wMjEtMjIuMjQ4LTQxLjc0OC0yMi4yNDgtNjUuNzg1IDAtNTkuNzI5IDQ4LjYwMS0xMDguMzIgMTA4LjMyLTEwOC4zMnMxMDguMzIgNDguNTkyIDEwOC4zMiAxMDguMzJjMCAyNC4xMDEtNy43MzggNDYuOTE4LTIyLjUyNCA2Ni4xNS00MS44MTMgNTcuNzM3LTI5LjcxOCA4Ny4xNjMtMjguMjA2IDkwLjMzMyAxLjkxIDMuOTc1IDYuNiA1LjYwMSAxMC42MTYgMy44MDRzNS44MzYtNi41NzYgNC4xMzctMTAuNjRjLTAuMDk4LTAuMjM2LTkuNDEzLTI0LjE5OSAyNi40ODMtNzMuNzc1IDE2Ljg0Mi0yMS45MTUgMjUuNzUxLTQ4LjE0NiAyNS43NTEtNzUuODY0IDAtNjguNjk1LTU1Ljg4NC0xMjQuNTgtMTI0LjU4LTEyNC41OHMtMTI0LjU5IDU1Ljg5My0xMjQuNTkgMTI0LjU4eiIvPgoJPHBhdGggZD0ibTMwNS40NCAzNTEuMDh2LTYuOTA5YzAtMTEuMDE0LTguOTY2LTE5Ljk3Mi0xOS45NzItMTkuOTcyaC0xMDkuNTRjLTExLjAxNCAwLTE5Ljk3MiA4Ljk1OC0xOS45NzIgMTkuOTcydjYuOTA5YzAgMTEuMDA2IDguOTU4IDE5Ljk3MiAxOS45NzIgMTkuOTcyaDEwOS41NWMxMS4wMDYgMCAxOS45NjMtOC45NTggMTkuOTYzLTE5Ljk3MnptLTEzMy4yMyAwdi02LjkwOWMwLTIuMDQ4IDEuNjY2LTMuNzE1IDMuNzE1LTMuNzE1aDEwOS41NWMyLjA0OCAwIDMuNzE1IDEuNjY2IDMuNzE1IDMuNzE1djYuOTA5YzAgMi4wNDgtMS42NjYgMy43MTUtMy43MTUgMy43MTVoLTEwOS41NWMtMi4wNDkgMC0zLjcxNS0xLjY2Ni0zLjcxNS0zLjcxNXoiLz4KCTxwYXRoIGQ9Im0xODkuMDkgMzgzLjQxYy00LjQ5NSAwLTguMTI5IDMuNjQyLTguMTI5IDguMTI5djIxLjQ2OGMwIDMuMTg2IDEuODYxIDYuMDcyIDQuNzU1IDcuMzk3bDQzLjgwNSAxOS45ODhjMS4wNzMgMC40ODggMi4yMTkgMC43MzIgMy4zNzMgMC43MzIgMS4xODcgMCAyLjM3NC0wLjI2IDMuNDcxLTAuNzhsNDMuOTI3LTIwLjcyOGMyLjg0NS0xLjM0MSA0LjY1OC00LjIwMiA0LjY1OC03LjM0OHYtMjAuNzJjMC00LjQ4Ny0zLjYzMy04LjEyOS04LjEyOS04LjEyOXMtOC4xMjkgMy42NDItOC4xMjkgOC4xMjl2MTUuNTc0bC0zNS44NTUgMTYuOTI0LTM1LjYxOS0xNi4yNTd2LTE2LjI0MWMwLTQuNTA1LTMuNjMzLTguMTM4LTguMTI4LTguMTM4eiIvPgoJPHBhdGggZD0ibTQyMi4yNiAzMDUuNThjMi42NjYtMy42MDkgMS44OTQtOC42OTgtMS43MTUtMTEuMzY0bC01NS4xNDQtNDAuNjU5Yy0zLjYxNy0yLjY2Ni04LjY5OC0xLjkwMi0xMS4zNjQgMS43MTUtMi42NjYgMy42MDktMS44OTQgOC42OTggMS43MTUgMTEuMzY0bDU1LjE0NCA0MC42NTljMS40NTUgMS4wNzMgMy4xNDYgMS41ODUgNC44MiAxLjU4NSAyLjQ4OCA4ZS0zIDQuOTUxLTEuMTM4IDYuNTQ0LTMuM3oiLz4KCTxwYXRoIGQ9Im05OS4xNiA3Ny40NjhjMS40NTUgMS4wNzMgMy4xNDYgMS41ODUgNC44MiAxLjU4NSAyLjQ5NSAwIDQuOTUtMS4xNDYgNi41NTItMy4zMDggMi42NjYtMy42MDkgMS44OTQtOC42OTgtMS43MTUtMTEuMzY0bC01Ni4zODgtNDEuNTdjLTMuNjA5LTIuNjc0LTguNjk4LTEuODk0LTExLjM2NCAxLjcxNS0yLjY2NiAzLjYxNy0xLjkwMiA4LjcwNiAxLjcxNSAxMS4zNzJ6Ii8+Cgk8cGF0aCBkPSJtMTAxLjcyIDI1MC43Ni01OC45MzIgNDMuNDU1Yy0zLjYwOSAyLjY2Ni00LjM4MSA3Ljc1NS0xLjcxNSAxMS4zNjQgMS41OTMgMi4xNjIgNC4wNTYgMy4zMDggNi41NTIgMy4zMDggMS42NzQgMCAzLjM2NS0wLjUxMiA0LjgyLTEuNTg1bDU4LjkzMi00My40NTVjMy42MDktMi42NjYgNC4zODEtNy43NTUgMS43MTUtMTEuMzY0LTIuNjgzLTMuNjE3LTcuNzYzLTQuMzgxLTExLjM3Mi0xLjcyM3oiLz4KCTxwYXRoIGQ9Im0zNTguMTYgNjEuNjk5Yy0zLjYwOSAyLjY2Ni00LjM4MSA3Ljc1NS0xLjcxNSAxMS4zNjQgMS41OTMgMi4xNjIgNC4wNTYgMy4zMDggNi41NTIgMy4zMDggMS42NzQgMCAzLjM2NS0wLjUyIDQuODItMS41ODVsNTIuNzQ2LTM4Ljg4N2MzLjYwOS0yLjY2NiA0LjM4MS03Ljc1NSAxLjcxNS0xMS4zNjRzLTcuNzQ3LTQuMzg5LTExLjM2NC0xLjcxNXoiLz4KCTxwYXRoIGQ9Im00NTQuMjIgMTU2LjkzaC02Mi4xNzVjLTQuNDk1IDAtOC4xMjkgMy42NDItOC4xMjkgOC4xMjlzMy42MzMgOC4xMjkgOC4xMjkgOC4xMjloNjIuMTc1YzQuNDk1IDAgOC4xMjktMy42NDIgOC4xMjktOC4xMjlzLTMuNjM0LTguMTI5LTguMTI5LTguMTI5eiIvPgoJPHBhdGggZD0ibTgwLjQxNiAxNjUuMDZjMC00LjQ4Ny0zLjYzMy04LjEyOS04LjEyOS04LjEyOWgtNjQuMTU4Yy00LjQ5NSAwLTguMTI5IDMuNjQyLTguMTI5IDguMTI5czMuNjMzIDguMTI5IDguMTI5IDguMTI5aDY0LjE1OWM0LjQ4Ni0xZS0zIDguMTI4LTMuNjQyIDguMTI4LTguMTI5eiIvPgo8L2c+Cjwvc3ZnPg==",
    svgSrcOff = "PHN2ZyB3aWR0aD0iODAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQ2Mi4zNSA0MTkuOTEiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxtZXRhZGF0YT48cmRmOlJERj48Y2M6V29yayByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIvPjxkYzp0aXRsZS8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0yMS4yMikiIGZpbGw9IiNGRkYiPgoJPHBhdGggZD0ibTIzNS43IDgxLjcyYzAtNC40ODctMy42MzMtOC4xMjktOC4xMjktOC4xMjktNDYuOTI2IDAtODUuMTA2IDM4LjE4LTg1LjEwNiA4NS4xMDYgMCA0LjQ4NyAzLjYzMyA4LjEyOSA4LjEyOSA4LjEyOSA0LjQ5NSAwIDguMTI5LTMuNjQyIDguMTI5LTguMTI5IDAtMzcuOTYgMzAuODg5LTY4Ljg0OSA2OC44NDktNjguODQ5IDQuNDk1IDAgOC4xMjgtMy42MzMgOC4xMjgtOC4xMjh6Ii8+Cgk8cGF0aCBkPSJtMTA4LjMgMTU4LjdjMCAyNy44OTcgOS4wMTUgNTQuMjc0IDI2LjA3NiA3Ni4yNzkgMC4wODEgMC4xMDYgMC4xNzEgMC4yMTEgMC4yNiAwLjMxNyAzNS41NzkgNDkuMzg5IDI2LjczNSA3Mi44ODEgMjYuNzM1IDcyLjkyMS0xLjkwMiA0LjA2NC0wLjE0NiA4LjkwMSAzLjkxOCAxMC44MTEgMS4xMTQgMC41MiAyLjI4NCAwLjc3MiAzLjQzOCAwLjc2NCAzLjA1NiAwIDUuOTgzLTEuNzMxIDcuMzY0LTQuNjgyIDEuNDcxLTMuMTIxIDEzLjA5NS0zMi4yMTQtMjguNjk0LTg5LjkxLTAuMTg3LTAuMjUyLTAuMzc0LTAuNDk2LTAuNTg1LTAuNzIzLTE0LjU1OC0xOS4wMjEtMjIuMjQ4LTQxLjc0OC0yMi4yNDgtNjUuNzg1IDAtNTkuNzI5IDQ4LjYwMS0xMDguMzIgMTA4LjMyLTEwOC4zMnMxMDguMzIgNDguNTkyIDEwOC4zMiAxMDguMzJjMCAyNC4xMDEtNy43MzggNDYuOTE4LTIyLjUyNCA2Ni4xNS00MS44MTMgNTcuNzM3LTI5LjcxOCA4Ny4xNjMtMjguMjA2IDkwLjMzMyAxLjkxIDMuOTc1IDYuNiA1LjYwMSAxMC42MTYgMy44MDRzNS44MzYtNi41NzYgNC4xMzctMTAuNjRjLTAuMDk4LTAuMjM2LTkuNDEzLTI0LjE5OSAyNi40ODMtNzMuNzc1IDE2Ljg0Mi0yMS45MTUgMjUuNzUxLTQ4LjE0NiAyNS43NTEtNzUuODY0IDAtNjguNjk1LTU1Ljg4NC0xMjQuNTgtMTI0LjU4LTEyNC41OHMtMTI0LjU5IDU1Ljg5My0xMjQuNTkgMTI0LjU4eiIvPgoJPHBhdGggZD0ibTMwNS40NCAzNTEuMDh2LTYuOTA5YzAtMTEuMDE0LTguOTY2LTE5Ljk3Mi0xOS45NzItMTkuOTcyaC0xMDkuNTRjLTExLjAxNCAwLTE5Ljk3MiA4Ljk1OC0xOS45NzIgMTkuOTcydjYuOTA5YzAgMTEuMDA2IDguOTU4IDE5Ljk3MiAxOS45NzIgMTkuOTcyaDEwOS41NWMxMS4wMDYgMCAxOS45NjMtOC45NTggMTkuOTYzLTE5Ljk3MnptLTEzMy4yMyAwdi02LjkwOWMwLTIuMDQ4IDEuNjY2LTMuNzE1IDMuNzE1LTMuNzE1aDEwOS41NWMyLjA0OCAwIDMuNzE1IDEuNjY2IDMuNzE1IDMuNzE1djYuOTA5YzAgMi4wNDgtMS42NjYgMy43MTUtMy43MTUgMy43MTVoLTEwOS41NWMtMi4wNDkgMC0zLjcxNS0xLjY2Ni0zLjcxNS0zLjcxNXoiLz4KCTxwYXRoIGQ9Im0xODkuMDkgMzgzLjQxYy00LjQ5NSAwLTguMTI5IDMuNjQyLTguMTI5IDguMTI5djIxLjQ2OGMwIDMuMTg2IDEuODYxIDYuMDcyIDQuNzU1IDcuMzk3bDQzLjgwNSAxOS45ODhjMS4wNzMgMC40ODggMi4yMTkgMC43MzIgMy4zNzMgMC43MzIgMS4xODcgMCAyLjM3NC0wLjI2IDMuNDcxLTAuNzhsNDMuOTI3LTIwLjcyOGMyLjg0NS0xLjM0MSA0LjY1OC00LjIwMiA0LjY1OC03LjM0OHYtMjAuNzJjMC00LjQ4Ny0zLjYzMy04LjEyOS04LjEyOS04LjEyOXMtOC4xMjkgMy42NDItOC4xMjkgOC4xMjl2MTUuNTc0bC0zNS44NTUgMTYuOTI0LTM1LjYxOS0xNi4yNTd2LTE2LjI0MWMwLTQuNTA1LTMuNjMzLTguMTM4LTguMTI4LTguMTM4eiIvPgo8L2c+Cjwvc3ZnPg==";

function makeItShow(ele, zIdx)
{
 $j(ele).each(function()
 {
  $j(this).css('z-index', zIdx)
 });
}


function toggleBtns(ele)
{

 if($j(ele).length)
 {
  // alter state of the lightbulb button in the video player controls
  var lightBtn = $j('button.wb-lights');

     if($j(lightBtn).length)
     {
      $j(lightBtn).find('svg').each(function(){$j(this).remove()});

      if($j(ele).css('display').trim().toLowerCase() == 'block')// lights are off
      {
       lightBtn.append(atob(svgSrcOn));
      }
      else {// lights are on
            lightBtn.append(atob(svgSrcOff));
           }
     }

 }
}


function lightOff()
{
 $j(dimmer).css( {'width': '100%', 'height': '100%', 'left': '0px', 'top': '0px', 'position': 'fixed',
                  'opacity': '0.8', 'z-index': '99999', 'background': 'black'});


 // the div that contains the video player, change its z-index to a value > our dimmer div to make it visible
 makeItShow('#player-api', '999999'); // youtube old layout
 makeItShow('#player.style-scope.ytd-watch-flexy', '999999'); // youtube new layout

 dimmer.fadeIn('slow', toggleBtns(dimmer));
}




function lightOn()
{
 // the div that contains the video player, set its z-index to normal
 makeItShow('#player-api', '0'); // youtube old layout
 makeItShow('#player.style-scope.ytd-watch-flexy', '0'); // youtube new layout

 dimmer.fadeOut('slow', toggleBtns(dimmer));
}


function toggleLights(ele)
{

 if($j(ele).length)
 {

  if($j(ele).css('display').trim().toLowerCase() == 'none')
  {
   lightOff();
  }
  else {
        lightOn();
       }

 }
}


(function () {
    $j(document).ready(function(){

      // init "dimmer"
      if(!dimmer.length) // div not created yet
      {
       $j('body').prepend('<div id="dimmerDivMe"></div>');
       dimmer = $j('#dimmerDivMe');
       dimmer.hide();
      }

     // change the z-index of youtube search&+ div, so the darkening effect will take the entire screen
     //$j('#masthead-positioner, #masthead-container').css('z-index', '10');


     // add toggle lights button to the video "player" buttons
     $j('div.ytp-right-controls').prepend('<button class="ytp-button ytp-settings-button wb-lights" aria-haspopup="true" aria-owns="ytp-id-18" aria-label="Toggle Lights" title="Toggle Lights">'+ window.atob(svgSrcOn) +'</button>');

     $j(document).on("click", "button.wb-lights", function(){ toggleLights($j(dimmer)) });


     document.addEventListener('fullscreenchange', (event) => {
     if (document.fullscreenElement)
     {
      isDimmed = ($j(dimmer).css('display').trim().toLowerCase() == 'block');

      if(isDimmed) lightOn();
     }
     else {
           if(isDimmed) lightOff();
          }
    });

     // assign a shortcut to toggle between the darken/undarken effect
     shortcut.add('ctrl+shift+l', function() {toggleLights($j(dimmer))} );

     // undarken the screen by mouse click or ESC key
     $j(document).on("click", "#dimmerDivMe", lightOn);

     shortcut.add('esc', lightOn);

    });

})();

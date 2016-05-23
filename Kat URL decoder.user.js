// ==UserScript==
// @name       Kat URL decoder
// @description  replace Kat with decoded one
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /https?://(www\.)?kat.cr/[\w]+.*/
// @exclude    /https?://(www\.)?kat.cr/usearch/*/
// @updateURL https://github.com/LORD47/User-Scripts/blob/master/Kat%20URL%20decoder.user.js
// @version        1.1
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

// expad
function replaceURl(aLink)
{    // deprecated: https://kat.cr/confirm/url/aHR0cDovL2ltZ2NsaWNrLm5ldC81eXRqNmMyaGxmYW0vdmxjc25hcC0yMDE1LTA2LTExLTE2aDQ0bTU1czMzLnBuZy5odG1s/
    //https://ext.kat.cr/confirm/url/aHR0cDovL2ltZzI0Lm9yZy85NGl1Lmh0bWw/
 var  URL = $j.trim(aLink.attr('href'));

   // var regExp = /^(?:https?:\/\/)?[^/]*\/confirm\/url\/([A-Za-z0-9+/]+)[^/]*\/.*$/i;
   //var regExp = /^(?:https?:\/\/)?[^/]*\/confirm\/url\/([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==).*$/i;

  //var  encodedBase64 = URL.replace(/^(?:https?:\/\/)?[^/]*\/confirm\/url\/([^/]+).*$/i, '$1');

    //var encodedBase64 = URL.replace(regExp, '$1');
    var encodedBase64 = aLink.text();

      if(encodedBase64)
      {
        //aLink.attr('href', window.atob(encodedBase64));
        aLink.attr('href', encodedBase64);
        aLink.css('color', 'red');
      }

}



(function () {
    //$j(document).ready(function(){
    $j(document).ready(function(){

        $j('a[href^="//ext.kat.cr/confirm/url/"]').each(function(){replaceURl( $j(this) ); });

    });

})();


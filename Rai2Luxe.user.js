// ==UserScript==
// @name       Rai2Luxe
// @description  Direct link download without waiting
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /http://(www.)?rai2luxe.com/*
// @version        1.0
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

(function () {
    $j(document).ready(function(){
        shitForm = $j('form.table-down[action="http://www.jeux25.com/"]');

        dImg = shitForm.find('input[type="image"][style="normal"]');
        hiddenLink = shitForm.find('input[name="link"]');
        aLink = $j('<a></a>').insertBefore(shitForm);
        aLink.attr('href', hiddenLink.attr('value'));
        aLink.append('<img src="'+ dImg.attr('src') +'">');

        shitForm.remove();

    });

})();


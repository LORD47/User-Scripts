// ==UserScript==
// @name       Ask.fm
// @description  Repalce the URL of each quesiton with the anchor text
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /https?://(www\.)?ask.fm/*
// @version        1.3.4
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

function replaceURL(ID)
{
     var myDiv = $j(ID);
     var i = 0;
     if(myDiv.attr('data-me-olsize')) i = myDiv.attr('data-me-olsize');

     myDiv.find('article.item.streamItem.streamItem-answer, article.item.streamItem.streamItem-singleAnswer').slice(i).each(function(){

         var qaDiv = $j(this).find('a').filter(function() {return this.href.match(/https?:\/\/.+\.ask\.fm\/goto.+/); }).each(function(){
             var URL = $j.trim($j(this).text());

             if(URL.indexOf('www.') === 0) URL = 'https://'+URL;

             $j(this).attr('href', URL );
        });

    });

    myDiv.attr('data-me-olsize', myDiv.children("article.item.streamItem.streamItem-answer, article.item.streamItem.streamItem-singleAnswer").length);
}


(function () {
    $j(document).ready(function(){
        $j('.main-column').each(function(){ replaceURL('.main-column'); });

        var myNode = document.querySelector('.item-pager');

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        var observer = new MutationObserver(function(mutations, observer) {
            // fired when a mutation occurs
            replaceURL('.item-pager');
        });

        observer.observe(myNode, { childList: true });
    });

})();

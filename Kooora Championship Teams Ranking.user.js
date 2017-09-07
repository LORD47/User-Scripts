// ==UserScript==
// @name         Kooora Championship Teams Ranking
// @description  Add Positions Numbering to Teams Ranking
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /http://(www.)?kooora.com/*
// @version       0.1.2.0
// @grant        none
// ==/UserScript==


var $j = jQuery.noConflict(true);


(function () {
    $j(document).ready(function(){
     var idx = -1;
         pts = 0;
         tmp_pts = 0;
         search ='نقاط';

     $j('table.compTable').find('tr').each(function(){

        if($j(this).find('td').eq(-1).text() == search)
        {
         idx = -1;
         pts = 0;
         tmp_pts = 0;
        }

         idx++;

         if(idx == 0) $j(this).find('td').eq(0).before('<td class="wcheader1">#</td>');
         else
         {
          pos = idx;

          if(idx > 1)
          {
           tmp_pts = $j(this).find('td').eq(-1).text();

           if(tmp_pts == pts) pos = '-';
           else pts = tmp_pts;
          }

          $j(this).find('td').eq(0).before('<td style="font-weight: bold" title="'+ idx +'">'+ pos +'</td>');
         }

     });

    });

})();

// ==UserScript==
// @name         Kooora Team Flag_Logo
// @description  Add Team Flag/Logo
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /http://(www.)?kooora.com/*
// @version       0.1
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var $j = jQuery.noConflict(true);


function teamKey(name)
{
 return name.replace(/\s/gi, '_');
}

function getData(parentID, ele)
{
    var fetcher = { fetch: function (url, callback)
                  {
                   GM_xmlhttpRequest({
                                        method:  "GET",
                                        url:     url,
                                        accept:  'text/xml',
                                        onload:  function(response) { callback(response.responseText); },
                                        onerror: function(response) { callback(response); }
                                      });

                   }// fetch
                 };//fetcher

             fetcher.fetch($j(ele).attr('href'), function(response) {
                var team_type = response.match(/var\s+team_type\s*=\s*(\d+)/gi);
                    team_type = team_type[0].replace(/var\s+team_type\s*=\s*(\d+)/gi, '$1');

                 // team_type: 1-> club, 2 -> national team
                 var team_flag = null;
                 var img_src = '';
                 var img_size = '';

                 if(team_type == 1)
                 {
                  team_flag = response.match(/var\s+team_logo\s*=\s*["']([^"']+)["']/gi);
                  team_flag = team_flag[0].replace(/var\s+team_logo\s*=\s*["']([^"']+)["']/gi, '$1');

                  img_src = team_flag;
                  img_size = 'width="32" height="32"';
                 }
                 else if(team_type == 2)
                 {
                  team_flag = response.match(/var\s+team_flag\s*=\s*["']([^"']+)["']/gi);
                  team_flag = team_flag[0].replace(/var\s+team_flag\s*=\s*["']([^"']+)["']/gi, '$1');

                  img_src = 'http://o.kooora.com/f/' + team_flag + '.png';
                  img_size = 'width="24" height="17"';
                 }



                 if(parentID == 'contentTable')
                 {
                  $j(ele).append('<img src="' + img_src+ '" '+ img_size + ' style="margin:0 5px;">');
                 }
                 else if(parentID == 'ranksTable')
                 {
                  $j(ele).parent().parent().find('td').eq(1).not('.wb-done').each(function() {
                       var nextTD = $j(this).next('td');
                       var aEle = $j(this).find('a');

                      $j(this).addClass('wb-done').attr('colspan', '3').find('a').text($j(aEle).text() + ' ' + $j(nextTD).text()).css({'float': 'right'})
                          .prepend('<img src="' + img_src+ '" '+ img_size + ' style="margin:0 5px; ">').attr('target', '_blank');

                      $j(nextTD).remove();

                  });

                 }
               });
  }



(function () {
    $j(document).ready(function(){

    $j("#contentTable, #ranksTable").find('a').filter(function() {return this.href.match(/\?team=\d+/); }).each(function(){
        getData($j(this).closest('table').attr('id'), $j(this));
      });



    });

})();

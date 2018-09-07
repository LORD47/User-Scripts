// ==UserScript==
// @name         Kooora Team Flag_Logo
// @description  Add Team Flag/Logo
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include      /http://(www.)?kooora.com/*
// @version      0.2
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==


var $j = jQuery.noConflict(true);
var teamsCache = {};
var pending = {teams:[]}
var nextUpdate = 1000 * 60 * 60; // every 1 hour


function checkNested(obj /*, level1, level2, ... levelN*/)
{
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}


function loadTeamsCache()
{
 var teams = {};

 if(GM_getValue("teams", '') != '') // no saved teams
 {
  teams = JSON.parse(GM_getValue("teams", ''));
 }

 return teams;
}


function getTeamID(ele)
{
 var teamID = null;
     teamID = $j(ele).attr('href').match(/\?team=(\d+)/gi);

 if(teamID != null) teamID = $j(ele).attr('href').replace(/\?team=(\d+)/gi, '$1');

 return teamID;
}


function getData(parentID, ele)
{
 var team = {};
 var teamID = getTeamID(ele);

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



 if(teamID != null && checkNested(teamsCache, 't'+teamID)) // team's infos are cached
 {
  team = teamsCache['t'+teamID];

  // insert the flag/logo
  insertFlagLogo(parentID, team);
 }
 else {// fetch the team's info from URL
       fetcher.fetch($j(ele).attr('href'), function(response) {
          // team_type: 1-> club, 2 -> national team
          var team_type = response.match(/var\s+team_type\s*=\s*(\d+)/gi);
              team_type = team_type[0].replace(/var\s+team_type\s*=\s*(\d+)/gi, '$1');

           var team_name_en = response.match(/var\s+team_name_en\s*=\s*["']([^"']+)/gi);
               team_name_en = team_name_en[0].replace(/var\s+team_name_en\s*=\s*["']([^"']+)/gi, '$1');

           var team_name_ar = response.match(/var\s+team_name_ar\s*=\s*["']([^"']+)/gi);
               team_name_ar = team_name_ar[0].replace(/var\s+team_name_ar\s*=\s*["']([^"']+)/gi, '$1');

           var team_flag = null;
           var img_src = '';
           var img_size = '';

           if(team_type == 1) // a club
           {
            team_flag = response.match(/var\s+team_logo\s*=\s*["']([^"']+)["']/gi);

            if(team_flag)
            {
             team_flag = team_flag[0].replace(/var\s+team_logo\s*=\s*["']([^"']+)["']/gi, '$1');
            }
            else team_flag = ''

            img_src = team_flag;
            img_size = 'width="32" height="32"';
           }
           else if(team_type == 2) // a national team
           {
            team_flag = response.match(/var\s+team_flag\s*=\s*["']([^"']+)["']/gi);

            if(team_flag)
            {
             team_flag = team_flag[0].replace(/var\s+team_flag\s*=\s*["']([^"']+)["']/gi, '$1');
            }
            else team_flag = '';

            img_src = 'http://o.kooora.com/f/' + team_flag + '.png';
            img_size = 'width="24" height="17"';
           }

          team = {id: teamID, name_en: team_name_en, name_ar: team_name_ar, img_src: img_src, img_size: img_size, lastUpdate: $j.now()};

          // insert the flag/logo
          insertFlagLogo(parentID, team);
       }); // end of: fetcher.fetch
 }



}



function insertFlagLogo(parentID, team)
{
 for(var i = 0; i < pending[team.id].length; i++)
 {
  var ele = pending[team.id][i];

  if(checkNested(team, 'img_src') && team.img_src.trim() != '')
  {
   if(parentID == 'contentTable' || parentID == 'matchesTable')
   {
    $j(ele).append('<img src="' + team.img_src+ '" '+ team.img_size + ' style="margin:0 5px;">');
   }
   else if(parentID == 'ranksTable')
   {
    $j(ele).parent().parent().find('td').eq(1).not('.wb-done').each(function() {
       var nextTD = $j(this).next('td');
       var aEle = $j(this).find('a');

       $j(this).addClass('wb-done').attr('colspan', '3').find('a').text($j(aEle).text() + ' ' + $j(nextTD).text()).css({'float': 'right'})
           .prepend('<img src="' + team.img_src+ '" '+ team.img_size + ' style="margin:0 5px; ">').attr('target', '_blank');

       $j(nextTD).remove();
    });

   }

  }

  // add team's data to cache
  teamsCache['t'+team.id] = team;
  GM_setValue("teams", JSON.stringify(teamsCache));
 }
}




(function () {
    $j(document).ready(function(){

    // load teams cache
    teamsCache = loadTeamsCache();

    // collect teams info
    $j("#contentTable, #ranksTable, #matchesTable").find('a').filter(function() {return this.href.match(/\?team=\d+/); }).each(function(){
        var teamID = getTeamID($j(this));

        if(pending.teams.includes(teamID))
        {
         pending[teamID].push($j(this));
        }
        else {
              pending.teams.push(teamID);
              pending[teamID] = [$j(this)];
             }

      });

      // fetch then add team flag/logo
      for(var i = 0; i < pending.teams.length; i++)
      {
       getData($j(pending[pending.teams[i]][0]).closest('table').attr('id'), $j(pending[pending.teams[i]][0]));
      }



    });

})();

// ==UserScript==
// @name       MAL search anime fetcher
// @description  Fetch anime search results as named images 
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      http://www.openjs.com/scripts/events/keyboard_shortcuts/shortcut.js
// @include    /https?://(www\.)?myanimelist.net//*/
// @grant         GM_xmlhttpRequest
// ==/UserScript==

var $j = jQuery.noConflict(true);

var searchData = '';
var dataObj;

function toggleSerachDiv()
{
 var dimmer = $j('#dimmerDivMe');
 var parentDiv = $j('#parentDivMe');
 var resultDivMe = $j('#resultDivMe');
    
    
 if(!dimmer.length) // div not created yet
 {
     $j('body').append('<div id="dimmerDivMe"><div id="parentDivMe" style="padding:5px 0px"></div></div>');
  dimmer = $j('#dimmerDivMe');           
     
  parentDiv = $j('#parentDivMe');
     $j(parentDiv).append('<div id="searchDivMe" style="width: 90%; height: 65px; padding:3px 0px; margin:20px auto; border:solid 1px black; border-radius:3px;">'+
                        '<label for="searchURLMe" style="display: inline-block; width: 76px; text-align: left;">Search URL:</label>'+
                        '<input type="text" name="searchURLMe" id="searchURLMe" style="margin-bottom:2px; padding: 2px; left:2px; top:2px; width: 70%; height: 23px;" value="'+
                          $j(location).attr('href')+'" placeholder="Search query here...">'+
                        
                        '<input type="button" name="fetchHTML" id="fetchHTML" value="Generate" style="margin:0px 6px; padding-top: 3px; padding-bottom: 3px;">'+
                       
                        '<label for="searchFromMe" style="display: inline-block; width: 155px; text-align: left;">Start search from page:</label>'+
                        '<input type="text" name="searchFromMe" id="searchFromMe" style="padding: 2px; left:2px; top:2px; width: 45px; height: 23px;" value="1">'+
                       
                        '<label for="searchTilMe" style="display: inline-block; width: 100px; text-align: center;">Until page:</label>'+
                        '<input type="text" name="searchTilMe" id="searchTilMe" style="padding: 2px; left:2px; top:2px; width: 65px; height: 23px;" title="Type a nubmer or leave it empty to include all possilbe results">'+
                       
                        '<label for="perPageMe" style="display: inline-block; width: 205px; text-align: center;">, Number of results per page:</label>'+
                        '<input type="text" name="perPageMe" id="perPageMe" style="padding: 2px; left:2px; top:2px; width: 70px; height: 23px;" value="show=50">'+
                       
                       '</div>'+ 

                       '<div id="IDManOptions" style="width: 90%; height: 130px; margin:2px auto; border:solid 1px black; border-radius:3px;">'+
                        '<label for="IDManPath" style="display: inline-block; width: 140px; text-align: right;">IDMan directory: </label>'+
                        '<input type="text" name="IDManPath" id="IDManPath" style="margin: 2px 0px 0px 2px; padding: 2px; left:2px; top:2px; width: 75%; height: 23px;" value="C:\\Program Files\\Internet Download Manager"><br>'+
                       
                        '<label for="saveToPath" style="display: inline-block; width: 140px; text-align: right;">Save files to directory: </label>'+
                        '<input type="text" name="saveToPath" id="saveToPath" style="margin: 2px 0px 0px 2px; padding: 2px; left:2px; top:2px; width: 75%; height: 23px;" value="C:\\Downloads\\Images"><br>'+
                       
                        '<label for="namingFormatMe" style="display: inline-block; width: 140px; text-align: right;">Files naming format: </label>'+
                        '<input type="text" name="namingFormatMe" id="namingFormatMe" style="margin: 2px 0px 0px 2px; padding: 2px; left:2px; top:2px; width: 75%; height: 23px;" value="%anime_name">'+

                       '<label style="display: inline-block; width: 685px; text-align: right; margin-top: 3px;">(Format: %id, %anime_name, %start_date, %end_date & anything else will be added literally)</label>'+
                       
                       '</div>'+                       
                       
                       '<div id="resultDivMe" style="width: 90%; min-height: 215px; margin:5px auto; border:solid 1px black; border-radius:3px;">'+
                       '<dl style="text-align: left; padding: 2px 0px 0px 4px;"><dt>Text: <a href="#" id="selectTxt">Select all</a></dt></dl>'+
                       '<textarea id="fetchedLinksMe" rows="10" placeholder="links to be generated here..." cols="87"></textarea>'+
                       '</div>'+
                       
                       '<div id="processingDivMe" style="display:none"></div>');
     
 }
 
 dimmer.css( {'width': '100%', 'height': '100%', 'left': '0px', 'top': '0px', 'position': 'fixed', 
              'background-color': 'rgba(0, 0, 0, 0.8)', 'z-index': '999'});
    
 parentDiv.css( {'width': '60%', 'height': '80%', 'margin': '82px auto', 'background': 'white'});    
    
 parentDiv.css( {'width': '60%', 'height': '80%', 'margin': '82px auto', 'background': 'white'});   

 dimmer.fadeToggle('slow');
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



    
function extractImagesAndTitles(txtAreaID, txtToParse, dataObj)
{
 //var dataObj = JSON.parse(searchData);
 var txtArea = $j(txtAreaID);
 var html = txtToParse;
 var nbResult = 0;
    
 $j('#processingDivMe').append(html);  
    
     // find the parent table to check if start_date or end_date td exist and if so, we get their positions in the table to use them when applying the file_naming_format,
     // things would've been easy if the table has an ID or is wrapped inside a div with an ID,
    // this is applied only once.

    if(!dataObj.hasOwnProperty("startDate"))
    {    
     var  myTable = $j('#processingDivMe').find('td div.picSurround').closest('table');
     var tdStartDate = myTable.find('tr td:contains("Start Date")').index();
     var tdEndDate = myTable.find('tr td:contains("End Date")').index();
    
     dataObj.startDate = tdStartDate;
     dataObj.endDate = tdEndDate;         
    }
    
    
    $j('#processingDivMe').find('td div.picSurround').each(function(){
      
      dataObj.idx++;
        
      var parentTr = $j(this).closest('tr');
        
      var aLink = $j(this).find('a.hoverinfo_trigger');
      var img = $j(this).find('img');
      var newName = dataObj.namingFormat;
      var tmp_name = aLink.attr('href');  
      
      newName = newName.replace(/\%id/gi, dataObj.idx);
        
      tmp_name = tmp_name.replace(/\/anime\/[\d]+\/(.+)$/gi, '$1'); // get anime_name
      tmp_name = tmp_name.replace(/[^\w\d\_\-\.\(\)\[\]\!\s]/gi, '-'); // replace all illegal characters with an '_'
        
      newName = newName.replace(/\%anime\_name/gi, tmp_name);        
        
      var tmp_date;
        
      // apply start_date  
      if(dataObj.startDate > -1 && newName.match(/\%start\_date/gi))
      {
       // date format mm-dd-yy
       tmp_date = parentTr.find('td').eq(dataObj.startDate + 1).text();
       tmp_date = tmp_date.replace(/^[^\d]{1,2}/i, 'mm');  // replace missing Month, which is a '?'
       tmp_date = tmp_date.replace(/^(.{1,2}\-)[^\d]{1,2}/i, '$1dd');  // replace missing Day, which is a '?'
       tmp_date = tmp_date.replace(/\-[^\d]{1,2}$/i, '-yy');  // replace missing Year, which is a '?' 
       tmp_date = tmp_date.replace(/^(.{1,2})\-(.{1,2})\-(.{1,2})$/i, '$2-$1-$3');         
                
       newName = newName.replace(/\%start\_date/gi, tmp_date);  
      }   

      // apply end_date  
      if(dataObj.endDate > -1 && newName.match(/\%end\_date/gi))
      {
       // date format mm-dd-yy
       tmp_date = parentTr.find('td').eq(dataObj.endDate + 1).text();
       tmp_date = tmp_date.replace(/^[^\d]{1,2}/i, 'mm');  // replace missing Month, which is a '?'
       tmp_date = tmp_date.replace(/^(.{1,2}\-)[^\d]{1,2}/i, '$1dd');  // replace missing Day, which is a '?'
       tmp_date = tmp_date.replace(/\-[^\d]{1,2}$/i, '-yy');  // replace missing Year, which is a '?' 
       tmp_date = tmp_date.replace(/^(.{1,2})\-(.{1,2})\-(.{1,2})$/i, '$2-$1-$3');         
                
       newName = newName.replace(/\%end\_date/gi, tmp_date);  
      }   
                                                           
                                                           
                                                           
      txtArea.val(txtArea.val() + 'idman.exe /d ' + img.attr('src').replace(/[a-z](\.jpg)$/gi, 'l$1') + ' /p ' + dataObj.saveToPath + ' /f ' + newName + '.jpg /a /n \n' );
      
      nbResult++;
        
    });   
    
   // try next page 
   $j('#processingDivMe').html('');
   
   dataObj.searchFrom++; 
    
   if(nbResult == dataObj.perPage && (dataObj.searchTil == 0 || dataObj.searchFrom <= dataObj.searchTil) )
   {
    $j('#searchFromMe').val(dataObj.searchFrom);
    $j("#fetchHTML").click();
   }
}

    
    

(function () {
    $j(document).ready(function(){
        
        
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
        
     
     // change the z-index of youtube search&+ div, so the darkening effect will take the entire screen  
     $j('#masthead-positioner').css('z-index', '10');
        
     // assign a shortcut to toggle between the darken/undarken effect
     shortcut.add('ctrl+shift+l', toggleSerachDiv);
        
        
        
     // undarken the screen by mouse click or ESC key
     //$j(document).on("click", "#dimmerDivMe", lightOn);
        
     shortcut.add('esc', lightOn);
        
        // select all textarea text
        $j(document).on('click', '#selectTxt', function(e){
            e.preventDefault();
            $j('#fetchedLinksMe').select();
        });
        
        // catch on paste URL event
        $j(document).on('change', '#searchURLMe', function(e){

            var tmp_val = 0;
            
            if($j(this).val().match(/(?:http:\/\/)?(?:myanimelist\.net\/anime\.php\?.+)show=([\d])+.*/i) ) 
            tmp_val = $j(this).val().replace(/(?:http:\/\/)?(?:myanimelist\.net\/anime\.php\?.+)show=([\d]+).*/i, '$1');
            
            var tmp_perPage = $j('#perPageMe').val().replace(/[\s]*[\w\-\_\d]+=([\d]+)[\s]*/g, '$1');
               
            if(tmp_val && tmp_perPage && tmp_perPage > 0) $j('#searchFromMe').val(Math.floor(tmp_val / tmp_perPage) + 1);
        });
        
        
        $j(document).on("click", "#fetchHTML", function(){
            
           if(searchData === '') // initialize data
           {    
            // URL & search settings   
            var aLink = $j('#searchURLMe').val();
            
               
            var start_from = $j('#searchFromMe').val();

            //var tmp_val = 0;
            
            //if(aLink.match(/(?:http:\/\/)?(?:myanimelist\.net\/anime\.php\?.+)show=([\d])+.*/i) ) 
            //tmp_val = aLink.replace(/(?:http:\/\/)?(?:myanimelist\.net\/anime\.php\?.+)show=([\d]+).*/i, '$1');
               
            //if(tmp_val && perPage && perPage > 0) start_from = Math.floor(tmp_val / perPage) + 1;   
               
            var end_at = $j('#searchTilMe').val();
            if(end_at === '') end_at = 0;
                
            var perPageStr = $j('#perPageMe').val().replace(/[\s]*([\w\-\_\d]+=)[\d]+[\s]*/g, '$1');
            var perPage = $j('#perPageMe').val().replace(/[\s]*[\w\-\_\d]+=([\d]+)[\s]*/g, '$1');                 
            
            aLink = aLink.replace(/&show=\d+/i, '');
               
            
            
            // IDMan options
            var idman_path = $j('#IDManPath').val().replace(/\\/g, '\\\\').trim();
            var save_files_to = $j('#saveToPath').val().replace(/\\/g, '\\\\').trim();   
            var namingFormat = $j('#namingFormatMe').val().trim();
               
               searchData = '{"idx":0, "searchURL":"'+aLink+'","searchFrom":'+start_from+',"searchTil":'+end_at+', "perPageStr":"'+perPageStr+'", "perPage":'+perPage+
                         ', "IDManPath":"'+idman_path+'", "saveToPath":"'+save_files_to+'", "namingFormat":"'+namingFormat+'"}'; 

            dataObj = JSON.parse(searchData); 
            //$j('#fetchedLinksMe').attr('value', ''); 
            $j('#fetchedLinksMe').val('cd ' + dataObj.IDManPath + '\n');   
           }    
                       
            fetcher.fetch(dataObj.searchURL + '&' + dataObj.perPageStr + ( ( dataObj.searchFrom - 1) * dataObj.perPage), function(response) {
                 //var contentText = $j($j.parseXML(response.responseText)).find("response long-url").text();
                 //$j(e.target).css('color', 'green').attr('href', contentText).unbind();
                
                extractImagesAndTitles('#fetchedLinksMe', response, dataObj);

              });

        });   


    });
        
})();


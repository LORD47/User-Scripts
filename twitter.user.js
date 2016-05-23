// ==UserScript==
// @name       twitter
// @description  show images thumbnails on twitter
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include    /https?://(www\.)?twitter.com/*
// @exclude    /https?://(www\.)?twitter.com/[^/]+/(following|followers|status)/*/
// @grant    none
// ==/UserScript==

var $j = jQuery.noConflict(true);

// TBR> just for Imagus extention to be able to play gifs
function addVideoLink(expnddDiv, cardSelector)
{
 /*  var cardDiv = expnddDiv.find(cardSelector);
     
  if( (cardDiv !== null) && cardDiv.attr('data-card2-name')!== undefined && ($j.trim(cardDiv.attr('data-card2-name')) == 'animated_gif') )
  {       
   var img = cardDiv.find('img');
   var video = cardDiv.find('video');
   var aLink = $j('<a></a>').insertBefore(img);
   aLink.attr('href', video.find('source').attr('video-src'));
   aLink.append(img);
   video.remove();  
  }*/    
  
}


function expandHiddenDiv(ID)
{    
     var myOL = $j(ID);
     var i = 0;
     if(myOL.attr('data-me-olsize')) i = myOL.attr('data-me-olsize');     
        
     myOL.find('li').slice(i).each(function(){     
     
      var expnddDiv = $j(this).find('div.expanded-content.js-tweet-details-dropdown');
                                     
      if($j.trim(expnddDiv.html()).length === 0) 
      //if($j.trim(expnddDiv.html()).length === 0)
      //if(expnddDiv.is(':hidden'))             
      //if(expnddDiv.css('display') === 'none')    
      {    
       var firstDiv = $j(this).find('div:first-child');  
       var myData = firstDiv.data('expanded-footer');
       firstDiv.attr('data-expanded-footer', '');
         
       expnddDiv.html(myData);
          
       // TBR> just for Imagus extention to be able to play gifs /////////////////
       addVideoLink(expnddDiv, 'div div[data-card2-name]');
       //////////////////////////   
          
       expnddDiv.css('height','auto').show();
       
       // change color to indicate that this item has been processed
       /*var span = $j(this).find('a b span');
       if((span.text()).indexOf('>') === -1) span.text('>'); else span.text(span.text()+'+');  */
       $j(this).find('a b span').css("color", "rgb(151, 221, 62)");          
          
      }                      
         else if($j.trim(expnddDiv.html()).length > 0) // TBR
             {
              addVideoLink(expnddDiv, 'div div[data-card2-name]');
             }    
                  
         
         
    });
    
    myOL.attr('data-me-olsize', myOL.children("li").length);

    
}

(function () {
    //$j(document).ready(function(){
    $j(window).load(function(){   
        
        $j('#stream-items-id').each(function(){ expandHiddenDiv('#stream-items-id'); });      

        var myNode = document.querySelector('#stream-items-id');
        
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        
        var observer = new MutationObserver(function(mutations, observer) {
            // fired when a mutation occurs
            //expandHiddenDiv('#stream-items-id');
            mutations.forEach(function(mutation) {
              if (mutation.type === 'childList') expandHiddenDiv('#stream-items-id');
            });
            
        });        

        observer.observe(myNode, { childList: true });        
    });
        
})();


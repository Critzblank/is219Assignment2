// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}

var $_GET = getQueryParams(document.location.search);
console.log($_GET["json"]);


function swapPhoto() {

  if(mCurrentIndex > mImages.length-1){
    mCurrentIndex = 0;
    }
  else if (mCurrentIndex < 0) {
    mCurrentIndex = mImages.length-1;
    }

  $('#photo').attr('src',mImages[mCurrentIndex].img);
  $('.location').text("Location: "+mImages[mCurrentIndex].imgLocation);
  $('.description ').text("Description: "+mImages[mCurrentIndex].description);
  $('.date ').text("Date: "+mImages[mCurrentIndex].date);
  
  mCurrentIndex++;
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
 
  $('img.moreIndicator').click(function()  {
    if($(this).hasClass('rot90')){
      $(this).removeClass('rot90').addClass('rot270');
      $('div.details').fadeToggle('slow', 'swing');
      }
    else  {
      $(this).removeClass('rot270').addClass('rot90');
      $('div.details').fadeToggle('slow', 'swing');
      }
    });
    
  $( "#nextPhoto" ).click(function() {
    swapPhoto();
    });

  $( "#prevPhoto" ).click(function() {
    
    if(mCurrentIndex == 0){
      mCurrentIndex = mImages.length-=1;
      }
    else{
      mCurrentIndex-=2;
      }
    
    swapPhoto();
    });
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(location, description, date, img) {
  this.location = location;
  this.description = description;
  this.date = date;
  this.img = img;
}

function reqListener(){
  
  try{
    var mJson = JSON.parse(this.responseText);
    
    for (var i = 0; i < mJson.images.length; i++){
      var temp = mJson.images[i];
      var picture = new GalleryImage(temp.imgLocation, temp.description, temp.date, temp.imgPath);
      mImages.push(picture);
      }
    }
  
  catch(error){
    mRequest.addEventListener("load", reqListener);
    mRequest.open("GET", "images.json");
    mRequest.send();
    }
}

mRequest.addEventListener("load", reqListener);
mRequest.open("GET", "images.json");
mRequest.send();

    
    
    
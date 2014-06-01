var baseURL = "http://garfield.com/uploads/strips/";
var fileFormat = ".jpg";
var comic, comicStripURL;

function zeroFormat (d) {
	//prepend a zero to any single digit string so that we can make the query correctly for the comic strip
	return ( d.toString().length == 1 ? ("0" + "" + d ) : d );
}

function loadComicStrip(e) {
	var stripName = $(this).find('img').attr('data-strip');
    var isSunday = $(this).attr('data-sunday-strip');
    window.location.assign('strip.html?'+'sundaystrip='+isSunday+'&strip='+stripName);
}

function showComicStrip() {
    var urlPieces = window.location.toString().split('=');
    var isSunday = urlPieces[1].split('&')[0];
    if(isSunday === "true") {
        $('.str-comic-strip').addClass('x-sunday-strip');
    }
    $('.str-landscape-strip .x-strip-container img').attr('src', baseURL + urlPieces[2] + fileFormat);
    $('.str-portrait-strip .x-strip-container img').attr('src', baseURL + urlPieces[2] + fileFormat);
}

function loadComicCarousel(startup) {

	var dayDecrement;
	if(startup || !localStorage.getItem( 'dayDecrement')) {
			//seconds per day. need to convert to miliseconds, but storing in seconds for compactness
			dayDecrement = 86400;
		}
		else {
			dayDecrement = parseInt(localStorage.getItem( 'dayDecrement'));
		}
    for(var i=0; i<10; i++) {
        var strip = $('.str-strip-template').clone();
        
        var year, month, day;
		
		var dateToLoad = new Date(dateObj.getTime() - (dayDecrement*1000));
        var isSunday = dateToLoad.getDay() == 0 ? 'true' : 'false';
		var stripName = dateToLoad.getFullYear() + "-" + ( zeroFormat(dateToLoad.getMonth() + 1) ) + "-" + zeroFormat(dateToLoad.getDate());
		comicStripURL = baseURL + stripName + fileFormat;
		//$(this).css("background-image",'url("'+comicStripURL+'")');
		//$(".dailySegmentLabel", this).html((dateToLoad.getMonth()+1)+"/"+dateToLoad.getDate()+"/"+dateToLoad.getFullYear().toString().substring(2,4));
		//$(this).attr("name",comicStripURL);
		//$(this).removeClass('unloaded');
		//add a day
		dayDecrement = Number(dayDecrement+86400);
        localStorage.setItem( 'dayDecrement' , dayDecrement );
        
        strip.attr('data-sunday-strip', isSunday);
        strip.find('img').attr('src', comicStripURL)
                         .attr('data-strip', stripName);
        strip.attr('class','str-strip');
        strip.on("click",loadComicStrip);
		strip.appendTo('.str-strip-list');
    }
}

$(document).ready(function() {
    dateObj = new Date();
	//construct date string to query for today's comic strip
	// have to add 1 to month to get correct calendar month
	year = dateObj.getFullYear();
	month = dateObj.getMonth() + 1;
	day = dateObj.getDate();
    
    loadComicCarousel(true);
});
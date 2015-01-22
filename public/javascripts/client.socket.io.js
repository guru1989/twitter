

var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
jQuery(function ($) {
	var tweetList1 = $('ul.tweets1');
	var tweetList2 = $('ul.tweets2');
    loveCounter = $('li.love');
    hateCounter = $('li.hate');
    loveCounterPercentage = $('li.love span'),
    hateCounterPercentage = $('li.hate span');
    totalcount=$('h3.total');
    lovecount=$('h3.lovecount');
    hatecount=$('h3.hatecount');


    $("button.stop").click(function(){
    	server.emit("stop",{text:"stop"});
    });

    server.on('love-tweet', function (data) {
    	tweetList1.prepend('<li>' + data.user + ': ' + data.text + '</li>');
        loveCounter.css("width", data.love + '%'); 
        loveCounterPercentage.text(Math.round(data.love * 10) / 10 + '%');
        totalcount.text("Tweet Count:"+data.total);
        lovecount.text("Love:"+data.lovecount);
        hatecount.text("Hate:"+data.hatecount);
    });
    
    server.on('hate-tweet', function (data) {
    	tweetList2.prepend('<li>' + data.user + ': ' + data.text + '</li>');
        hateCounter.css("width", data.hate + '%'); 
        hateCounterPercentage.text(Math.round(data.hate * 10) / 10 + '%');
        totalcount.text("Tweet Count:"+data.total);
        lovecount.text("Love:"+data.lovecount);
        hatecount.text("Hate:"+data.hatecount);
    }); 

});
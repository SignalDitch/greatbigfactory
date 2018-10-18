loadArticle();

$('#aboutlink').click(function(){location.replace("/?section=about");});
$('#infolink').click(function(){location.replace("/?section=info");});
$('#quotelink').click(function(){location.replace("/?section=quote");});

function loadArticle(){

	var contentID = getUrlParameter('article');

	$.get( "/api/assets/posts/"+contentID, function( data ) {
		renderContent(data.title, data.publishedDate, data.content);
	});
}

function renderContent(title, date, content){
	
	var converter = new showdown.Converter({tables: true, strikethrough: true});
	$('#article').append("<div class=\"articletitle\">"+title+"</div>");
	$('#article').append("<div class=\"articledate\">Published on "+date.split('T')[0]+"</div>");
	$('#article').append("<div class=\"articlebody\">" + converter.makeHtml(content) + "</div>");
	
}
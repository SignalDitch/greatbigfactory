$(window).resize(function(){
	var leftMargin = $(window).width()/4;
    $('#logo').css('left', leftMargin + "px");
	$('.menulink').css('left', leftMargin + 150 + "px");
	var rightMargin = $(window).width() - leftMargin;
	$('#userstatus').css('left', rightMargin - 150 + "px");
});

$( document ).ready(function(){
	var leftMargin = $(window).width()/4;
    $('#logo').css('left', leftMargin + "px");
	$('.menulink').css('left', leftMargin + 150 + "px");
	var rightMargin = $(window).width() - leftMargin;
	$('#userstatus').css('left', rightMargin - 150 + "px");	
});

$('#userModal').hide();
$('#login').click(loginPop);
$('#register').click(loginPop);
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

function loginPop(){
	$('#overlay').addClass('blur');
	$('#userModal').show();
}

function loginUnpop(){
	$('#overlay').removeClass('blur');
	$('#userModal').hide();
}

function login(){
	$.post( "api/authenticate", { email: $("[name='user']").val(), password: $("[name='pass']").val() }).done(function( data ) {
		if( data.status == true ){
			
		}else{
			
		}
	});
}

function register(){
	
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
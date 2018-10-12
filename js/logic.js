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
	
	var page = getUrlParameter('section');
	if(page=='about'){loadAbout();
	}else if(page=='info'){loadInfo();
	}else if(page=='quote'){loadQuote();}
});

$('#userModal').hide();
$('#login').click(loginPop);
$('#register').click(loginPop);
$('#aboutlink').click(loadAbout);
$('#infolink').click(loadInfo);
$('#quotelink').click(loadQuote);

function loadQuote(){
	history.pushState(null, '', '/?section=quote');
	$('.content').hide();
	$('#quoteform').show();
	$('.menulink').removeClass('youarehere');	
	$('#quotelink').addClass('youarehere');		
}

function loadAbout(){
	history.pushState(null, '', '/?section=about');
	$('.content').hide();
	$('#about').show();
	$('.menulink').removeClass('youarehere');	
	$('#aboutlink').addClass('youarehere');		
}

function loadInfo(){
	history.pushState(null, '', '/?section=info');
	$('.content').hide();
	$('#info').show();
	$('.menulink').removeClass('youarehere');	
	$('#infolink').addClass('youarehere');	
	$('#infoList').html('');

	$.get( "api/assets/posts", function( data ) {
		data.forEach(function(element){
			var articleLink = "<a href=\"posts.html?article=" + element.id + "\" class=\"infoLink\">";
			articleLink += element.title + "</a><br/>";
			$('#infoList').append(articleLink);
		});
	});
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
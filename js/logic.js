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
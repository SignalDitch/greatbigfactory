var bomObject = new Array();
var user;

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
$('#bomfile').change(bomReader);

validateSession(docCookies.getItem('sessionID'));

if(getUrlParameter('session')!=null){
	validateSession(getUrlParameter('session'));
}

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
			renderPost(element);
		});
	});
}

function renderPost(post){
	
	var title = post.title;
	var id = post.id;
	var date = post.date.split('T')[0];
	var img = '/img/'+post.img;
	
	var converter = new showdown.Converter({tables: true, strikethrough: true});
	var preview = converter.makeHtml(post.prev);

	var postBlock = '<div class=\'postblock\'>';
	postBlock += '<div class=\'postblock-title\'><a href=\'/posts.html?article=' + id + '\'>' + title + '</a></div>';
	postBlock += '<div class=\'postblock-date\'>published on ' + date + '</div>';
	postBlock += '<div class=\'postblock-preview\'>' + preview + '...</div>';
	postBlock += '<img class=\'postblock-image\' src=\'' + img + '\'>';
	postBlock += '</div>'
	
	$('#infoList').append(postBlock);
	
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

function bomReader(){
	
	var input, file, fr;
	
	input = document.getElementById('bomfile');
	file = input.files[0];
    fr = new FileReader();
    fr.onload = function(e){
		var extension = file.name.split('.').pop().toLowerCase();
		
		switch(extension){

			case 'csv':
				bomProcessor(fr.result, 1);
				break;
			default:
			
				if( file.name.includes('.') ){
					$('#uploadtitle').text('This does not seem to be an EAGLE (no extension) or KiCAD BOM (.csv) file.');
				}else{
					bomProcessor(fr.result, 0);
				}
				break;
				
		}
	};
    fr.readAsText(file);
	
}

function bomProcessor(bom, type) {
	
	if(type == 0){
		parseEagle(bom);
	}
	if(type == 1){
		parseKiCad(bom);
	}
	
}

function parseKiCad(bom){
	
	bomObject = [];
	
	var bomIndex = 1;
	
	bom.split("\n").forEach(function(line){
		
		var linesplit = line.split(';');
		
		if(linesplit[0] == bomIndex.toString()){
			
			linesplit[1].split(',').forEach(function(designator){
				
				if(designator != ''){
					
					
					
					bomObject.push({
						
						designator: designator.replace('"','').replace('"',''),
						package: linesplit[2].replace('"','').replace('"',''),
						value: linesplit[4].replace('"','').replace('"',''),
						instruction: 'dnp'
						
					});
					
				}
				
			});
			
			bomIndex++;
			
		}else{
			
				
			
		}
			
	});
	
	renderQuoteForm();
	
}

function parseEagle(bom){
	
	bomObject = [];
	
	bom.split("Orientation")[1].split("\n").forEach(function(line){
		
		var linesplit = line.replace(/\s+/g, ' ').split(' ');
			
		if(linesplit[0] != '' && linesplit[0] != undefined){
			
					bomObject.push({
						
						designator: linesplit[0].replace('"','').replace('"',''),
						package: linesplit[2].replace('"','').replace('"',''),
						value: linesplit[1].replace('"','').replace('"',''),
						instruction: 'dnp'
						
					});
		
		}
			
	});
	
	renderQuoteForm();
	
}

function renderQuoteForm(){

	$('#quote').html('');
	
	$('#quote').append('<div style=\'font-size: 16pt; font-weight: bold; margin-bottom: 15px;\'>- Placement Instructions -</div>');
	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #ffcc00; font-weight: bold;\'><div class=\'column1\'>Designator</div><div class=\'column2\'>Package</div><div class=\'column3\'>Value</div><div class=\'column4\'>Placement</div></div>');
	
	var smtlib = ['smt','smd','0201','0402','0603','0805','1206','1812','eia','sot','soic','sop','qfp','bga','plcc'];
	
	bomObject.forEach(function(element, index){
		
		var bgcolor = (index%2 == 0) ? "white" : "#f8f8f8" ;
		
		$('#quote').append('<div id=\'bomLine_'+index+'\' class=\'bomLine\' style=\'background-color: ' + bgcolor + ';\'><div class=\'column1\'>' + element.designator + '</div><div class=\'column2\'>' + element.package + '</div><div class=\'column3\'>' + element.value + '</div><select class=\'column4\' id=\'' + index + '_instructions\'><option value=\'dnp\'>Do Not Populate</option><option value=\'smt\'>SMT</option><option selected value=\'pth\'>PTH</option><option value=\'fid\'>Fiducial</option></select></div>');
		
		smtlib.forEach(function(keyword){
			if(element.package.toLowerCase().includes(keyword)){
				$('#bomLine_'+index).find('option').removeAttr('selected');
				$('#bomLine_'+index).find('option[value="smt"]').attr('selected', 'selected');
			}
		});
		
		if(element.package.toLowerCase().includes('fiducial')){
			$('#bomLine_'+index).find('option').removeAttr('selected');
			$('#bomLine_'+index).find('option[value="fid"]').attr('selected', 'selected');
		}
		
	});	

	$('#quote').append('<div style=\'font-size: 16pt; font-weight: bold; margin-bottom: 15px; margin-top: 25px;\'>- Board Info -</div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #ffcc00; font-weight: bold;\'> </div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\' id=\'smtplacements\'>SMT Placements per Board: 0</div><div class=\'column3\' id=\'pthplacements\'>PTH Placements per Board: 0</div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\' id=\'dnpplacements\'>Unpopulated Footprints: 0</div><div class=\'column3\' id=\'fiducials\'>At Least 2 Fiducials: X</div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><span class=\'quotetip column3\'>(Click <a href=\'http://greatbigfactory.com/posts.html?article=5bc52b19e27d042254ede589\' target=\'_blank\'>here</a> to learn about fiducials)</span></div>');
	
	$('#quote').append('<div style=\'font-size: 16pt; font-weight: bold; margin-bottom: 15px; margin-top: 25px;\'>- Order Details -</div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #ffcc00; font-weight: bold;\'> </div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Board Format: </span><input type=\'radio\' name=\'boardformat\' id=\'individual\' checked=\'checked\'>Individual <input type=\'radio\' name=\'boardformat\' id=\'panelized\'>Panelized</div><div class=\'column3 disactivated\' id=\'boardsperpanelfield\'><span style=\'font-weight: bold;\'>Boards Per Panel </span><input type=\'number\' id=\'boardsperpanel\' style=\'margin-left: 10px;width: 30px;\' value=\'1\'></div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><span class=\'quotetip column1\'>(You can click <a href=\'http://greatbigfactory.com/posts.html?article=5bc528c7e27d042254ede588\' target=\'_blank\'>here</a> to read up on panelization)</span></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\'><span id=\'boardqtyfield\' style=\'font-weight: bold;\'>Number of Boards </span><input type=\'number\' id=\'boardsqty\' style=\'margin-left: 10px;width: 30px;\' value=\'10\'></div><div class=\'column3 disactivated\' id=\'totalboardqty\' style=\'font-weight: bold;\'>Total Boards: 10</div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Will You Supply the Parts? </span><select style=\'margin-left: 10px;\'><option selected value=\'yes\'>Yes, I\'ll Supply All Parts</option><option value=\'some\'>Yes, I\'ll Supply Some Parts</option><option value=\'no\'>No, Please Source Parts For Me</option></select></div></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><span class=\'quotetip column1\'>(You might want to check out <a href=\'http://greatbigfactory.com/posts.html?article=5bc050a7a907a306b81a052d\' target=\'_blank\'>our tutorial on part sourcing</a>)</span></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Will You Supply the Stencil? </span><select style=\'margin-left: 10px;\'><option selected value=\'yes\'>Yes, I\'ll Supply a Stencil</option><option value=\'no\'>No, Please Order a Stencil</option></select></div></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><span class=\'quotetip column1\'>(Also check out <a href=\'http://greatbigfactory.com/posts.html?article=5bc050caa907a306b81a052f\' target=\'_blank\'>our introduction to stencils</a>)</span></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');

	$('#quote').append('<div id=\'calculateBtn\'>Calculate</div>');
	
	$('#calculateBtn').click(function(){
		alert('Sorry, Our Online Quote Form is Temporarily Down');
	});
	
	$('select').change(function(){
		updateQuoteForm();
	});

	$('input').change(function(){
		updateQuoteForm();
	});
	
	updateQuoteForm();
	
}

function updateQuoteForm(){
	
	var smt = 0;
	var pth = 0;
	var dnp = 0;
	var fid = 0;
	
	// Update the bomObject with the form info
	// and also update the placement counts
	bomObject.forEach(function(element, index){
		
		var instr = $('#' + index + '_instructions').find(':selected').attr('value');
		
		element.instruction = instr;
		
		if(instr == 'smt'){
			smt++;
		}else if(instr == 'pth'){
			pth++;
		}else if(instr == 'dnp'){	
			dnp++;
		}else if(instr == 'fid'){	
			fid++;
		}
		
	});
	
	// Update the board info fields
	$('#smtplacements').text('SMT Placements per Board: ' + smt);
	$('#pthplacements').text('PTH Placements per Board: ' + pth);
	$('#dnpplacements').text('Unpopulated Footprints: ' + dnp);

	if(fid>1){
		$('#fiducials').html('At Least 2 Fiducials: &#x2714;');
	}else{
		$('#fiducials').html('At Least 2 Fiducials: &#x2716;');
	}	
	
	if($('input[name="boardformat"]:checked').attr('id') == 'panelized'){
		
		$('#boardsperpanelfield').removeClass('disactivated');
		$('#totalboardqty').removeClass('disactivated');
		$('#boardqtyfield').text('Number of Panels');
		$('#totalboardqty').text('Total Boards: ' +  ($('#boardsperpanel').val() * $('#boardsqty').val()));
		
			
	}else{

		$('#boardsperpanelfield').addClass('disactivated');
		$('#totalboardqty').addClass('disactivated');
		$('#boardsperpanel').val(1)
		$('#boardqtyfield').text('Number of Boards');
		$('#totalboardqty').text('Total Boards: ' +  $('#boardsqty').val());	
		
	}

	
}


$('#loginButton').click(function(){
	
	var authData = { email: $('#email').val().toString(), pwd: $('#pass').val().toString() }
	
	if(authData.email == ''){
		
		$('#email').attr('placeholder', 'Enter Your Email Address');
		$('#pass').attr('placeholder', 'Enter Your Password');		
		
	}else{
		
		$.ajax({
		  contentType: 'application/json',
		  type: "POST",
		  url: "api/users/authenticate",
		  data: JSON.stringify(authData),
		  success: function(data){
			  login(data);
		  },
		  dataType: 'json'
		});
	
	}
	
	
});

function login(data){
	
	if(data.status == true){
		
		docCookies.setItem("sessionID", data.sessionID, maxAgeToGMT(3600));
		validateSession(data.sessionID);
	
	}else{
		
		switch(data.code){
			
			case '1': //bad password
				$('#authFeedback').text('email and password don\'t match');
			break;
			
			case '2': //no user
				$('#authFeedback').text('email not found');
			break;
			
		}
		
	}
	
}

function validateSession(sessionID){
	
	$.ajax({
		  type: "GET",
		  url: "api/users/sessions/"+sessionID,
		  success: function(data){
			  user = data;
			  if(user.nick != undefined){
				  $('#userstatus').html('Hey, '+user.nick+'! <br/><span id=\'accountBtn\'>Go To Account</span> | <span id=\'logoutBtn\'>Logout</span>');
				  $('#logoutBtn').click(function(){
					  logout(docCookies.getItem('sessionID'));
				  });
				  loginUnpop();
			  }else{
				  
			  }
		  },
		  dataType: 'json'
		});
	
}

function logout(sessionID){
	
	$.ajax({
		  type: "GET",
		  url: "api/users/sessions/drop/"+sessionID,
		  success: function(data){
			logout(docCookies.removeItem('sessionID'));
		  },
		  dataType: 'json'
		});
		
	window.location.href = '/';
		
}

$('#forgotLink').click(function(){
	
	$.ajax({
	  type: "GET",
	  url: "api/users/recover/"+$('#email').val().toString(),
	  success: function(data){
		if(data.status){
			$('#authFeedback').text('a recovery email has been sent');
		}else{
			$('#authFeedback').text('there was a problem sending the recovery email');		
		}
	  },
	  dataType: 'json'
	});
	
});


$('#registerButton').click(function(){
	
	
	
});

function maxAgeToGMT (nMaxAge) {
  return nMaxAge === Infinity ? "Fri, 31 Dec 9999 23:59:59 GMT" : (new Date(nMaxAge * 1e3 + Date.now())).toUTCString();
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


//TODO
/*
- Password Recovery
- Session Cookies
- User Page
	- Order history
	- Submit for Quote
	- Order Status
	- Payment (PayPal Client Integration)
- Online Quote Backend
- Social Tags 
- Info Center content
- Info Center Styling
*/
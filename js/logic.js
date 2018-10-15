var bomObject = new Array();

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

	$('#quote').append('<div style=\'font-size: 16pt; font-weight: bold; margin-bottom: 15px; margin-top: 25px;\'>- Order Details -</div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #ffcc00; font-weight: bold;\'> </div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Board Format: </span><input type=\'radio\' name=\'boardformat\' id=\'individual\' checked=\'checked\'>Individual <input type=\'radio\' name=\'boardformat\' id=\'panelized\'>Panelized</div><div class=\'column3 disactivated\' id=\'boardsperpanelfield\'><span style=\'font-weight: bold;\'>Boards Per Panel </span><input type=\'number\' id=\'boardsperpanel\' style=\'margin-left: 10px;width: 30px;\' value=\'1\'></div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'><div class=\'column1\' id=\'boardqtyfield\'><span style=\'font-weight: bold;\'>Number of Boards </span><input type=\'number\' id=\'boardsqty\' style=\'margin-left: 10px;width: 30px;\' value=\'10\'></div><div class=\'column3 disactivated\' id=\'totalboardqty\' style=\'font-weight: bold;\'>Total Boards: 10</div></div>');
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');
	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Will You Supply the Parts? </span><select style=\'margin-left: 10px;\'><option selected value=\'yes\'>Yes, I\'ll Supply All Parts</option><option value=\'some\'>Yes, I\'ll Supply Some Parts</option><option value=\'no\'>No, Please Source Parts For Me</option></select></div></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'><div class=\'column1\'><span style=\'font-weight: bold;\'>Will You Supply the Stencil? </span><select style=\'margin-left: 10px;\'><option selected value=\'yes\'>Yes, I\'ll Supply a Stencil</option><option value=\'no\'>No, Please Order a Stencil</option></select></div></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: #f8f8f8;\'></div>');	
	$('#quote').append('<div class=\'bomLine\' style=\'background-color: white;\'></div>');

	$('#quote').append('<div id=\'calculateBtn\'>Calculate</div>');
	
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
		$('#totalboardqty').text('Total Boards: ' +  ($('#boardsperpanel').val() * $('#boardsqty').val()));
		
			
	}else{

		$('#boardsperpanelfield').addClass('disactivated');
		$('#totalboardqty').addClass('disactivated');
		$('#totalboardqty').text('Total Boards: ' +  $('#boardsqty').val());	
		
	}

	
}
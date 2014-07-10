// Ile ruchow zrobilismy w grze
var ile = 0;

$(function () {
	// Schowanie guzika SENT
	$('#sent').hide();
	$('#pola').hide();

	//alert('Zacznij grę!');

	// Wczytywanie danych od gracza (Nowa Gra) - klikanie na guzik PLAY
    $('#play button').click(function () {

    	// Sprawdzanie czy wszystkie dane sa wpisane
    	if($('#size').val() !== '' && $('#dim').val() !== '' && $('#max').val() !== ''){
			$('#config').hide("slow");
			$('#play').hide("slow");
			var link = "/play/size/"+ parseInt($("#size").val())+"/dim/"+parseInt($("#dim").val())+"/max/"+parseInt($("#max").val())+"/";

			//Wysłanie config do serwera
			$.ajax({
        	   	url: link,
        	   	method: 'get',
        	   	success: function(){
        	   	        	inputy();
        	   	},
        	   	fail: function(){
        	   	        $('#messages').html("Oh snap! Something went wrong");
        	   	        console.log("Error with create new game");
        		}
	    	});
		}
		else{
			alert("Wrong data");
		}
    });

    // Resetowanie interfejsu
	var resetuj = function(){
		console.log("UWAGA RESETUJE!!");
		for(var i = 0; i < ile * parseInt($("#size").val()); i++){
			$('#' + i).remove();
			$('#pola p').remove();
			$('#pola img').remove();
			$('#pola br').remove();
		}

		$('.info').change(function(){
				$('.info').text("");
			}).change();

		$('#sent').hide("slow");
		$('#play').show("slow");
		$('#config').show("slow");
		$('#pola').hide();
		$('.images').show("slow");
		ile = 0;
	}

	$('.again').click(resetuj);

    // Generowanie nowych pól do gry
	var inputy = function(retVal){
		$('.images').hide("slow");
		var i = 0;
			$('#pola').show("slow");
			$('#sent').show("slow");

			// DEBUG
			console.log("Size: " + parseInt($("#size").val()));
			console.log("Dim: " + parseInt($("#dim").val()));
			console.log("Max: " + parseInt($("#max").val()));
			console.log("Tworze pola");

			for(var iterator = 0; iterator < parseInt($("#size").val()); iterator++, i++){
				var co = ile * parseInt($("#size").val()) + i;
        		$('#pola').append("<input type='text' id = " + co + ">");
    		}

    		ile = ile + 1;
    		
    		// Gwiazdki
    		if(ile > 1){
    			co = co - parseInt($("#size").val())

    			for(var i = 0; i < retVal.good; i ++){
    				$('#' + co).after("<img src='/images/good.png' alt='Good'>");
    			}

    			for(var i = 0; i < retVal.soGood; i ++){
    				$('#' + co).after("<img src='/images/soGood.png' alt='So Good'>");
    			}
    		}
    		$('#pola').append("<br />");
	}

	// Sprawdzanie czy Wygrana
	var sprawdzaj = function(retVal){
		var ruchy;
		
		// Informacja o ilosci pozostalych ruchow (max != 0)
		if(parseInt($("#max").val()) != 0){
			ruchy = parseInt($("#max").val()) - ile + 1;
						$('.info').change(function(){
				$('.info').text("Remaining " + ruchy + " moves");
			}).change();
		}

		// Informacja o ilosci wykonanych ruchow (max === 0)
		else{
			ruchy = ile - 1;
			$('.info').change(function(){
				$('.info').text("You makes " + ruchy + " moves");
			}).change();
		}

		// Wygrana
		if(retVal.win){
    		alert("You Win ;-)");
    		resetuj();
    	}

    	// Przegrana - przekroczenie dozwolonej ilości ruchow
		else if(ile == parseInt($("#max").val()) + 1 && parseInt($("#max").val()) != 0){
			alert("You Lose ;-)");
			resetuj();	
		}
	}

	// Klikanie na guzik SENT
	$('#check').click(function(){
		var link = "/mark/";
		var czy = true;

		// Sprawdzanie czy wszystkie dane sa wpisane
		for(var i = 0; i < parseInt($("#size").val()); i++){
			var co = (ile - 1) * parseInt($("#size").val()) + i;
			
			if($('#' + co).val() === ''){
				czy = false;
			}
		}

		if(czy){
			// Tworzenie linku dla serwera
			for(var i = 0; i < parseInt($("#size").val()); i++){
				var co = (ile - 1) * parseInt($("#size").val()) + i;
				link = link + ($('#' + co).val() + "/");

				// Blokowanie wysłanych pol
				$('#' + co).prop('disabled', true);
			}

			console.log("Dane usera: " + link);

			// Wyslanie danych do serwera
			$.ajax({
           		url: link,
           		method: 'get',
           		success: function(data){
           	       	inputy(data.retVal);
           	       	sprawdzaj(data.retVal);
           		},
           		fail: function(){
           	        $('#messages').html("Oh snap! Something went wrong");
           	        console.log("Error with create new game");
        		}
	    	});
		}
		else{
			alert("Wrong data");
		}
	});

	// Takie tam zabawy
	$('.images').hover(function(){
		$('.images').hide("slow");
	});

	$('.images').mouseleave(function(){
		$('.images').show("slow");
	});

	$('.stopka').mouseover(function(){
		$('.stopka').hide("slow");
	});

	$('.stopka').mouseleave(function(){
		$('.stopka').show("slow");
	});

	$('#menu1').mouseover(function(){
		$('#menu1').hide("slow");
	});

	$('#menu1').mouseleave(function(){
		$('#menu1').show("slow");
	});
});
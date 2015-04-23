$(function() {
	// ElementHandlers
	var mainMenu = $("#mainMenu"), playArea = $("#playArea"), spectateArea = $("#spectateArea"), scoreArea = $("#scoreArea"), playAreaBtnsGroup = $("#playAreaBtnsGroup"), playerName = "";
	/*
	 * playgame()
	 * this function requests the user to enter their names
	 */
	playGame = function() {
		showModal("Player Name", "Please Enter Your Name", { callback : "startGameHook" } );
	};
	/*
	 * spectateGame()
	 * this function navigates the user to Spectate Area
	 */	
	spectateGame = function() {
		mainMenu.hide();
		playArea.hide();
		scoreArea.hide();
		spectateArea.show();
	};
	/*
	 * viewScore()
	 * this function navigates the user to Score Area
	 */	
	viewScore = function() {
		mainMenu.hide();
		playArea.hide();
		spectateArea.hide();
		scoreArea.show();
		populateScore();
	};
	/*
	 * exitArea()
	 * this function navigates the user to Main Menu
	 */	
	exitArea = function(){
		playArea.hide();
		scoreArea.hide();
		spectateArea.hide();
		mainMenu.show();
	};
	/*
	 * Main Menu button handler
	 */	
	mainMenu.find("button").on("click", function() {
		target = $(this).attr("id");
		window[target]();
	});
	/*
	 * Spectate Aera Button Handler
	 */	
	spectateArea.find("button").on("click", function() {
		target = $(this).attr("id");
		window[target]();
	});
	/*
	 * Score Area Button Handler
	 */	
	scoreArea.find("button").on("click", function() {
		target = $(this).attr("id");
		window[target]();
	});
	/*
	 * Capitalizing Function
	 */
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	};
	/*
	 * startGameHook()
	 * this function navigates the user to Main Game Area
	 */	
	startGameHook = function(e){
		hideModal();
		mainMenu.hide();
		spectateArea.hide();
		scoreArea.hide();
		playArea.show();
		var playAreaBtns = "";
		for (var t in items){
			playAreaBtns += '<div class="btn-group" role="group"><button type="button" id="'+items[t]+'" class="selection btn btn-default">'+(items[t]).capitalize()+'</button></div>';
		}
		playAreaBtnsGroup.html(playAreaBtns);
		/*
		 * Play Area button Handler
		 */	
		playArea.find("button.selection").on("click", function() {
			target = $(this).attr("id");
			startGame(target);
		});
		
		playArea.find("button").on("click", function() {
			target = $(this).attr("id");
			if(target === "exitArea"){
				window[target]();
			}
		});
	};
	/*
	 * showModal()
	 * this function generates/displays modal
	 */	
	showModal = function(title, msg, params) {
		var modal = $("#myModal");
		if (typeof (title) === "undefined") {
			modal.find('.modal-title').html("Alert");
		} else {
			modal.find('.modal-title').html(title);
		}
		
		if (typeof (msg) === "undefined") {
			modal.find('.modal-body .msg').html("Enter your name");
		} else {
			modal.find('.modal-body .msg').html(msg);
		}
		
		if (typeof (params) === "undefined") {
			modal.find('.modal-body input').hide();
			modal.find('.modal-footer button.btn-primary').hide();
		} else if (typeof (params) === "object") {
			modal.find('.modal-body input').show();
			modal.find('.modal-footer button.btn-primary').show();
			modal.find('.modal-footer button.btn-primary').on("click", function(e){
				if(modal.find('.modal-body input').val() === ""){
					modal.find('.modal-body input').parent(".form-group").addClass("has-error");
				}else{
					playerName = modal.find('.modal-body input').val();
					window[params.callback](e);
				}
			})
		}
		$('#myModal').modal({
			show : true
		});
	};
	/*
	 * hideModal()
	 * this function hides modal
	 */		
	hideModal = function() {
		$('#myModal').modal("hide");
	};
	/*
	 * Standard RPS Items
	 * 
	 * Add new items here; eg: items[4] = "lizard"; items[5] = "spock";
	 */	
	items = new Array();
	items[1] = "rock", items[2]= "paper", items[3]= "scissors";
	/*
	 * Standard RPS Enemies
	 * 
	 * Add items enemy here; { "lizard" : "rock", "lizard" : "scissors", "scissor" : "spock", "rock" : "spock", "paper" : "lizard", "spock" : "paper", "spock" : "lizard" }
	 */	
	var beatenBy = {
		"rock" : "paper",
		"paper" : "scissors",
		"scissors" : "rock"
	};
	/*
	 * returns a random integer between min and max
	 */
	var randomSelection = function() {
		var min = 1, max = items.length-1;
		return Math.floor(Math.random() * max) + min;
	};
	/*
	 * simulateGame()
	 * This function simulates game being played by 2 players
	 */
	simulateGame = function() {
		var selectionIndex1 = randomSelection();
		var selectionIndex2 = randomSelection();
		var compSelection1 = items[selectionIndex1], compSelection2 = items[selectionIndex2], userEnemy = beatenBy[compSelection1];
		for(x in beatenBy){
			if(x === compSelection1){
				var compEnemy = beatenBy[x];
			}
		}
		if (compSelection1 === compSelection2) {
			showModal("Result", "Bot 1 Choose: " + compSelection1
					+ "<br /><br />Bot 2 Chose: " + compSelection2
					+ "<br /><br />Its a Tie!");
			logResult("Bot 1", compSelection1, "Bot 2", compSelection2, "Tie");
		} else if (userEnemy === compSelection2) {
			showModal("Result", "Bot 1 Choose: " + compSelection1
					+ "<br /><br />Bot 2 Chose: " + compSelection2
					+ "<br /><br />Bot 1 lose!");
			logResult("Bot 1", compSelection1, "Bot 2", compSelection2, "Lost");
		} else {
			for(x in beatenBy){
				if(beatenBy[x] === compSelection1){
					var userSuccess = x;
				}
			}
			if(compSelection1 === compEnemy || userSuccess === compSelection2){
				showModal("Result", "Bot 1 Choose: " + compSelection1
						+ "<br /><br />Bot 2 Choose " + compSelection2
						+ "<br /><br />Bot 1 Win!");
				logResult("Bot 1", compSelection1, "Bot 2", compSelection2, "Won");
			}			
		}
	},
	/*
	 * saveData()
	 * This function saves Game Data
	 */
	saveData = function (name, value) {
	  var cookie = [name, '=', JSON.stringify(value), '; path=/;'].join('');
	  document.cookie = cookie;
	};
	/*
	 * populateScore()
	 * This function generates score from saved game data
	 */
	populateScore = function(){
		var data = readData("matchResult"),
			target = $("#scoreArea .scores .well");
		if(data === null){
			target.html("There are no previous ganes");
		}else{
			var parsedData = JSON.parse(data),
				htmlStr = "";
			for(var x in parsedData){
				htmlStr += x + ": "+ parsedData[x]+"<br />";
			}
			target.html(htmlStr);
		}
	};
	/*
	 * readData()
	 * This function reads saved game data
	 */
	readData= function(name) {
	 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	 result && (result = JSON.parse(result[1]));
	 return result;
	};
	/*
	 * logResult()
	 * This function generates gameData save
	 */
	logResult = function(player1, sel1, player2, sel2, result){
		timeNow = new Date(),
		match = "Match "+result+". Played by "+player1+" (Selected: "+sel1+") & "+player2+" (Selected: "+sel2+").";
		if(readData("matchResult") === null){
			matchResult = {},
			matchResult[timeNow] = match;
			toSave = JSON.stringify(matchResult);
			saveData("matchResult",toSave);
		}else{
			oldData = JSON.parse(readData("matchResult"));
			oldData[timeNow] = match;
			toSave = JSON.stringify(oldData);
			saveData("matchResult",toSave);
		}
	};
	/*
	 * startGame()
	 * This function starts a game vs computer
	 */
	startGame = function(selection) {
		var compSelectionIndex = randomSelection(), compSelection = items[compSelectionIndex];
		userEnemy = beatenBy[selection];
		for(x in beatenBy){
			if(x === selection){
				var compEnemy = beatenBy[x];
			}
		}
		if (selection === compSelection) {
			showModal("Result", playerName + " Choose: " + selection
					+ "<br /><br />Computer Chose: " + compSelection
					+ "<br /><br />Its a tie!");
			logResult(playerName, selection, "Computer", compSelection, "Tie");
		} else if (userEnemy === compSelection) {
			showModal("Result", playerName + " Choose: " + selection
					+ "<br /><br />Computer Chose: " + compSelection
					+ "<br /><br />You lose!");
			logResult(playerName, selection, "Computer", compSelection, "Lost");
		} else { 
			for(x in beatenBy){
				if(beatenBy[x] === selection){
					var userSuccess = x;
				}
			}
			if(selection === compEnemy || userSuccess === compSelection){
				showModal("Result", playerName + " Choose: " + selection
						+ "<br /><br />Computer Chose: " + compSelection
						+ "<br /><br />You Win!");
				logResult(playerName, selection, "Computer", compSelection, "Won");
			}
		}
	};
});
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCy8Rxu3Al4WA4ce3Du_3OBrmjFvR0TPCI",
    authDomain: "rps-m-152ff.firebaseapp.com",
    databaseURL: "https://rps-m-152ff.firebaseio.com",
    projectId: "rps-m-152ff",
    storageBucket: "",
    messagingSenderId: "772778924172"
  };
  firebase.initializeApp(config);
  //database reference
  var database = firebase.database();
  var PlayerName = '';
  var user_1_Name = "";
  var user_2_Name = "";
  var user_1_Choice = "";
  var user_2_Choice = "";
  var newMessage = "";
  var player_1_win = 0;
  var player_1_lose = 0;
  var player_2_win = 0;
  var player_2_lose = 0;
  var turns = 1;
  var delayTimer;
  var delayTimer2;
  var IsGameResetting = false;


$(document).ready(function(){

	//this object handles the score check
	var CheckWinners={
			//restart the game to turn 1
			resetGame : function(){
				IsGameResetting = false;
				turns = 1;
					//update the turn in the firebase to 1
					database.ref().update({
								turn: turns
					});
			},
			//clear the 5 seconds timeout and call the reset
			clearDelay : function(){
				clearTimeout(delayTimer);
				CheckWinners.resetGame();
			},
			//update winner message to winner 1 
			updateWinner1 : function (){
				$("#winner").html( user_1_Name + " wins!!");
			},
			//update winner message to winner 1 
			updateWinner2 : function (){
				$("#winner").html( user_2_Name + " wins!!");
			},
			//update the database to match the player score after the increases
			updateScore: function(){
				database.ref("players/1").update({		
						win: player_1_win,
						lose: player_1_lose,	
				});//database update
				database.ref("players/2").update({
						win: player_2_win,
						lose: player_2_lose,
				});//database update
			},
			//update the local vairable of player scores then call the winner message update and call the score update in the database
			playerSocre : function (){
				// If user picked rock and computer picked scissors then user wins.
				if(user_1_Choice == "rock" && user_2_Choice == "scissors") {	
					player_1_win++;
					player_2_lose++;
					CheckWinners.updateWinner1();
					CheckWinners.updateScore();
				}
				// if user picked rock and computer picked paper then user loses
				if(user_1_Choice == "rock" && user_2_Choice == "paper") {
					player_1_lose++;
					player_2_win++;
					CheckWinners.updateWinner2();
					CheckWinners.updateScore();					
				}
				// if user picked scissor and computer picked rock then user loses
				if(user_1_Choice == "scissors" && user_2_Choice == "rock") {					
					player_1_lose++;
					player_2_win++;
					CheckWinners.updateWinner2();
					CheckWinners.updateScore();		
				}
				// if user picked scissor and computer picked paper then user wins
				if(user_1_Choice == "scissors" && user_2_Choice == "paper") {					
					player_1_win++;
					player_2_lose++;
					CheckWinners.updateWinner1();
					CheckWinners.updateScore();
				}
				// if user picked paper and computer picked rock then user wins
				if(user_1_Choice == "paper" && user_2_Choice == "rock") {					
					player_1_win++;
					player_2_lose++;
					CheckWinners.updateWinner1();
					CheckWinners.updateScore();				
				}
				// if user picked paper and computer picked scissor then user loses				
				if(user_1_Choice == "paper" && user_2_Choice == "scissors") {
					player_1_lose++;
					player_2_win++;
					CheckWinners.updateWinner2();
					CheckWinners.updateScore();
				}
				// if user and computer picks the same
				if(user_1_Choice == user_2_Choice) {
					$("#winner").html("It's a tie!");
				}

			}//playerScore
	}//checkWinners

	//DOM at the innitail Loads
	$("#greetings").html("<h2 id='enter' class='text-center'>Enter Your Name to Play</h2>"
						+"<div class='formcontainter d-flex justify-content-center m-3'></br><input type='text' id='name-input'>" +
						"</br></br><input type='submit' class='btn btn-dark' id='submit-name'></div>");
	$("#waiting1").html("Waiting for player 1");
	$("#waiting2").html("Waiting for player 2");
	
	//Hide these when both players dont exists
	function hidden() {
			$("#player1choices").css("visibility","hidden");
			$("#player2choices").css("visibility","hidden");
			$("#group2message").css("visibility","hidden");
			$("#group1message").css("visibility","hidden");
	}
	hidden();

	//this will run after every database change
	database.ref().on("value", function(snapshot){

		function playerDisconnect(){
			if(PlayerName != ""){
				//if this is Player 1's browser
				if ((snapshot.child("players").child(1).exists()) && (PlayerName == snapshot.child("players").child(1).val().name)){					
						//update the message to the database
						database.ref("/chat").onDisconnect().update({							
							message: ((snapshot.child("players").child(1).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP												
						});
						//delete the player 1 database
						database.ref("players/1").onDisconnect().remove();
				//if this is Player 2's browser
				}else if ((snapshot.child("players").child(2).exists()) && (PlayerName == snapshot.child("players").child(2).val().name)){	
						//update the message to the database	
						database.ref("/chat").onDisconnect().update({						
							message: ((snapshot.child("players").child(2).val().name) + " has been DISCONNECTED!!"),
							dateAdded: firebase.database.ServerValue.TIMESTAMP													
						});//database	
						//delete the player 1 database
						database.ref("players/2").onDisconnect().remove();
						//delete the turn database				
						database.ref("/turn").onDisconnect().remove();	
				}// else if
			}//if
		}//playerDisConnect
		
		//if player 1 dont exists, empty all that related to player 1 and unhilighted both user div
		if(((snapshot.child("players").child(1).exists()) == false)){
				$("#waiting1").html("Waiting for player 1");
				$("#winner").empty();
				$("#win1").empty();
				$("#lose1").empty();
				$("#player1-name").empty();
				$("#whose-turn").empty();
				$("#player-1").css("border", "5px solid black");
				$("#player-2").css("border", "5px solid black");

		};
		//if player 2 dont exists, empty all that related to player 2 and unhilighted both user div
		if(((snapshot.child("players").child(2).exists()) == false)){
				$("#waiting2").html("Waiting for player 2");
				$("#winner").empty();
				$("#win2").empty();
				$("#lose2").empty();
				$("#player2-name").empty();
				$("#whose-turn").empty();
				$("#player-1").css("border", "5px solid black");
				$("#player-2").css("border", "5px solid black");
		};
		//if player 2 exists but not 1,, show player 2 name in his div and unhilighted both user div
		if((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)){
				$("#player2-name").html(snapshot.child("players").child(2).val().name);
				$("#waiting2").empty();
				$("#player-1").css("border", "5px solid black");
				$("#player-2").css("border", "5px solid black");
				hidden();
				//when any player disconnect from the game
				playerDisconnect();
		};
		//if player 1 exists but not 2,,show player 1 name in his div and unhilighted both user div
		if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
				$("#waiting1").empty(); 
				$("#player1-name").html(snapshot.child("players").child(1).val().name);
				hidden();
				//when any player disconnect from the game
				playerDisconnect();
					//at the player1's  browser
					if(PlayerName == snapshot.child("players").child(1).val().name){
							$("#greetings").html("<h2 class='text-center'>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");					
							$("#win1").html("WIN: " + player_1_win);
							$("#lose1").html("LOSE: " + player_1_lose);
					}
		//If both players exists == we are READY to play!
		}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))){
				//Keeping track of turn for the database
				var databaseTurn = snapshot.child("turn").val();
				user_1_Name = snapshot.child("players").child(1).val().name;
	  			user_2_Name = snapshot.child("players").child(2).val().name;
					//Both browers will show...
					$("#waiting2").empty();
					$("#waiting1").empty();
					$("#player2-name").html(snapshot.child("players").child(2).val().name);
					$("#player1-name").html(snapshot.child("players").child(1).val().name);
					$("#win2").html("WIN: " + snapshot.child("players").child(2).val().win);
					$("#lose2").html("LOSE: " + snapshot.child("players").child(2).val().lose);
					$("#win1").html("WIN: " + snapshot.child("players").child(1).val().win);
					$("#lose1").html("LOSE: " + snapshot.child("players").child(1).val().lose);
					//when any player disconnect from the game
					playerDisconnect();
					
				//player 1's browser at player 1's turn
				if((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)){
						$("#greetings").html("<h2 class='text-center'>Hello " + snapshot.child("players").child(1).val().name +  ".  You are player 1!</h2>");
						$("#player-1").css("border", "5px solid red");
						$("#player-2").css("border", "5px solid red");
						hidden();
						$("#player1choices").css("visibility", "visible");
						$("#winner").empty();
						$("#whose-turn").html("It's your turn!");
				}
				//player 1's browser at player 2's turn
				if((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)){//after player 1 picks
						$("#player-1").css("border", "5px solid red");
						$("#player-2").css("border", "5px solid white");
						hidden();
						$("#group1message").css("visibility", "visible");
							$("#group1message").html("Chose: " + "<h2>" + user_1_Choice + "</h2>");
						$("#whose-turn").html("Waiting for " + user_2_Name + " to choose...");
				}
				
				//player2's browser  at player 1's turn
				if((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 1 )){
						$("#greetings").html("<h2 class='text-center'>Hello " + snapshot.child("players").child(2).val().name +  ".  You are player 2!</h2>");
						$("#player-1").css("border", "5px solid red");
						$("#player-2").css("border", "5px solid white");
						$("#whose-turn").html("Waiting for " + user_1_Name + " to choose!!");
						hidden();	
						$("#winner").empty();
				}
				//player2's browser  at player 2's turn
				if((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 2 )){
						$("#player-1").css("border", "5px solid red");
						$("#player-2").css("border", "5px solid white");
						$("#whose-turn").html("It is your turn!"); 
						hidden();							
						$("#player2choices").css("visibility","visible");			
				}
				//both player's browser at turn 3 (after player 2 made a choice) and the increase score function hasn't been called
				if(databaseTurn == 3 && IsGameResetting == false){
						IsGameResetting = true;
						//Restating variables to match the database
						user_1_Choice = snapshot.child("players").child(1).val().choice;
						user_2_Choice = snapshot.child("players").child(2).val().choice;
						player_1_win = snapshot.child("players").child(1).val().win;
						player_1_lose = snapshot.child("players").child(1).val().lose;
						player_2_win = snapshot.child("players").child(2).val().win;
						player_2_lose = snapshot.child("players").child(2).val().lose;
							
							$("#player-1").css("border", "5px solid red");
							$("#player-2").css("border", "5px solid red");
							$("#player2choices").css("visibility","hidden");
							$("#player1choices").css("visibility","hidden");
							$("#group2message").css("visibility","hidden");
							$("#group1message").css("visibility","hidden");		
						 		$("#group1message").html("Chose: " + "<h2>" + user_1_Choice + "</h2>");
						 		$("#group2message").html("Chose: " + "<h2>" + user_2_Choice + "</h2>");
							$("#whose-turn").empty();	
						//call the function to check for winnner
						CheckWinners.playerSocre();
						// Display this page for 5 seconds and call clearDelay function to reset the game
						delayTimer = setTimeout(CheckWinners.clearDelay, 5 * 1000);				
				}	
		}// else if
	}); //database
	//as each user enters the game
	$("#submit-name").on("click", function(){
		//graping the value of the user's name 
		var username = $("#name-input").val().trim();
		//set the screen name to user's name
		PlayerName = username;
		console.log(username);

			// Read snapshot when user adds name as player,, this is where we set
		    database.ref().once('value').then(function(snapshot) {
	 				//if player1 doesn't exists
	 				if((snapshot.child("players").child(1).exists()) === false){
							database.ref("players/1").set({
									name : username,
									win: player_1_win,
									lose: player_1_lose
							}); //database set
					//if player 1 exist but not 2
					}else if((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)){
							database.ref("players/2").set({
								name : username,
								win: player_2_win,
								lose: player_2_lose
						}); //database set
							database.ref().update({
								turn: turns,
						});
					//if both player exists
					}else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())){
					alert("There are two players playing! Try again later!");
					}//else if
			}); //database
	}); //on click

	//if user 1 made a choice 
	$(".choice1").on("click", function(){
			//grap the value of what choice the user made
			user_1_Choice = $(this).val();
			console.log(user_1_Choice);

				database.ref().once('value').then(function(snapshot) {
		 			//match the value of the turn to the database and //increment the turn == it will now be user 2's turn	
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; //2

					//at player 1's brower , well will update the user choice in the database of the choice the user 1 just picked
			 		if((PlayerName == snapshot.child("players").child(1).val().name)){
						database.ref("players/1").update({		
							choice : user_1_Choice,						
						});//database set
						//then update turn to 2
						database.ref().update({		
							turn: turns		
						});
					}//if
				});//database
	}); //on click

	//if user 2 made a choice
	$(".choice2").on("click", function(){
			//grap the value of what choice the user made
			user_2_Choice = $(this).val();
			console.log(user_2_Choice);

				database.ref().once('value').then(function(snapshot) {
		 			//match the value of the turn to the database and //increment the turn == it will now be turn 3		
		 			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
					turns++; //3
					
					//at player 2's brower , well will update the user choice in the database of the choice the user 2 just picked
			 		if((PlayerName == snapshot.child("players").child(2).val().name)){
						database.ref("players/2").update({									
							choice : user_2_Choice,														
						});//database set
						//then update turn to 3
						database.ref().update({
							turn: turns,									
						});
					}//if
				});//database
	}); //on click
 	
 	//if the any user send a message
 	$("#submit-chat").on("click", function(event){
 		//prevent refresh
 		event.preventDefault();
 		console.log(this);
			//grab the value of what the user type  and then empty it;
			var messages = $("#chat-input").val().trim();
			$("#chat-input").val("");
			
			//restate the newMessage to give it's a value
			newMessage = PlayerName + " : " + messages;
					
					//update each chat messages into teh database along with the time it was added
					database.ref("/chat").update({		
						message: newMessage,
						dateAdded: firebase.database.ServerValue.TIMESTAMP								
					});//database push
	}); //on click

	//updating the chat messages in the browser's chat window by using the last one added into the database (time added)
	database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function(snapshot) {
	    		 $("#chat-window").append("</br>" + snapshot.val().message + "</br>");
	});//database

}); // .ready

$(document).ready(function() {

			//Canvas stuff - http://www.w3schools.com/tags/ref_canvas.asp
			var canvas = $("#canvas")[0];
			var ctx = canvas.getContext("2d");
			var w = $("#canvas").width();
			var h = $("#canvas").height();
			
			var bark = new Audio("bark.wav"); 

			//Lets save the cell width in a variable for easy control
			var cw = 10;
			var d;
			var score = 0;

			var DEFAULT_SPEED = 80;
			var LENGTH = 3; 
			var INITIAL_BURGERS = 3;
			
			var basset; 

			function init(speed) {

				d = "right"; 
				create_basset();
				create_burger();

				update_score(0);

				//Lets move using a timer which will trigger the paint function
				if(typeof game_loop != "undefined") clearInterval(game_loop);
				game_loop = setInterval(paint, speed);
			}

			function create_basset() {
				
				basset = []; //Empty array to start with
				for(var i = LENGTH-1; i>=0; i--) {
					//This will create a horizontal basset starting from the top left
					basset.push({x: i, y:0});
				}
			}

			// Lets create the food now
			function create_burger() {

				food = {
					x: Math.round(Math.random()*(w-cw)/cw), 
					y: Math.round(Math.random()*(h-cw)/cw), 
				};
			}

			function paint_background() {

				ctx.fillStyle = "green";
				ctx.fillRect(0, 0, w, h);
				ctx.strokeStyle = "black";
				ctx.strokeRect(0, 0, w, h);
			}

			function handle_control() {

				// See http://www.javascripter.net/faq/keycodes.htm
				$(document).keydown(function(e) {

					var key = e.which;
					var q_key = "81";
					var a_key = "65";
					var o_key = "79";
					var p_key = "80";
					if(key == q_key && d != "down") d = "up";
					else if(key == a_key && d != "up") d = "down";
					else if(key == o_key && d != "right") d = "left";
					else if(key == p_key && d != "left") d = "right";
				});
			}

			function update_score(value) {
				score += value;
				$("#score").html("Score: " + score);
			}

			//Lets first create a generic function to paint cells
			function paint_cell(x, y, colour) {

				ctx.fillStyle = colour;
				ctx.fillRect(x*cw, y*cw, cw, cw);
				ctx.strokeStyle = "white";
				ctx.strokeRect(x*cw, y*cw, cw, cw);
			}

			function check_collision(x, y, array) {
				
				for(var i = 0; i < array.length; i++)
				{
					if(array[i].x == x && array[i].y == y)
					 return true;
				}
				return false;
			}

			function paint() {

				paint_background();

				// Parts
				var nx = basset[0].x;
				var ny = basset[0].y;

				// Move head forward in the right direction
				if(d == "right") nx++;
				else if(d == "left") nx--;
				else if(d == "up") ny--;
				else if(d == "down") ny++;
				
				if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, basset)) {

					//restart game
					init(DEFAULT_SPEED);
					return;
				}
				
				// eat food
				if(nx == food.x && ny == food.y) {
					var tail = {x: nx, y: ny};
					create_burger();
					update_score(10);
					bark.play();
				}
				else {
					//pops out the last cell
					var tail = basset.pop(); 
					tail.x = nx; 
					tail.y = ny;
				}

				//puts back the tail as the first cell
				basset.unshift(tail); 
				
				for(var i = 0; i < basset.length; i++) {

					var b = basset[i];
					paint_cell(b.x, b.y, "#5F4C0B");
				}

				paint_cell(food.x, food.y, "black");
			}

			handle_control();

			init(DEFAULT_SPEED);
		
		})
window.onload = function () {

	class MakeField {
		constructor(width = 10, height = 10) {
			this.width = width;
			this.height = height;

			const snake = document.getElementById("snake");
			const htmlScore = document.getElementById("total")
			const audio = document.getElementById("audio")
			const fragment = document.createDocumentFragment();

			let gameInProgress = true;
			let appleScore = 0;

			const getRandomInt = (min, max) => {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}


			/*create cell proto*/
			let snakeCell = document.createElement("div");
			snakeCell.style.cssText = "width: " + (100 / width) + "%;" + "height: " + (100 / width) + "%;";
			snakeCell.className = "cell";

			/* add elements to fragment */
			for (let y = 0; y < width; y++) {
				let cNode;
				for (let x = 0; x < height; x++) {
					cNode = snakeCell.cloneNode(false);
					cNode.setAttribute("x", String(x));
					cNode.setAttribute("y", String(y));
					fragment.appendChild(cNode)
				}
			}
			snake.appendChild(fragment); // inject fragment to html

			/*init snake*/
			let coords = {
				direction: "up", // up right down left
				directionCanBeChange: true,
				snake: [{x: 9, y: 8}, {x: 9, y: 9}, {x: 9, y: 10}],
				tail: null,
				apple: {},
			};

			let cells = document.querySelectorAll(".cell");
			cells.forEach = [].forEach;

			let methods = {
				reDrawSnake() {
					cells.forEach(el => {
						el.classList.remove("snake-body");
						el.classList.remove("eyes");
						el.classList.remove("eyes--up");
						el.classList.remove("eyes--right");
						el.classList.remove("eyes--left");
						el.classList.remove("eyes--down");
					})

					if (gameInProgress) {
						coords.snake.forEach(el => {
							document.querySelector(`[x="${el.x}"][y="${el.y}"]`).classList.add("snake-body");
						});
						let snakeHead = document.querySelector(`[x="${coords.snake[0].x}"][y="${coords.snake[0].y}"]`); // draw eyes ^_^
						snakeHead.classList.add("eyes")// draw eyes
						snakeHead.classList.add("eyes--" + coords.direction)// draw eyes
					}
				},
				checkSnakeEatsApple(cObj) {
					if (JSON.stringify(coords.apple) == JSON.stringify(cObj)) {
						coords.snake.push(cObj);
						this.refreshScore();
						this.initNewApple("new");
					}
				},
				initNewApple(){
					coords.apple.x = getRandomInt(1, width - 1)
					coords.apple.y = getRandomInt(1, height - 1)

					// check chtobi ne na zmeyu apple ypal
					for (let i = 0; i < coords.snake.length; i++) {
						if (JSON.stringify(coords.apple) == JSON.stringify(coords.snake[i])) {
							coords.apple = {};
							return this.initNewApple();
						}
					}
					cells.forEach(el => {
						el.classList.remove("apple");
					})
					document.querySelector(`[x="${coords.apple.x}"][y="${coords.apple.y}"]`).classList.add("apple");
				},
				setDirection(dir){
					if (coords.directionCanBeChange) {
						coords.directionCanBeChange = false;
						coords.direction = dir;
					}
				},
				checkSnakeFails(nextStep){
					coords.snake.forEach(el => {
						if (JSON.stringify(el) == JSON.stringify(nextStep)) {
							this.restartQuestion();
							//alert("snake eats herself!");
							return 1;
						}
					});
					if (nextStep.x < 0 || nextStep.x >= width || nextStep.y < 0 || nextStep.y >= height) {
						this.restartQuestion();
						//alert("out of range");
						return 1;
					}
				},
				restartQuestion(){
					clearInterval(gameAnimation);
					let answer = confirm("Play again?");
					if (answer) {
						window.playAgain()
					} else {
						gameInProgress = false;
						document.getElementById("audio").pause();
						alert("Game over");
					}
				},
				refreshScore(){
					appleScore++;
					htmlScore.textContent = appleScore + "";
				}
			};
			methods.reDrawSnake();
			methods.initNewApple();

			/*animate*/
			let gameAnimation = setInterval(function () {
				coords["tail"] = coords.snake.pop();
				let nextSnakeStep = Object.assign({}, coords.snake[0])

				switch (coords.direction) {
					case "up":
						nextSnakeStep.y = nextSnakeStep.y - 1;
						break;
					case "right":
						nextSnakeStep.x = nextSnakeStep.x + 1;
						break;
					case "down":
						nextSnakeStep.y = nextSnakeStep.y + 1;
						break;
					case "left":
						nextSnakeStep.x = nextSnakeStep.x - 1;
						break;
				}
				methods.checkSnakeFails(nextSnakeStep);
				methods.checkSnakeEatsApple(nextSnakeStep);
				coords.snake.unshift(nextSnakeStep);
				methods.reDrawSnake();
				coords.directionCanBeChange = true; // unlock change direction
			}, 200);

			Mousetrap.bind(["w", "ц"], function () {
				if (coords.direction != "down") methods.setDirection("up")
			});
			Mousetrap.bind(["d", "в"], function () {
				if (coords.direction != "left") methods.setDirection("right")
			});
			Mousetrap.bind(["s", "ы"], function () {
				if (coords.direction != "up") methods.setDirection("down")
			});
			Mousetrap.bind(["a", "ф"], function () {
				if (coords.direction != "right") methods.setDirection("left")
			});


		}
	}

	let myField = new MakeField(20, 20);



	const pauseMusicBtn = document.getElementById("pause-music");
	pauseMusicBtn.addEventListener("click", function() {
		if (audio.paused) {
			audio.play();
			//console.log(`blah`)
		} else {
			audio.pause();
		}
	});

	window.playAgain = function () {
		let snake = document.getElementById("snake");
		snake.innerHTML = "";
		let myField = new MakeField(20, 20);
	};

};








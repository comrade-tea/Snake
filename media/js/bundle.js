"use strict";

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports) {

	"use strict";

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	window.onload = function () {
		var MakeField = function MakeField() {
			var width = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];
			var height = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

			_classCallCheck(this, MakeField);

			this.width = width;
			this.height = height;

			var snake = document.getElementById("snake");
			var htmlScore = document.getElementById("total");
			var audio = document.getElementById("audio");
			var fragment = document.createDocumentFragment();

			var gameInProgress = true;
			var appleScore = 0;

			var getRandomInt = function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};

			/*create cell proto*/
			var snakeCell = document.createElement("div");
			snakeCell.style.cssText = "width: " + 100 / width + "%;" + "height: " + 100 / width + "%;";
			snakeCell.className = "cell";

			/* add elements to fragment */
			for (var y = 0; y < width; y++) {
				var cNode = void 0;
				for (var x = 0; x < height; x++) {
					cNode = snakeCell.cloneNode(false);
					cNode.setAttribute("x", String(x));
					cNode.setAttribute("y", String(y));
					fragment.appendChild(cNode);
				}
			}
			snake.appendChild(fragment); // inject fragment to html

			/*init snake*/
			var coords = {
				direction: "up", // up right down left
				directionCanBeChange: true,
				snake: [{ x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }],
				tail: null,
				apple: {}
			};

			var cells = document.querySelectorAll(".cell");
			cells.forEach = [].forEach;

			var methods = {
				reDrawSnake: function reDrawSnake() {
					cells.forEach(function (el) {
						el.classList.remove("snake-body");
						el.classList.remove("eyes");
						el.classList.remove("eyes--up");
						el.classList.remove("eyes--right");
						el.classList.remove("eyes--left");
						el.classList.remove("eyes--down");
					});

					if (gameInProgress) {
						coords.snake.forEach(function (el) {
							document.querySelector("[x=\"" + el.x + "\"][y=\"" + el.y + "\"]").classList.add("snake-body");
						});
						var snakeHead = document.querySelector("[x=\"" + coords.snake[0].x + "\"][y=\"" + coords.snake[0].y + "\"]"); // draw eyes ^_^
						snakeHead.classList.add("eyes"); // draw eyes
						snakeHead.classList.add("eyes--" + coords.direction); // draw eyes
					}
				},
				checkSnakeEatsApple: function checkSnakeEatsApple(cObj) {
					if (JSON.stringify(coords.apple) == JSON.stringify(cObj)) {
						coords.snake.push(cObj);
						this.refreshScore();
						this.initNewApple("new");
					}
				},
				initNewApple: function initNewApple() {
					coords.apple.x = getRandomInt(1, width - 1);
					coords.apple.y = getRandomInt(1, height - 1);

					// check chtobi ne na zmeyu apple ypal
					for (var i = 0; i < coords.snake.length; i++) {
						if (JSON.stringify(coords.apple) == JSON.stringify(coords.snake[i])) {
							coords.apple = {};
							return this.initNewApple();
						}
					}
					cells.forEach(function (el) {
						el.classList.remove("apple");
					});
					document.querySelector("[x=\"" + coords.apple.x + "\"][y=\"" + coords.apple.y + "\"]").classList.add("apple");
				},
				setDirection: function setDirection(dir) {
					if (coords.directionCanBeChange) {
						coords.directionCanBeChange = false;
						coords.direction = dir;
					}
				},
				checkSnakeFails: function checkSnakeFails(nextStep) {
					var _this = this;

					coords.snake.forEach(function (el) {
						if (JSON.stringify(el) == JSON.stringify(nextStep)) {
							_this.restartQuestion();
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
				restartQuestion: function restartQuestion() {
					clearInterval(gameAnimation);
					var answer = confirm("Play again?");
					if (answer) {
						window.playAgain();
					} else {
						gameInProgress = false;
						document.getElementById("audio").pause();
						alert("Game over");
					}
				},
				refreshScore: function refreshScore() {
					appleScore++;
					htmlScore.textContent = appleScore + "";
				}
			};
			methods.reDrawSnake();
			methods.initNewApple();

			/*animate*/
			var gameAnimation = setInterval(function () {
				coords["tail"] = coords.snake.pop();
				var nextSnakeStep = Object.assign({}, coords.snake[0]);

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
				if (coords.direction != "down") methods.setDirection("up");
			});
			Mousetrap.bind(["d", "в"], function () {
				if (coords.direction != "left") methods.setDirection("right");
			});
			Mousetrap.bind(["s", "ы"], function () {
				if (coords.direction != "up") methods.setDirection("down");
			});
			Mousetrap.bind(["a", "ф"], function () {
				if (coords.direction != "right") methods.setDirection("left");
			});
		};

		var myField = new MakeField(20, 20);

		var pauseMusicBtn = document.getElementById("pause-music");
		pauseMusicBtn.addEventListener("click", function () {
			if (audio.paused) {
				audio.play();
				//console.log(`blah`)
			} else {
					audio.pause();
				}
		});

		window.playAgain = function () {
			var snake = document.getElementById("snake");
			snake.innerHTML = "";
			var myField = new MakeField(20, 20);
		};
	};

	/***/
}
/******/]);
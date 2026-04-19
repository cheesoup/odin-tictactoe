function tictactoe() {
	// gameStatus codes
	// -1 = uninitialized, 0 = p0's turn, 1 = p1's turn, 10 = p0 win, 11 = p1 win, 12 = draw
	let gameStatus = -1;
	const gameboard = (() => {
		let grid;
		let round;
		const getGrid = () => { return grid; }
		const getRound = () => { return round; }
		const getCell = (x, y) => { return y === undefined ? grid[x] : grid[y * 3 + x]; }
		
		const mark = (player, x, y) => {
			grid[y * 3 + x] = player;
			round++;
		}

		const reset = () => {
			 grid = [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined,
			];
			round = 0;
		}

		reset();
		return { getCell, getGrid, getRound, mark, reset };
	})();

	const init = () => {
		// initialize gameboard and randomize starting player
		gameboard.reset();
		gameStatus = Math.floor(Math.random() * 2);
		return gameStatus;
	}

	const play = (x, y) => {
		// check if game is in session and chosen cell is valid and undefined
		if ((gameStatus === 0 || gameStatus === 1) && gameboard.getCell(x, y) === undefined && (y * 3 + x) < 9) {
			gameboard.mark(gameStatus, x, y);
			printPlay(x, y);
			printGrid();

			// check win conditions
			// https://stackoverflow.com/a/1056352
			gameStatus = (() => {
				// check col
				for (let i = 0; i < 3; i++) {
					if (gameboard.getCell(x, i) != gameStatus) break;
					if (i === 2) return gameStatus + 10;
				}

				// check rows
				for (let i = 0; i < 3; i++) {
					if (gameboard.getCell(i, y) != gameStatus) break;
					if (i === 2) return gameStatus + 10;
				}

				// check diag
				if (x === y) {
					for (let i = 0; i < 3; i++) {
						if (gameboard.getCell(i, i) != gameStatus) break;
						if (i === 2) return gameStatus + 10;
					}
				}

				// check other diag
				if (x + y == 2) {
					for (let i = 0; i < 3; i++) {
						if (gameboard.getCell(i, 2 - i) != gameStatus) break;
						if (i === 2) return gameStatus = 10;
					}
				}
				
				if (gameboard.getRound() >= 9) return 12;
				else return (gameStatus + 1) % 2;
			})();
			printStatus();	
		}
		return gameStatus;
	}

	const getStatus = () => { return gameStatus; }
	const getCell = (x, y) => { return gameboard.getCell(x, y); }

	const printPlay = (x, y) => {
		console.log(`Player ${gameStatus} marks (${x}, ${y})`);
	}

	const printGrid = () => {
		let log = `Round ${gameboard.getRound()}\n`;
		for (let i = 0; i < gameboard.getGrid().length; i++) {
			if (i !== 0 && i % 3 === 0) log += "\n"
			log += gameboard.getGrid()[i] === undefined ? `[${i}: -] ` : `[${i}: ${gameboard.getCell(i)}] `;
		}
		console.log(log);
	}

	const printStatus = () => {
		// Game Status messages
		switch(gameStatus) {
			case -1:
				console.log("Initialize me!!");
				break;
			case 10:
			case 11:
				console.log(`Player ${gameStatus - 10} wins!`);
				break;
			case 12:
				console.log("It's a draw...");
				break;
			default:
				console.log(`Player ${gameStatus}'s turn`);
				break;
		}
	}

	return { init, play, getStatus, getCell }
}

function gui(game) {
	const gameDiv = document.getElementById("game");
	const cells = gameDiv.querySelectorAll("svg");
	const update = () => {
		gameDiv.setAttribute("data-game-status", game.getStatus());
		for (let i = 0; i < cells.length; i++) 	cells[i].setAttribute("data-mark", game.getCell(i));
	}
	
	document.getElementById("game").setAttribute("data-game-status", game.getStatus());
	return { update };
}



const game = tictactoe();
game.init();
const ui = gui(game);


for (let cell of document.querySelectorAll("div#game svg")) {
	cell.addEventListener("click", () => {
		let x = parseInt(cell.getAttribute("data-x"));
		let y = parseInt(cell.getAttribute("data-y"));
		game.play(x, y);
		ui.update();
	})
}

function tictactoe() {
	// gameStatus codes
	// -1 = unnewGameialized, 0 = p0's turn, 1 = p1's turn, 10 = p0 win, 11 = p1 win, 12 = draw
	let gameStatus = -1;
	let score = [0, 0];

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

		const clear = () => {
			 grid = [
				undefined, undefined, undefined,
				undefined, undefined, undefined,
				undefined, undefined, undefined,
			];
			round = 0;
		}

		clear();
		return { getCell, getGrid, getRound, mark, clear };
	})();

	const reset = () => {
		gameStatus = -1;
		score = [0, 0];
		newGame();
	}

	const newGame = () => {
		// newGameialize gameboard and randomize starting player
		gameboard.clear();
		gameStatus = gameStatus === -1 ? Math.floor(Math.random() * 2) : (gameStatus + 9) % 2;
		return gameStatus;
	}

	const play = (x, y) => {
		// check if game is in session and chosen cell is valid and undefined
		if ((gameStatus === 0 || gameStatus === 1) && gameboard.getCell(x, y) === undefined && (y * 3 + x) < 9) {
			gameboard.mark(gameStatus, x, y);
			// printPlay(x, y);
			// printGrid();

			// check win conditions
			// https://stackoverflow.com/a/1056352
			gameStatus = (() => {
				// check col
				for (let i = 0; i < 3; i++) {
					if (gameboard.getCell(x, i) != gameStatus) break;
					if (i === 2) {
						score[gameStatus]++;
						return gameStatus + 10;
					}
				}

				// check rows
				for (let i = 0; i < 3; i++) {
					if (gameboard.getCell(i, y) != gameStatus) break;
					if (i === 2) {
						score[gameStatus]++;
						return gameStatus + 10;
					}
				}

				// check diag
				if (x === y) {
					for (let i = 0; i < 3; i++) {
						if (gameboard.getCell(i, i) != gameStatus) break;
						if (i === 2) {
							score[gameStatus]++;
							return gameStatus + 10;
						}
					}
				}

				// check other diag
				if (x + y == 2) {
					for (let i = 0; i < 3; i++) {
						if (gameboard.getCell(i, 2 - i) != gameStatus) break;
						if (i === 2) {
							score[gameStatus]++;
							return gameStatus = 10;
						}
					}
				}
				
				if (gameboard.getRound() >= 9) return 12;
				else return (gameStatus + 1) % 2;
			})();
			// printStatus();	
		}
		return gameStatus;
	}

	const getStatus = () => { return gameStatus; }
	const getScore = (p) => { return score[p]; }
	const getCell = (x, y) => { return gameboard.getCell(x, y); }
	/*
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
	*/
	newGame();
	return { reset, newGame, play, getScore, getStatus, getCell }
}

function gui(game) {
	const grid = document.querySelector("div.grid");
	const cells = grid.querySelectorAll("svg");
	const turns = document.querySelectorAll("svg.turn-marker");
	const scores = document.querySelectorAll("p.wins");
	const names = document.querySelectorAll("p.name");
	const msg = document.querySelector("div.msg");

	const setName = (player, name) => {
		names[player].textContent = name;
	}

	const update = () => {
		const gameStatus = game.getStatus();
		const message = document.createElement("span");
		grid.setAttribute("data-game-status", game.getStatus());
		msg.innerHTML = "";

		switch(gameStatus) {
			case 0:
			case 1:
				message.textContent = `${names[gameStatus].textContent}'s turn.`;
				break;
			case 10:
			case 11:
				message.textContent = `${names[gameStatus - 10].textContent} wins! Click to continue.`;
				break;
			case 12:
				message.textContent = `It's a draw. Click to continue.`;
				break;

		}
		msg.append(message);

		for (let i = 0; i < cells.length; i++)
			cells[i].setAttribute("data-mark", game.getCell(i));
		for (let i = 0; i < turns.length; i++)
			turns[i].setAttribute("data-your-turn", gameStatus === i);
		for (let i = 0; i < scores.length; i++)
			scores[i].textContent = game.getScore(i);
	}
	
	update();
	return { setName, update };
}

const game = tictactoe();
const ui = gui(game);

for (let cell of document.querySelectorAll("div svg")) {
	cell.addEventListener("click", () => {
		if (game.getStatus() < 10) {
			let x = parseInt(cell.getAttribute("data-x"));
			let y = parseInt(cell.getAttribute("data-y"));
			game.play(x, y);
		}
		else game.newGame();
		ui.update();
	})
}

document.querySelector("form").addEventListener("submit", (e) => {
	e.preventDefault();
	const data = new FormData(e.target);

	ui.setName(0, data.get("p0"));
	ui.setName(1, data.get("p1"));
});

document.querySelector("button.reset").addEventListener("click", (e) => {
	game.reset();
	ui.update();
});

function tictactoe() {
	// gameStatus codes
	// -1 = uninitialized, 0 = p0's turn, 1 = p1's turn, 10 = p0 win, 11 = p1 win, 12 = draw
	let gameStatus = -1;
	const players = [];
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
		if ((gameStatus === 0 || gameStatus === 1) && gameboard.getCell(x, y) === undefined && (y * 3 + x) < 9) {
			const winningCombos = [ 
				[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
				[0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
				[0, 4, 8], [2, 4, 6] // diags
			];
			
			gameboard.mark(gameStatus, x, y);
			printPlay(x, y);
			printGrid();

			for (let combo of winningCombos) {
				let total = 0;
				for (let cell of combo) total += gameboard.getCell(cell) === gameStatus;
				if (total === 3) {
					gameStatus += 10;
					break;
				}
			}

			if (gameStatus < 10 && gameboard.getRound() >= 9) gameStatus = 12;
			else if (gameStatus === 0 || gameStatus === 1) gameStatus = (gameStatus + 1) % 2;
			printStatus();	
		}
		return gameStatus;
	}

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

	return { init, play }
}

const game = tictactoe();
game.init("chiisu", "gweelee");

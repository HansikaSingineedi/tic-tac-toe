let cells = document.querySelectorAll(".cell");
let currentPlayer = "X";
let gameOver = false;

let gameMode = "pvp";
let difficulty = "easy";

let statusText = document.getElementById("status");
let restartBtn = document.getElementById("restart");
let scoreBoard = document.getElementById("score");
let difficultyBox = document.getElementById("difficulty");

let xScore = 0;
let oScore = 0;

let winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Mode selection
function setMode(mode, btn) {
    gameMode = mode;

    // highlight selected mode
    let buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (mode === "ai") {
        difficultyBox.style.display = "block";
    } else {
        difficultyBox.style.display = "none";
    }

    restartGame();
}

// 🔥 Difficulty with active highlight
function setDifficulty(level, btn) {
    difficulty = level;

    let buttons = document.querySelectorAll(".diff-btn");
    buttons.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
}

// Click logic
cells.forEach(cell => {
    cell.addEventListener("click", () => {

        if (cell.textContent === "" && !gameOver) {

            if (gameMode === "pvp") {

                cell.textContent = currentPlayer;
                checkWinner();

                currentPlayer = (currentPlayer === "X") ? "O" : "X";

            } else {

                cell.textContent = "X";
                checkWinner();

                if (!gameOver) {
                    setTimeout(() => {
                        computerMove();
                    }, 500);
                }
            }
        }
    });
});

// AI controller
function computerMove() {

    if (difficulty === "easy") {
        randomMove();
    }
    else if (difficulty === "medium") {
        if (!blockMove()) randomMove();
    }
    else if (difficulty === "hard") {
        if (!winMove()) {
            if (!blockMove()) randomMove();
        }
    }

    checkWinner();
}

// Random move
function randomMove() {
    let empty = [];

    cells.forEach((cell, i) => {
        if (cell.textContent === "") empty.push(i);
    });

    let index = empty[Math.floor(Math.random() * empty.length)];
    cells[index].textContent = "O";
}

// Block player
function blockMove() {
    for (let p of winPatterns) {
        let [a,b,c] = p;

        if (cells[a].textContent==="X" && cells[b].textContent==="X" && cells[c].textContent==="") {
            cells[c].textContent="O"; return true;
        }
        if (cells[a].textContent==="X" && cells[b].textContent==="" && cells[c].textContent==="X") {
            cells[b].textContent="O"; return true;
        }
        if (cells[a].textContent==="" && cells[b].textContent==="X" && cells[c].textContent==="X") {
            cells[a].textContent="O"; return true;
        }
    }
    return false;
}

// Win move
function winMove() {
    for (let p of winPatterns) {
        let [a,b,c] = p;

        if (cells[a].textContent==="O" && cells[b].textContent==="O" && cells[c].textContent==="") {
            cells[c].textContent="O"; return true;
        }
        if (cells[a].textContent==="O" && cells[b].textContent==="" && cells[c].textContent==="O") {
            cells[b].textContent="O"; return true;
        }
        if (cells[a].textContent==="" && cells[b].textContent==="O" && cells[c].textContent==="O") {
            cells[a].textContent="O"; return true;
        }
    }
    return false;
}

// Winner / draw
function checkWinner() {
    for (let p of winPatterns) {
        let [a,b,c] = p;

        let A = cells[a].textContent;
        let B = cells[b].textContent;
        let C = cells[c].textContent;

        if (A !== "" && A === B && B === C) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            if (A === "X") xScore++;
            else oScore++;

            scoreBoard.textContent = `X: ${xScore} | O: ${oScore}`;
            statusText.textContent = A + " Wins!";

            gameOver = true;
            return;
        }
    }

    let filled = [...cells].filter(c => c.textContent !== "").length;

    if (filled === 9) {
        statusText.textContent = "It's a Draw!";
        gameOver = true;
    }
}

// Restart
function restartGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });

    currentPlayer = "X";
    gameOver = false;
    statusText.textContent = "";
}

restartBtn.addEventListener("click", restartGame);
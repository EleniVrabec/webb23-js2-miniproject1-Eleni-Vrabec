import { getHighscoreList, addNewPlayer, } from "./modules/databaseinteractions.js";
let playerName;
let playerScore = 0;
// variables to keep track of the points
let pointsPlayer = 0;
let pointsComputer = 0;

/* select buttons from html by id */
const rockBtn = document.querySelector("#rock");
const paperBtn = document.querySelector("#paper");
const scissorsBtn = document.querySelector("#scissors");


async function updateHighscoreTable() {
   await getHighscoreList()
      .then((highscores) => {
        displayHighscore(highscores);
      })
      .catch((error) => {
        console.error('Error fetching highscores:', error);
      });
  }
updateHighscoreTable();

  
function displayHighscore(highscores){
  console.log(highscores);
  const highscoreTable = document.getElementById('highscoreTable');
  highscoreTable.innerHTML = '';
    highscores.forEach(player => {
      
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const scoreCell = document.createElement('td');
      nameCell.style.padding = "10px" 
      scoreCell.style.padding = "10px";
      
      
      nameCell.textContent = player.name;
      scoreCell.textContent = player.score;
      
      row.appendChild(nameCell);
      row.appendChild(scoreCell);

      highscoreTable.appendChild(row);
})
}
/* select the containers for the choosen img */
const imgContainerPl1 = document.querySelector("#pick-1");
const imgContainerPl2 = document.querySelector("#pick-2");
/* input fields for adding a name */
const textInput = document.querySelector("#player-one-input");
const textInputC = document.querySelector("#player-two-input");

async function saveName(event) {
    event.preventDefault();
    
    playerScore = 0
    const h1Pl = document.querySelector("#player-name");
    const h1Comp = document.querySelector("#computer-name");
    playerName = textInput.value;
    const computerName = textInputC.value
    h1Pl.innerText = playerName; // Display the player's name
    h1Comp.innerText = computerName;
    textInput.value = ""; // Clear the input field
    textInputC.value = "";
    const highscoreList = await getHighscoreList();
    addNewPlayer({ name: playerName, score: playerScore });

  }
//Event listener for the input name
const form = document.querySelector("form");
form.addEventListener("submit", saveName);

/* select all btn from player container */
const choiceBtn = document.querySelectorAll("#image-container-pl-1 button"); // i set this to the div which holds the buttons for player 1 so only the buttons in this div will be clickable
// it will only loop the buttons of the player not computer
/* select the play btn and addEventListener */
const playBtn = document.querySelector("#play");
const numToStart = document.querySelector("#countStart");
playBtn.addEventListener("click", startCountDown);

/* set timing events  */
let countDownInterval;
let numCountReverce = 3;

function startCountDown() {
  numToStart.style.display = "block";
  playBtn.style.display = "block";

  numCountReverce = 3;
  numToStart.innerText = numCountReverce;
  countDownInterval = setInterval(() => {
    numCountReverce--;
    if (numCountReverce > 0) {
      numToStart.innerText = numCountReverce;
    } else {
      numToStart.innerText = "GO!";
      clearInterval(countDownInterval);

      setTimeout(() => {
        playBtn.innerText = "Play Again";
        playBtn.style.display = "block";
        playGame();
        reStartGame();
      }, 1000);
    }
  }, 1000);
}

// loop to iterate over each button and add a event listener to each btn to be clickable
for (let i = 0; i < choiceBtn.length; i++) {
  const button = choiceBtn[i];
  button.addEventListener("click", function (event) {
    const btnId = event.target.id;
    let playerChoice;
    /* set the btnId to playerChoice */
    if (btnId === "rock") {
      playerChoice = "rock";
    } else if (btnId === "paper") {
      playerChoice = "paper";
    } else if (btnId === "scissors") {
      playerChoice = "scissors";
    }

    playGame(playerChoice); // call the function with the playerChoice value as argument sent to the paramether in the other function so it can be used also in PlayGame func
  });
}

function playGame(playerChoice) {
  const choices = ["rock", "paper", "scissors"];
  const computerChoiceIndex = Math.floor(Math.random() * choices.length); 
  const computerChoice = choices[computerChoiceIndex];
  
  if (playerChoice === "rock") {
    const imgRock = new URL(`./img/rock.png`, import.meta.url);
    createAndDisplayImage(imgRock.href, 'pick-1');
  } else if (playerChoice === "paper") {
    const imgPaper = new URL(`./img/paper.png`, import.meta.url);
    createAndDisplayImage(imgPaper.href, 'pick-1');
  } else if (playerChoice === "scissors") {
    const imgScissors = new URL(`./img/scissors.png`, import.meta.url);
    createAndDisplayImage(imgScissors.href, 'pick-1');
  }

  
  if (computerChoice === "rock") {
    const imgRock = new URL(`./img/rock.png`, import.meta.url);
    createAndDisplayImage(imgRock.href, 'pick-2');
  } else if (computerChoice === "paper") {
    const imgPaper = new URL(`./img/paper.png`, import.meta.url);
    createAndDisplayImage(imgPaper.href, 'pick-2');
  } else if (computerChoice === "scissors") {
    const imgScissors = new URL(`./img/scissors.png`, import.meta.url);
    createAndDisplayImage(imgScissors.href, 'pick-2');
  }

  function createAndDisplayImage(src, containerId) {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '200px';
    img.style.height = '200px';
  
    const container = document.getElementById(containerId);
    container.innerHTML = ''; 
    container.appendChild(img); 
  }

  playBtn.innerText = "Play again";

  let winner;

  if (playerChoice === computerChoice) {
    winner = "No winner, try again!";
  } else if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "rock")
  ) {
    winner = "player";
    pointsPlayer++;
    
  } else {
    winner = "computer";
    console.log('Before updating score:', pointsPlayer);
    const updatedPlayer = { name: playerName, score: parseInt(pointsPlayer, 10) };
    addNewPlayer(updatedPlayer);
    
    const popup = document.querySelector("#pop-up");
      popup.addEventListener("click", function () {
        winMess.remove();
      });
      const winMess = document.querySelector("#winner-is");
      winMess.innerText = "Computer wins!";

      setTimeout(function () {
        updateHighscoreTable();
        reStartGame(); 
      }, 2000);
  }
  document.getElementById("points").innerText = pointsPlayer;
  document.getElementById("points2").innerText = pointsComputer;
}

function reStartGame() {
  imgContainerPl1.style.backgroundColor = "";
  imgContainerPl2.style.backgroundColor = "";
  numCountReverce = 3;
  numToStart.innerText = " ";
  pointsPlayer = 0;
  pointsComputer = 0;
  document.getElementById("points").innerText = pointsPlayer;
  document.getElementById("points2").innerText = pointsComputer;
  imgContainerPl1.innerHTML = " ";
  imgContainerPl2.innerHTML = " ";
  document.getElementById("winner-is").innerText = "";
  playBtn.innerText = "START";

  clearInterval(countDownInterval);
}


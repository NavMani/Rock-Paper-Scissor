let userscore = 0;
let computerscore = 0;

const choices = document.querySelectorAll('.choice');
const msg = document.querySelector("#msg");
const userScore_span = document.querySelector("#user-score");
const compScore_span = document.querySelector("#computer-score");
const compDisplay = document.querySelector("#computer-display");
const compImg = document.querySelector("#computer-img");

// Combat elements
const combatArea = document.getElementById("combat-area");
const userCombatImg = document.getElementById("user-combat-img");
const cpuCombatImg = document.getElementById("cpu-combat-img");
const userCombatant = document.getElementById("user-combatant");
const cpuCombatant = document.getElementById("cpu-combatant");
const clashSpark = document.getElementById("clash-spark");
const userSide = document.querySelector(".user-side");
const compSide = document.querySelector(".computer-side");

const imagePaths = {
    rock: "images/rock.png",
    paper: "images/paper.png",
    scissors: "images/scissors.png"
};
const optionsArray = ["rock", "paper", "scissors"];

// Retrieve scores from local storage
if (localStorage.getItem('userScore')) {
    userscore = parseInt(localStorage.getItem('userScore'));
    userScore_span.innerText = userscore;
}
if (localStorage.getItem('computerScore')) {
    computerscore = parseInt(localStorage.getItem('computerScore'));
    compScore_span.innerText = computerscore;
}

const genCompChoice = () => {
    return optionsArray[Math.floor(Math.random() * 3)];
};

const animateScore = (element) => {
    element.classList.add('score-animate');
    setTimeout(() => element.classList.remove('score-animate'), 300);
};

const triggerCombatSequence = (userchoice, compchoice, userwin) => {
    // 1. Prepare combatants
    userCombatImg.src = imagePaths[userchoice];
    cpuCombatImg.src = imagePaths[compchoice];

    // Reset classes
    userCombatant.className = "combatant";
    cpuCombatant.className = "combatant";
    clashSpark.className = "";

    // Dim the background arena components
    userSide.style.opacity = '0.2';
    compSide.style.opacity = '0.2';

    // Activate central combat area
    combatArea.classList.add('active');

    // 2. Start Clash animation
    setTimeout(() => {
        userCombatant.classList.add('clash-left');
        cpuCombatant.classList.add('clash-right');
    }, 100);

    // 3. The Impact
    setTimeout(() => {
        clashSpark.classList.add("spark-active");
    }, 500); // Wait for them to slide to center

    // 4. Resolve the fight
    setTimeout(() => {
        // Freeze them at center before reacting
        userCombatant.classList.remove('clash-left');
        cpuCombatant.classList.remove('clash-right');

        if (userwin === true) {
            userCombatant.classList.add("combat-winner");
            cpuCombatant.classList.add("combat-loser");
        } else if (userwin === false) {
            userCombatant.classList.add("combat-loser");
            cpuCombatant.classList.add("combat-winner");
        } else {
            userCombatant.classList.add("combat-draw-bump");
            cpuCombatant.classList.add("combat-draw-bump");
        }

    }, 600); // Right as/after the spark hits

    // 5. Cleanup and apply scores
    setTimeout(() => {
        // Hide combat area
        combatArea.classList.remove('active');
        userSide.style.opacity = '1';
        compSide.style.opacity = '1';

        // Remove highlighting from choices
        choices.forEach(c => {
            c.classList.remove('choice-animate');
            c.classList.remove('gesture-playing');
        });
        compDisplay.classList.remove('slot-machine-locked');

        // Apply final result text and score
        if (userwin === true) {
            userscore++;
            localStorage.setItem('userScore', userscore);
            userScore_span.innerText = userscore;
            animateScore(userScore_span);

            msg.innerText = `You win! ${userchoice} beats ${compchoice}`;
            msg.className = "msg-win";

            if (userscore > 0 && userscore % 5 === 0) confetti({ particleCount: 1000, spread: 360, origin: { y: 0.5 }, colors: ['#00ffcc', '#ffffff', '#ff3366'] });
            else confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#00ffcc', '#ffffff'] });

        } else if (userwin === false) {
            computerscore++;
            localStorage.setItem('computerScore', computerscore);
            compScore_span.innerText = computerscore;
            animateScore(compScore_span);

            msg.innerText = `You Lose... ${compchoice} beats ${userchoice}`;
            msg.className = "msg-lose";
        } else {
            msg.innerText = "Game Draw! A fierce battle!";
            msg.className = "msg-draw";
        }

        // Allow next play
        document.body.style.pointerEvents = 'auto';

    }, 2500); // Give the winning/losing animations time to finish
};

const resolvesGame = (userchoice, compchoice) => {
    // Lock computer slot machine purely visually
    compImg.src = imagePaths[compchoice];
    compImg.style.opacity = "1";
    compImg.style.filter = "none";
    compImg.classList.remove('fast-blur');
    compDisplay.classList.remove('slot-machine-active');
    compDisplay.classList.add('slot-machine-locked');

    // Evaluate rules
    let userwin = null; // null represents draw
    if (userchoice !== compchoice) {
        if (userchoice === "rock") userwin = compchoice === "paper" ? false : true;
        else if (userchoice === "paper") userwin = compchoice === "scissors" ? false : true;
        else userwin = compchoice === "rock" ? false : true;
    }

    // Trigger the central fighting animation!
    triggerCombatSequence(userchoice, compchoice, userwin);
};

const playgame = (userchoice) => {
    document.body.style.pointerEvents = 'none';

    // Clear previous msg states
    msg.className = "msg-choosing";
    msg.innerText = "Ready... FIGHT!";

    // Highlight the user's choice
    const userElement = document.getElementById(userchoice);
    userElement.classList.add('choice-animate');
    userElement.classList.add('gesture-playing');

    // Computer spin
    compDisplay.classList.add('slot-machine-active');
    compImg.style.opacity = "1";
    compImg.style.filter = "none";
    compImg.classList.add('fast-blur');

    let cycleIndex = 0;
    const slotInterval = setInterval(() => {
        compImg.src = imagePaths[optionsArray[cycleIndex]];
        cycleIndex = (cycleIndex + 1) % optionsArray.length;
    }, 80);

    // Stop after suspense delay and jump to combat
    setTimeout(() => {
        clearInterval(slotInterval);
        const compchoice = genCompChoice();
        resolvesGame(userchoice, compchoice);
    }, 1500);
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        playgame(choice.getAttribute("id"));
    });
});
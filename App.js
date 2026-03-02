let userscore = 0;
let computerscore = 0;

const choices = document.querySelectorAll('.choice');
const msg = document.querySelector("#msg");
const Body = document.querySelector(".container");
const userScore_span = document.querySelector("#user-score");
const compScore_span = document.querySelector("#computer-score");

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randomIdx = Math.floor(Math.random() * 3);
    return options[randomIdx];
};

const drawgame = () =>{
    console.log("draw game")
    msg.innerText = "Game Draw. Play Again.";
        msg.style.backgroundColor = "black";
};

const showwinner = (userwin, userchoice, compchoice) =>{
    if(userwin){
        userscore++;
        userScore_span.innerText = userscore;
        msg.innerText = `You win! ${userchoice} beats ${compchoice}`;
        msg.style.backgroundColor = "green";
         confetti({
    particleCount: 550,
    spread: 200,
    origin: { y: 0.6 }
});
        
    }
    
    else {
            computerscore++;
        compScore_span.innerText = computerscore;
        msg.innerText = `You Lose! ${compchoice} beats ${userchoice}`;
        msg.style.backgroundColor = "red";
    }
};

const playgame = (userchoice) => {
    console.log("User choice", userchoice);
    const compchoice = genCompChoice();
    console.log("comp choice", compchoice);


    if(userchoice === compchoice)
    {
        drawgame();

    }
    else {
        let userwin = true;
        if(userchoice === "rock") {
        userwin = compchoice === "paper" ? false : true;
        }
        else if(userchoice === "paper") {
        userwin = compchoice === "scissors" ? false : true;
        }
        else {
        userwin = compchoice === "rock" ? false : true;
        }

        showwinner(userwin, userchoice, compchoice);
    }
};





choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userchoice = choice.getAttribute("id");
        playgame(userchoice);
        
    });
} );
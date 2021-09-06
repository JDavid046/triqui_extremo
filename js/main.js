// Constantes
const STATUS_DISPLAY = document.querySelector(".game-notification"),
    GAME_STATE = ['', '', '', '', ''
                , '', '', '', '', ''
                , '', '', '', '', ''
                , '', '', '', '', ''
                , '', '', '', '', ''],
    WINNINGS = [
        [0,1,2,3],
        [1,2,3,4],
        [5,6,7,8],
        [6,7,8,9],
        [10,11,12,13],
        [11,12,13,14],
        [15,16,17,18],
        [16,17,18,19],
        [20,21,22,23],
        [21,22,23,24],
        [0,5,10,15],
        [5,10,15,20],
        [1,6,11,16],
        [6,11,16,21],
        [2,7,12,17],
        [7,12,17,22],
        [3,8,13,18],
        [8,13,18,23],
        [4,9,14,19],
        [9,14,19,24],
        [3,7,11,15],
        [4,8,12,16],
        [8,12,16,20],
        [9,13,17,21],
        [1,7,13,19],
        [0,6,12,18],
        [6,12,18,24],
        [5,11,17,23]
    ],
    DISABLE_CELLS = {
        0: [0,1,2,3,4,5,10,15,20],
        1: [1,5,6,7,8,9,11,16,21],
        2: [2,7,10,11,12,13,14,17,22],
        3: [3,8,13,15,16,17,18,19,23],
        4: [4,9,14,19,20,21,22,23,24]
    },
    WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
    DRAW_MESSAGE = () => `El juego ha terminado en empate!`,
    CURRENT_PLAYER_TURN = () => `Turno del jugador ${currentPlayer}`,
    SYMBOLS = ['O','X','▲','☯'];
    PLAYERS = [];


// Variables
let gameActive = true,
currentPlayer = ''

// Funciones

function main(){
    window.addEventListener('load', () => {
        const params = (new URL(document.location)).searchParams;
        const number = params.get('number_players');
        
        for(let i=0; i<number;i++){
            PLAYERS.push(SYMBOLS[i]);
        }        
        currentPlayer = PLAYERS[Math.floor(Math.random() * (PLAYERS.length - 0) + 0)]
        handleStatusDisplay(CURRENT_PLAYER_TURN())
    })

    Swal.fire("Para comenzar, dale al botón 'Lanza el dado'. Luego coloca tu jugada en la fila o columna que tocó respecto al número aleatorio.");
    

    handleStatusDisplay(CURRENT_PLAYER_TURN())
    listeners()    
    document.querySelectorAll(".game-cell").forEach(cell => cell.className = "disabledbutton");
}   

function handleStatusDisplay(message){
    STATUS_DISPLAY.innerHTML = message;
}

function listeners(){
    document.querySelector(".game-container").addEventListener('click', handleCellClick);
    document.querySelector(".game-restart").addEventListener('click', handleRestartGame);
    document.querySelector(".game-lucky-btn").addEventListener('click', handleThrowADice);
}

function handleThrowADice(){
    let column = Math.floor(Math.random() * (5 - 0) + 0);
    document.querySelector(".lucky-number").innerText = column+1;   

    let enabled_cells = DISABLE_CELLS[column];
    let vacias = 0;

    try{
        for(let i = 0; i<GAME_STATE.length; i++){                        
            if(!enabled_cells.includes(i)){                
                document.getElementById(i).className = "disabledbutton";
            }
            else{
                if(GAME_STATE[i] === ''){
                    document.getElementById(i).className = "game-cell";
                    vacias += 1;
                }                                             
            }
        }

        if(vacias === 0){            
            handleThrowADice();
        }

        disableLuckyButton();
    }
    catch{        
    }    
}

function disableLuckyButton(){
    const btn = document.querySelector(".game-lucky-btn")
    btn.className = "game-lucky-btn-disabled";        
}

function handleRestartGame(){
    gameActive = true;
    currentPlayer = 'O';
    document.querySelectorAll(".disabledbutton").forEach(cell => cell.className = "game-cell");
    document.getElementById("btnLuckyButton").className = "game-lucky-btn";
    restartGameState();
    handleStatusDisplay(CURRENT_PLAYER_TURN());
    document.querySelector(".lucky-number").innerText = '';
    document.querySelectorAll(".game-cell").forEach(cell => cell.innerText = '');
    document.querySelectorAll(".game-cell").forEach(cell => cell.className = "disabledbutton");
}

function restartGameState(){
    let i = GAME_STATE.length;
    while (i--) {
        GAME_STATE[i] = '' 
    }
}

function handleCellClick(clickedEvent){
    const clickedCell = clickedEvent.target;
    if(clickedCell.classList.contains("game-cell")){
        const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);                
        if(GAME_STATE[clickedCellIndex] !== '' || !gameActive){
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }    
}

function handleCellPlayed(clickedCell, clickedCellIndex){
    GAME_STATE[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer; 
    document.querySelectorAll(".game-cell").forEach(cell => cell.className = "disabledbutton");   
    document.getElementById("btnLuckyButton").className = "game-lucky-btn";
    document.querySelector(".lucky-number").innerText = 'Lanza el dado...';
}

function handleResultValidation(){
    let roundWon = false;
    for(let i = 0; i < WINNINGS.length; i++){
        const winCondition = WINNINGS[i];
        let position1 = GAME_STATE[winCondition[0]];
        let position2 = GAME_STATE[winCondition[1]];
        let position3 = GAME_STATE[winCondition[2]];
        let position4 = GAME_STATE[winCondition[3]];

        if(position1 === '' ||position2 === '' || position3 === '' || position4 === ''){
            continue;
        }
        if(position1 === position2 && position2 === position3 && position3 === position4){
            roundWon = true;
            handleShowWinningPlaces(winCondition);
            break;
        }
    }

    if(roundWon){
        handleStatusDisplay(WIN_MESSAGE())
        gameActive = false;
        disableLuckyButton();        
        Swal.fire("Ha ganado " + currentPlayer);
        return;
    }

    let roundDraw = !GAME_STATE.includes('')
    if(roundDraw){
        handleStatusDisplay(WIN_MESSAGE())
        gameActive = false;
        disableLuckyButton();
        Swal.fire("El juego ha terminado en empate. ☻ ");
        return;
    }

    handlePlayerChange();
}

function handleShowWinningPlaces(winCondition){    
    document.getElementById(winCondition[0]).className = "game-cell";    
    document.getElementById(winCondition[1]).className = "game-cell";
    document.getElementById(winCondition[2]).className = "game-cell";
    document.getElementById(winCondition[3]).className = "game-cell";
    
}

function handlePlayerChange(){
    for(let i=0; i<PLAYERS.length; i++){
        try{            
            if(currentPlayer === PLAYERS[i]){                
                if(PLAYERS[i+1]){
                    currentPlayer = PLAYERS[i+1];
                }
                else{
                    throw "Error";
                }                
                break;
            }            
        }
        catch{
            currentPlayer = PLAYERS[0];
        }
    }    
    handleStatusDisplay(CURRENT_PLAYER_TURN())
}

main()
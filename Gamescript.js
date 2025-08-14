
const box = document.getElementById("box-content");
const newline = document.createElement("p");

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

function myFunction() {
    console.log("Hello World");

    const box= document.getElementById("box-content");

    const newline = document.createElement("p");
    newline.textContent = "Hello World";


    box.appendChild(newline);



}

function clearbox() {
    const box =  document.getElementById("box-content");
    const paragraph = box.querySelectorAll("p");
    
    paragraph.forEach( p => p.remove());
    
    console.log("Cleared!")
    
}

function countTo10() {
    const box = document.getElementById("box-content");
    
    for (let i = 0; i <= 10; i++) {
        
        const newline = document.createElement("p");
        newline.textContent = `${i}`
        for (let j = 0; j <= 100; j++){    
        }
        
        box.appendChild(newline);
        
        
    }
    
    console.log("counted successfully!")
}



//tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris --- tetris



document.addEventListener('DOMContentLoaded', () => {
    
    const closeBtn =  document.getElementById('closeBtn')
    const appBtn = document.getElementById('openTetrisApp')
    function closeWindow(){
        draggableWindow.classList.add('closed')
        clearInterval(timerID)
        timerID=null
        gameWindow.classList.add('paused');
    }
    function openWindow(){
        draggableWindow.classList.remove('closed')
        
    }
    appBtn.addEventListener('click', openWindow)
    closeBtn.addEventListener('click', closeWindow)
    
    // dragwindow
    const draggableWindow = document.getElementById('gamewindow');
    let offsetX = 0, offsetY = 0, isDragging = false;

    draggableWindow.addEventListener('dragstart', e => e.preventDefault()); 
    draggableWindow.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDragging);

    function startDragging(e) {
    e.preventDefault();

    
    const rect = draggableWindow.getBoundingClientRect();

    
    draggableWindow.style.left = rect.left + 'px';
    draggableWindow.style.top  = rect.top  + 'px';
    draggableWindow.style.transform = 'none'; 

    
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    isDragging = true;
    draggableWindow.classList.add('dragging');
    }

    function dragElement(e) {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    draggableWindow.style.left = x + 'px';
    draggableWindow.style.top  = y + 'px';
    }

    function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    draggableWindow.classList.remove('dragging');
    }



    const grid = document.querySelector('#grid')
    //let cells = Array.from(document.querySelectorAll('.cell , .taken'))
    let cells = Array.from(grid.children);
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn =  document.querySelector('#start-button')
    const width = 10 ;
    let nextRandom = 0;
    let timerID
    let score = 0;
    
    
    //shapes
    const Lshape = [
        [1, width+1, width*2+1,2],
        [width, width+1,width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ]
    const Sshape = [
        [width+1, width+2,width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0, width, width+1, width*2+1]
    ]
    const Tshape = [
        [1,width,width+1,width+2],
        [1,width+1, width*2+1, width+2],
        [width,width+1,width+2,width*2+1],
        [1,width+1, width*2+1,width]
    ]
    const Oshape = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const Ishape = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]
    
    
    const theShapes = [Lshape,Sshape,Tshape,Oshape,Ishape]
    
    let currentPosition = 3
    let currentRotation = 0
    //select random
    let random = Math.floor(Math.random()*theShapes.length)
    console.log(random)
    let current = theShapes[random][0]
    //random color
    const colors= [ 'blue', 'red', 'green', 'yellow', 'purple']
    let randomColor = colors[random]
    console.log(randomColor)
    //DRAW THE SHAPES
    function drawShapes(){
        current.forEach(index => {
            cells[(currentPosition + index)].classList.add('shape',randomColor)
        })
    }
    drawShapes()
    //undraw 
    function undrawShapes() {
        current.forEach(index => {
            cells[(currentPosition + index)].classList.remove('shape',randomColor)
        })
    }
    //fall down timer
    //timerID = setInterval(fallDown, 1000)

    //assign keys
    function control(e){
        if(e.key === 'ArrowLeft') {
            moveLeft()
            console.log('left')  
        }
        else if(e.key === 'ArrowUp'){
            rotateShape()
        }
        else if (e.key === 'ArrowRight') {
            moveRight()
        }
        else if (e.key === 'ArrowDown') {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)
    //fall function
    function fallDown() {
        undrawShapes()
        currentPosition += width
        drawShapes()
        freeze()
        
    }
    //freeze function
    function freeze(){

        if (current.some(index => cells[currentPosition + index + width].classList.contains('taken'))){
            //delay half second
            current.forEach(index => cells[currentPosition + index].classList.add('taken'))
            //start new shape
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theShapes.length)
            current = theShapes[random][currentRotation]
            randomColor = colors[random]
            currentPosition= 3 
            drawShapes()
            displayShape()
            addScore()
            gameOver()
        }
    }
    //moving
    function moveLeft(){
        undrawShapes()
        const isAtLeftEdge = current.some(index => (currentPosition+index)% width === 0)
        if(!isAtLeftEdge) currentPosition -=1 
        
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        drawShapes()
    }
    function moveRight() {
        undrawShapes()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1) 
        if(!isAtRightEdge) currentPosition +=1 
        if (current.some(index => cells[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        drawShapes()

    }
    function moveDown(){
        let downInterval;

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' && !downInterval) {
                downInterval = setInterval(fallDown, 50); // drop every 50ms while holding
            }
        });

        document.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown') {
                clearInterval(downInterval);
                downInterval = 1000;
            }
        });
        }
    //rotate
    function rotateShape(){
        undrawShapes()
        currentRotation ++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theShapes [random][currentRotation]
        drawShapes()
    }
    //show Up next
    const displaySquares = document.querySelectorAll('#mini-grid .tetroshape')
    const displayWidth = 4
    let displayIndex = 0
    //console.log(displaySquares)

    const upNextShape = [
        [1, displayWidth+1, displayWidth*2+1,2],
        [displayWidth+1, displayWidth+2,displayWidth*2, displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
    ]
    function displayShape() {

        displaySquares.forEach( cell => {
            cell.classList.remove('Tetro', 'blue', 'red', 'green', 'yellow', 'purple');
        })
        const nextColor = colors[nextRandom]
        upNextShape[nextRandom].forEach ( index => {
            displaySquares[displayIndex + index].classList.add('Tetro',nextColor)
        })

    }

    //btns

    const gameWindow = document.querySelector('.gamewindow');
    const overlay    = document.getElementById('pauseOverlay');

// show overlay before first start
    gameWindow.classList.add('prestart', 'closed');
    overlay.textContent = 'Press Start to play';

    StartBtn.addEventListener('click', () => {
    if (timerID) {
        // -> pause
        clearInterval(timerID);
        timerID = null;
        overlay.textContent = 'Paused — press Start to resume';
        gameWindow.classList.add('paused');
    } else {
        // -> start / resume
        if (gameWindow.classList.contains('prestart')) {
        overlay.textContent = '';               // optional
        gameWindow.classList.remove('prestart');
        nextRandom = Math.floor(Math.random()*theShapes.length);
        displayShape();
        }
        drawShapes();
        timerID = setInterval(fallDown, 1000);
        gameWindow.classList.remove('paused');
    }
    });    
    //add score 
    function addScore(){
        for (let i = 0 ; i < 199; i+=width ){
            const row = Array.from({ length: width }, (_, k) => i + k);

            if(row.every(index => cells[index].classList.contains('taken'))){
                score += 10
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    cells[index].classList.remove('taken')
                    cells[index].classList.remove('Tetro', 'blue', 'red', 'green', 'yellow', 'purple')
                })
                const cellsRemoved = cells.splice(i,width)
                console.log(cellsRemoved)
                cells = cellsRemoved.concat(cells)
                cells.forEach(cell => grid.appendChild(cell))
            }

        }
    }

    //gameover
    function gameOver(){
        if(current.some(index => cells[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = 'GameOver'
            clearInterval(timerID)
            
        }
    }

    //move with buttons
    let moveLeftBtn = document.querySelector('#leftArrow')
    moveLeftBtn.addEventListener('click', moveLeft)

    let moveRightBtn = document.querySelector('#rightArrow')
    moveRightBtn.addEventListener('click', moveRight)

    let moveDownBtn = document.querySelector('#downArrow')
    moveDownBtn.addEventListener('click', moveDown)

    let rotateBtn = document.querySelector('#rotateBtn')
    rotateBtn.addEventListener('click',rotateShape)
    
    const DROP_MS = 50;      // velocidad al mantener
    let dropInterval = null;

    function startFastDrop() {
    if (dropInterval) return;   // no dupliques intervalos
    fallDown();                  // una caída inmediata
    dropInterval = setInterval(fallDown, DROP_MS);
    }

    function stopFastDrop() {
    if (!dropInterval) return;
    clearInterval(dropInterval);
    dropInterval = null;
    }

    // Eventos para mantener en el botón
    moveDownBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();          // evita selecciones/click fantasma
    startFastDrop();
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
    moveDownBtn.addEventListener(evt, stopFastDrop);
    });

    // Por si sueltas fuera del botón
    document.addEventListener('pointerup', stopFastDrop);

    //ya ni se que hago bro (deshabilitar en pausa)

    











})

const canvas = document.getElementById('spelCanvas');
const context = canvas.getContext('2d');

const mandImg = new Image();
mandImg.src = 'Images/mand2.png';

const appelImg = new Image();
appelImg.src = 'Images/appel.png';

let mand = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 80,
    width: 100,
    height: 100,
    speed: 6,
    dx: 0
};

let appel = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 50,
    speed: 4,
    initialSpeed: 4 
};

let score = 0;
let highscore = localStorage.getItem('highscore') ? parseInt(localStorage.getItem('highscore')) : 0;
const speedVerhogen = 3; 
const maxTime = 10000; 
let remainingTime = maxTime; 
const timeBarWidth = canvas.width - 20; 
const timeBarHeight = 10; 
const timeDecreaseAmount = 10; 

let imagesLoaded = 0;

function checkImagesLoaded() {
    if (imagesLoaded === 2) {
        update(); 
    }
}

mandImg.onload = () => {
    imagesLoaded++;
    checkImagesLoaded();
};

appelImg.onload = () => {
    imagesLoaded++;
    checkImagesLoaded();
};

function movemand() {
    mand.x += mand.dx;
    if (mand.x < 0) mand.x = 0;
    if (mand.x + mand.width > canvas.width) mand.x = canvas.width - mand.width;
}

function drawmand() {
    context.drawImage(mandImg, mand.x, mand.y, mand.width, mand.height);
}

function drawappel() {
    context.drawImage(appelImg, appel.x, appel.y, appel.size, appel.size);
}

function moveappel() {
    appel.y += appel.speed;

    if (
        appel.y + appel.size > mand.y &&
        appel.x > mand.x &&
        appel.x < mand.x + mand.width
    ) {
        score++;
        if (score % speedVerhogen === 0) {
            appel.speed++;
        }
        resetappel();
        remainingTime = Math.min(remainingTime + 500, maxTime);
    }

    if (appel.y > canvas.height) {
        resetappel();
    }
}

function resetappel() {
    appel.x = Math.random() * (canvas.width - 20);
    appel.y = 0;
}

function drawScore() {
    context.font = '16px Arial';
    context.fillStyle = '#0095DD';
    context.fillText('Score: ' + score, 8, 40);
    context.fillText('Highscore: ' + highscore, 8, 60); // Toon de highscore
}

function drawTimeBar() {
    const barWidth = (remainingTime / maxTime) * timeBarWidth;
    context.fillStyle = 'green';
    context.fillRect(10, 10, barWidth, timeBarHeight);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clearCanvas();
    movemand();
    moveappel();
    drawmand();
    drawappel();
    drawScore();
    drawTimeBar();

    remainingTime -= timeDecreaseAmount;
    if (remainingTime <= 0) {
        toonMelding('Je score is: ' + score);
        
    } else {
        requestAnimationFrame(update);
    }
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        mand.dx = mand.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        mand.dx = -mand.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        mand.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function toonMelding(bericht) {
    const meldingElement = document.createElement('div');
    meldingElement.className = 'melding-blok';
    meldingElement.innerText = bericht;
  
    document.body.appendChild(meldingElement);
  
    startConfetti();

    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }
  
    setTimeout(() => {
      meldingElement.remove();
    }, 6000);
}
  
function startConfetti() {
    const colors = ['#FF69B4', '#FFC0CB', '#FFD700', '#32CD32', '#1E90FF']; // Roze, goud, groen, blauw
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 6000);
    }
}

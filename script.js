const canvas = document.getElementById('spelCanvas');
const ctx = canvas.getContext('2d');

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
const speedIncreaseInterval = 3; 
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
    ctx.drawImage(mandImg, mand.x, mand.y, mand.width, mand.height);
}

function drawappel() {
    ctx.drawImage(appelImg, appel.x, appel.y, appel.size, appel.size);
}

function moveappel() {
    appel.y += appel.speed;

    if (
        appel.y + appel.size > mand.y &&
        appel.x > mand.x &&
        appel.x < mand.x + mand.width
    ) {
        score++;
        if (score % speedIncreaseInterval === 0) {
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
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawTimeBar() {
    const barWidth = (remainingTime / maxTime) * timeBarWidth;
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, barWidth, timeBarHeight);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        alert('Game Over! Your score: ' + score);
        document.location.reload();
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

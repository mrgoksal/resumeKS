let canvas = document.getElementById('arkanoidCanvas');
let ctx = canvas.getContext('2d');

// Игровые объекты
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4,
    dy: -4,
    radius: 10
};

let paddle = {
    width: 100,
    height: 10,
    x: (canvas.width - 100) / 2,
    speed: 7
};

let brickRowCount = 5;
let brickColumnCount = 8;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
let score = 0;
let gameStarted = false;
let gamePaused = false;

// Инициализация блоков
function initBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Отрисовка мяча
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Отрисовка платформы
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Отрисовка блоков
function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Обработка столкновений
function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    document.getElementById('score').textContent = score;
                    
                    if(score == brickRowCount * brickColumnCount) {
                        alert('Поздравляем! Вы победили!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Управление платформой
document.addEventListener('mousemove', (e) => {
    if (!gamePaused) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width/2;
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (!gamePaused) {
        if(e.key == "ArrowLeft" && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }
        else if(e.key == "ArrowRight" && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        }
    }
});

// Основной игровой цикл
function draw() {
    if (!gameStarted || gamePaused) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    
    // Отскок от стен
    if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if(ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if(ball.y + ball.dy > canvas.height - ball.radius) {
        // Отскок от платформы
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            alert('Игра окончена!');
            document.location.reload();
        }
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    requestAnimationFrame(draw);
}

// Управление игрой
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gamePaused = false;
        initBricks();
        draw();
    } else if (gamePaused) {
        gamePaused = false;
        draw();
    }
}

function pauseGame() {
    gamePaused = !gamePaused;
    if (!gamePaused) draw();
}

// Инициализация игры
initBricks(); 
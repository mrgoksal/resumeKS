// Змейка
let snake = null;
let food = null;
let direction = null;
let gameLoop = null;
let snakeScore = 0;

function startSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 10;
    
    // Инициализация змейки
    snake = [
        {x: 15, y: 15},
        {x: 14, y: 15},
        {x: 13, y: 15}
    ];
    direction = 'right';
    snakeScore = 0;
    document.getElementById('snakeScore').textContent = snakeScore;
    
    // Создание еды
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    
    // Очистка предыдущего игрового цикла
    if (gameLoop) clearInterval(gameLoop);
    
    // Управление
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });
    
    // Игровой цикл
    gameLoop = setInterval(() => {
        // Очистка canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Движение змейки
        const head = {x: snake[0].x, y: snake[0].y};
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Проверка столкновений
        if (head.x < 0 || head.x >= canvas.width / gridSize ||
            head.y < 0 || head.y >= canvas.height / gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(gameLoop);
            alert('Игра окончена! Счёт: ' + snakeScore);
            return;
        }
        
        // Добавление новой головы
        snake.unshift(head);
        
        // Проверка еды
        if (head.x === food.x && head.y === food.y) {
            snakeScore += 10;
            document.getElementById('snakeScore').textContent = snakeScore;
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
        } else {
            snake.pop();
        }
        
        // Отрисовка змейки
        ctx.fillStyle = '#0f0';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });
        
        // Отрисовка еды
        ctx.fillStyle = '#f00';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    }, 100);
}

// Тетрис
let tetrisBoard = [];
let currentPiece = null;
let tetrisScore = 0;
let tetrisGameLoop = null;

const PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

function startTetrisGame() {
    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const blockSize = 20;
    
    // Инициализация игрового поля
    tetrisBoard = Array(20).fill().map(() => Array(12).fill(0));
    tetrisScore = 0;
    document.getElementById('tetrisScore').textContent = tetrisScore;
    
    // Создание новой фигуры
    function newPiece() {
        const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        return {
            shape: piece,
            x: Math.floor((12 - piece[0].length) / 2),
            y: 0
        };
    }
    
    // Проверка столкновений
    function collision(piece, dx = 0, dy = 0) {
        return piece.shape.some((row, y) =>
            row.some((value, x) =>
                value !== 0 &&
                (piece.x + x + dx < 0 ||
                 piece.x + x + dx >= 12 ||
                 piece.y + y + dy >= 20 ||
                 (tetrisBoard[piece.y + y + dy] &&
                  tetrisBoard[piece.y + y + dy][piece.x + x + dx] !== 0))
            )
        );
    }
    
    // Очистка заполненных линий
    function clearLines() {
        let linesCleared = 0;
        for (let y = tetrisBoard.length - 1; y >= 0; y--) {
            if (tetrisBoard[y].every(value => value !== 0)) {
                tetrisBoard.splice(y, 1);
                tetrisBoard.unshift(Array(12).fill(0));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            tetrisScore += linesCleared * 100;
            document.getElementById('tetrisScore').textContent = tetrisScore;
        }
    }
    
    // Управление
    document.addEventListener('keydown', function(e) {
        if (!currentPiece) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (!collision(currentPiece, -1)) currentPiece.x--;
                break;
            case 'ArrowRight':
                if (!collision(currentPiece, 1)) currentPiece.x++;
                break;
            case 'ArrowDown':
                if (!collision(currentPiece, 0, 1)) currentPiece.y++;
                break;
            case 'ArrowUp':
                const rotated = {
                    shape: currentPiece.shape[0].map((_, i) =>
                        currentPiece.shape.map(row => row[row.length - 1 - i])),
                    x: currentPiece.x,
                    y: currentPiece.y
                };
                if (!collision(rotated)) currentPiece = rotated;
                break;
        }
    });
    
    // Очистка предыдущего игрового цикла
    if (tetrisGameLoop) clearInterval(tetrisGameLoop);
    
    currentPiece = newPiece();
    
    // Игровой цикл
    tetrisGameLoop = setInterval(() => {
        // Падение фигуры
        if (!collision(currentPiece, 0, 1)) {
            currentPiece.y++;
        } else {
            // Фиксация фигуры
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        tetrisBoard[currentPiece.y + y][currentPiece.x + x] = value;
                    }
                });
            });
            
            clearLines();
            currentPiece = newPiece();
            
            // Проверка окончания игры
            if (collision(currentPiece)) {
                clearInterval(tetrisGameLoop);
                alert('Игра окончена! Счёт: ' + tetrisScore);
                return;
            }
        }
        
        // Отрисовка
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовка поля
        tetrisBoard.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            });
        });
        
        // Отрисовка текущей фигуры
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = '#f0f';
                    ctx.fillRect(
                        (currentPiece.x + x) * blockSize,
                        (currentPiece.y + y) * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            });
        });
    }, 500);
}

// Превью для Арканоида
function drawArkanoidPreview() {
    const canvas = document.getElementById('arkanoidPreview');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 40;
    const brickHeight = 15;
    const brickPadding = 5;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const paddleWidth = 75;
    const paddleHeight = 10;
    const ballRadius = 5;

    // Очищаем холст
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка блоков
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        }
    }

    // Отрисовка платформы
    const paddleX = (canvas.width - paddleWidth) / 2;
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();

    // Отрисовка мяча
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height - 30, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Вызываем отрисовку превью при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    drawArkanoidPreview();
}); 
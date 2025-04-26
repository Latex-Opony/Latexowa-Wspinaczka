// pobieranie referencji
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// stałe fizyczne
gconst GRAVITY = 0.5;
const JUMP_VELOCITY = -15;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;

// obsługa klawiatury
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// klasa Platform
class Platform {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.width = PLATFORM_WIDTH;
        this.height = PLATFORM_HEIGHT;
        this.img = img; // obraz platformy
    }
    draw() {
        if (this.img) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        else {
            ctx.fillStyle = '#444';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// klasa Gracz
class Player {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.vx = 0;
        this.vy = 0;
        this.img = img;
    }
    update(platforms) {
        // ruch poziomy
        if (keys['ArrowLeft']) this.vx = -5;
        else if (keys['ArrowRight']) this.vx = 5;
        else this.vx = 0;

        // zastosuj grawitację
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // kolizja z platformami
        for (let p of platforms) {
            if (this.vy > 0 &&
                this.x + this.width > p.x &&
                this.x < p.x + p.width &&
                this.y + this.height > p.y &&
                this.y + this.height < p.y + p.height) {
                this.vy = JUMP_VELOCITY;
            }
        }
    }
    draw(cameraY) {
        const drawY = this.y - cameraY;
        if (this.img) ctx.drawImage(this.img, this.x, drawY, this.width, this.height);
        else {
            ctx.fillStyle = '#E91E63';
            ctx.fillRect(this.x, drawY, this.width, this.height);
        }
    }
}

// ładowanie assetów
tmp();
async function tmp() {
    const playerImg = await loadImage('assets/images/player.png');
    const platformImg = await loadImage('assets/images/platform.png');
    startGame(playerImg, platformImg);
}

function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
    });
}

// główna logikaunction startGame(playerImg, platformImg) {
    let platforms = [];
    // tworzenie początkowych platform
    for (let i = 0; i < 10; i++) {
        platforms.push(new Platform(
            Math.random() * (canvas.width - PLATFORM_WIDTH),
            canvas.height - i * 120,
            platformImg
        ));
    }

    const player = new Player(canvas.width / 2 - 25, canvas.height - 150, playerImg);
    let cameraY = 0;

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // aktualizacja gracza\player.update(platforms);

        // kamera podąża za graczem jeśli wyżej niż środek ekranu
        if (player.y < cameraY + canvas.height / 2) {
            cameraY = player.y - canvas.height / 2;
        }

        // rysowanie platform i generowanie nowych
        platforms.forEach(p => p.draw(cameraY));
        if (platforms[platforms.length - 1].y > cameraY - 200) {
            platforms.push(new Platform(
                Math.random() * (canvas.width - PLATFORM_WIDTH),
                platforms[platforms.length - 1].y - 120,
                platformImg
            ));
        }

        // rysowanie gracza
        player.draw(cameraY);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

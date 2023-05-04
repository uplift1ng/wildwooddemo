/*
* Iteration 6 of Escape of WildWood for COSC 473 - Software Engineering
* Authors: Jesse Hajas* , Drew Rado, Emily Himes, Malcolm Holden, Lileah Tunno 
* Date: 4/26/2023
*
* Scrum Master*

Escape of WildWood, is a non-ending side-scrolling webpage based game.  
The goal of this game is to collect coins and avoid the enemies for as long as you can so you can gather a high score, then put it on the leaderboard once you die.

This is the javascript main game code.
*/

//put everything inside of this class so it has time to load before the player can interact
window.addEventListener('load', function(){
    const jumpSound = new Audio('../assets/jump.wav');
    const backgroundMusic = new Audio("../assets/background.mp3");
    const gameoverSound = new Audio('../assets/gameover.mp3');
    const coinSound = new Audio('../assets/coin.wav');
    var menu1 = document.getElementById("toggleSwitches");
    var menu2 = document.getElementById("instructions");
    var menu3 = document.getElementById("leaderboard");
        menu1.addEventListener("change", function() {
            if (this.checked) {
                backgroundMusic.play();
            } else {
                backgroundMusic.pause();
            }
        });
    menu2.addEventListener('click', () => {
            window.alert("Escape the WildWood Instructions:\n\nRight-Arrow : Forwards\n\nLeft-Arrow  : Backwards\n\nUp-Arrow    : Jump\n\nDown-Arrow  : Down a Platform\n\n+ You only have ONE life\n\n+ Avoid the enemies\n\n+ Your sub-score will increase when you collect a coin\n\n+ Your total-score will have your time added your score from the game.\n\n+ Your time starts counting up from when you first started the game.\n\n+ You must have fun\n")    
        });
    menu3.addEventListener('click', () => {
                //opens the leaderboard
                window.location.href = "leaderboard.php";
                //window.location.reload();    
            });
    const myButton = document.getElementById("myButton");
    myButton.addEventListener("click", function() {
        play();
        var startElement = document.getElementById("myButton");
        startElement.style.display = 'none';
        startElement.style.bottom = '1000px';
        startElement.style.right = '1000px';
    });
    var score = 0;
    function play(){
        var element = document.getElementById("canvas1");
        element.style.display = 'block';
        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = 900;
        canvas.height = 720;
        document.body.appendChild(canvas);
        let enemies = [];
        let flyEnemies = [];
        let platforms = [];
        let coins = [];
        var firstTime = true;
        let gameOver = false;
        let coinPairs = [];
        
        backgroundMusic.loop = true; // set the loop property to true
        backgroundMusic.play();
        menu1.checked = true;

        // Increment counter every second
        setInterval(function() {
            score++;
        }, 1000);

        class InputHandler {
            //Using an array allows us to keep track of multiple key presses at any given time
            constructor(){
                this.keys = [];
                //Ads the keypress to the array
                window.addEventListener('keydown',  e => {
                    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    }
                });
                //Removes the keypress from the array
                window.addEventListener('keyup',  e => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                        this.keys.splice(this.keys.indexOf(e.key), 1);
                    }
                });
            }
        }
        
        class Player {
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 200;
                this.height = 200;
                this.x = 0;
                this.y = this.gameHeight - this.height;
                this.image = document.getElementById('playerImage');
                this.frameX = 0;
                this.maxFrame = 8;
                this.frameY = 0;
                this.fps = 25;
                this.frameTimer = 0;
                this.frameInterval = 1000/this.fps;
                this.speed = 0;
                this.vy = 0;
                this.weight = 1;
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
            }
            update(input, deltaTime, enemies, flyEnemies, platforms, coins){
                // collision detection enemies
                enemies.forEach(enemy => {
                    const dx = enemy.x -this.x;
                    const dy = enemy.y - this.y;
                    const distance = Math.sqrt(dx *dx + dy *dy);
                    if(distance < enemy.width/2 + this.width/2){
                        gameOver = true; //enemies wont kill till this is true
                    }
                })
                
                // collision detection flying enemies
                flyEnemies.forEach(flyEnemy => {
                    if (this.x < flyEnemy.x + flyEnemy.width &&
                        this.x + this.width > flyEnemy.x &&
                        this.y < flyEnemy.y + flyEnemy.height &&
                        this.y + this.height > flyEnemy.y) {
                        gameOver = true;
                    }
                })

                // collision detection coins
                coins.forEach(coin => {
                    const dx = coin.x -this.x;
                    const dy = coin.y - this.y;
                    const distance = Math.sqrt(dx *dx + dy *dy);
                    if(distance < coin.width/2 + this.width/2){ 
                        //I need code to delete the code here on collide 
                        coin.delete();
                        coinSound.play();
                        score = score + 5;
                    }
                })

                // platform detection
                let onPlatform = false;
                platforms.forEach(platform => {
                    const platformFront = platform.x;
                    const platformRear = platform.x + platform.width;
                    if (this.x + this.width > platformFront && this.x < platformRear && this.y + this.height <= platform.y) {
                        this.gameHeight = 400;
                        onPlatform = true;
                    }
                });

                if (!onPlatform) {
                    this.gameHeight = 720;
                }

                //animation
                if(this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame) this.frameX = 0;
                    else this.frameX++;
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }

                //controls
                if (input.keys.indexOf('ArrowRight') > -1){
                    this.speed = 5;
                } else if (input.keys.indexOf('ArrowLeft') > -1){
                    this.speed = -5;
                } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                    jumpSound.play();
                    this.vy -= 30;
                } else if (input.keys.indexOf('ArrowDown') > -1){
                    this.gameHeight = 720;
                } else {
                    this.speed = 0;
                }

                //horizontal movement
                this.x += this.speed;
                if (this.x < 0) this.x = 0;
                else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

                //Vertical Movement
                this.y += this.vy;
                if (!this.onGround()){
                    this.vy += this.weight;
                    this.maxFrame = 5;
                    this.frameY = 1;
                } else {
                    this.vy = 0;
                    this.maxFrame = 8;
                    this.frameY = 0;
                }

                //Prevents the player from falling through floor
                if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height

            }
            //determines if player is on ground, if player is allows jump
            onGround(){
                return this.y >= this.gameHeight - this.height;
            }
        }
        
        class Background {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.image = document.getElementById('backgroundImage');
                this.x = 0;
                this.y = 0;
                this.width = 1591;
                this.height = 720;
                this.speed = 6;
            }
            draw(context) {
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
                context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height); //puts one image right next to the first
            }
            update() {
                this.x -= this.speed;
                //reset check
                if (this.x < 0 - this.width) this.x = 0; 
            }
        }
        
        class Enemy{
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 160;
                this.height = 50;
                this.image = document.getElementById('enemyImage');
                this.x = this.gameWidth;
                this.y = this.gameHeight - this.height;
                this.frameX = 0;
                this.maxFrame = 5;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000/this.fps;
                this.speed = 10;
                this.markedForDeleteion = false;
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            }
            update(deltaTime){
                if (this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame){
                        this.frameX = 0;
                    } else {
                        this.frameX++;
                    }
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }
                this.x -= this.speed;
                if (this.x < 0 - this.width) this.markedForDeleteion = true;
            }
        }
        
        class flyingEnemy{
            constructor(gameWidth, gameHeight){
                this.image = document.getElementById('fly')
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 50;
                this.height = 50;
                this.x = this.gameWidth
                this.y = Math.random() * gameHeight/2; 
                this.frameX = 0;
                this.maxFrame = 5;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000/this.fps;
                this.speed = 4;
                this.markedForDeleteion = false;
            //UP DOWN VAR
                this.angle = Math.random() * 3;
                this.angleSpeed = Math.random() * 0.2;
                this.curve = Math.random() * 2;
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            }
            update(deltaTime){
            //SPRITE IMAGE CODE
                if (this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame){
                        this.frameX = 0;
                    } else {
                        this.frameX++;
                    }
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }
        //Up Down Movements
                this.x -= this.speed;
                this.y += (this.curve * Math.sin(this.angle));
                this.angle += this.angleSpeed        
                if (this.x < 0 - this.width) this.markedForDeleteion = true;
            }
        }
        
        class Platform {
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 1000;
                this.height = 50;
                this.image = document.getElementById('platformImage');
                this.x = this.gameWidth;
                this.y = 400;
                this.frameX = 0;
                this.maxFrame = 5;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000/this.fps;
                this.speed = 8;
                this.markedForDeleteion = false;
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            }
            update(deltaTime){
                if (this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame){
                        this.frameX = 0;
                    } else {
                        this.frameX++;
                    }
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }
                this.x -= this.speed;
                if (this.x < 0 - this.width) this.markedForDeleteion = true;
            }
        }

        class Coin{
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 70;
                this.height = 70;
                this.image = document.getElementById('coinImage');
                this.x = this.gameWidth;
                this.y = this.gameHeight - this.height;
                this.frameX = 0;
                this.maxFrame = 5;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000/this.fps;
                this.speed = 8;
                this.markedForDeleteion = false;
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)                
            }
            update(deltaTime){
                if (this.frameTimer > this.frameInterval){
                    if (this.frameX >= this.maxFrame){
                        this.frameX = 0;
                    } else {
                        this.frameX++;
                    }
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }
                this.x -= this.speed;
                if (this.x < 0 - this.width) this.markedForDeleteion = true;
            }
            delete(){
                this.markedForDeleteion = true;
            }
        }

        function handleEnemies (deltaTime){
            if (enemyTimer > enemyInterval + randomEnemyInterval){
                enemies.push(new Enemy(canvas.width, canvas.height));
                randomEnemyInterval = (Math.random() * 1000) + 500;
                enemyTimer = 0;
            } else {
                enemyTimer += deltaTime;
            }
            enemies.forEach(enemy => {
                enemy.draw(ctx);
                enemy.update();
            })
            enemies = enemies.filter(enemy => !enemy.markedForDeleteion);
        }
        
        function handleFlyEnemies (deltaTime){
            if (flyEnemyTimer >= flyEnemyInterval + randomflyEnemyInterval){
                flyEnemies.push(new flyingEnemy(canvas.width, canvas.height));
                randomflyEnemyInterval = (Math.random() * 6000) + 1000;
                flyEnemyTimer = 0;
            } else {
                flyEnemyTimer += deltaTime;
            }
            flyEnemies.forEach(flyEnemy => {
                flyEnemy.draw(ctx);
                flyEnemy.update();
            })
            flyEnemies = flyEnemies.filter(flyEnemy => !flyEnemy.markedForDeleteion);
        }

        function handlePlatforms (deltaTime){
            if (platformTimer > platformInterval + randomPlatformInterval){
                platforms.push(new Platform(canvas.width, canvas.height));
                randomPlatformInterval = (Math.random() * 4000) + 500;
                platformTimer = 0;
            } else {
                platformTimer += deltaTime;
            }
            platforms.forEach(platform => {
                platform.draw(ctx);
                platform.update();
            })
            platforms = platforms.filter(platform => !platform.markedForDeleteion);
        }

        function handleCoins (deltaTime){
            if (coinTimer > coinInterval + randomCoinInterval){
                let isWithinEnemy = false;
                coins.forEach(coin => {
                    enemies.forEach(enemy => {
                        if (coin.x < enemy.x + enemy.width &&
                            coin.x + coin.width > enemy.x &&
                            coin.y < enemy.y + enemy.height &&
                            coin.y + coin.height > enemy.y) {
                            isWithinEnemy = true;
                        }
                    });
                });
                if(!isWithinEnemy) {
                    coins.push(new Coin(canvas.width, canvas.height));
                    randomCoinInterval = (Math.random() * 4000) + 500;
                    coinTimer = 0;
                }
            } else {
                coinTimer += deltaTime;
            }
            coins.forEach(coin => {
                coin.draw(ctx);
                coin.update();
            })
            coins = coins.filter(coin => !coin.markedForDeleteion);
        }

        function handleCoinsTwo (deltaTime){
            if (coinTimer > coinInterval + randomCoinInterval){
                let isWithinEnemy = false;
                coins.forEach(coin => {
                    enemies.forEach(enemy => {
                        if (coin.x < enemy.x + enemy.width &&
                            coin.x + coin.width > enemy.x &&
                            coin.y < enemy.y + enemy.height &&
                            coin.y + coin.height > enemy.y) {
                            isWithinEnemy = true;
                        }
                    });
                });
                if(!isWithinEnemy) {
                    coins.push(new Coin(canvas.width, canvas.height -400));
                    randomCoinInterval = (Math.random() * 4000) + 500;
                    coinTimer = 0;
                }
            } else {
                coinTimer += deltaTime;
            }
            coins.forEach(coin => {
                coin.draw(ctx);
                coin.update();
            })
            coins = coins.filter(coin => !coin.markedForDeleteion);
        }

        function displayStatusText(context){
            context.fillStyle = 'white';
            context.font = '40px Helvetica';
            context.fillText('Score: ' + score, 20, 50);
            if(gameOver){
                gameoverSound.play();
                backgroundMusic.pause();
                //The game ended
                showEndGameScreen(context);
            }
        }

        function showEndGameScreen(context) {
            // Create a new endgame screen div
            let endGameScreen = document.createElement('div');
            endGameScreen.id = 'endGameScreen';
            endGameScreen.style.position = 'absolute';
            endGameScreen.style.width = '99%';
            endGameScreen.style.height = '90%';
            endGameScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            endGameScreen.style.display = 'flex';
            endGameScreen.style.flexDirection = 'column';
            endGameScreen.style.justifyContent = 'center';
            endGameScreen.style.alignItems = 'center';
            endGameScreen.style.zIndex = '1000';
            document.body.appendChild(endGameScreen);

            // Create a new "Game Over" title
            let gameOverTitle = document.createElement('h1');
            gameOverTitle.innerText = 'Game Over';
            gameOverTitle.style.fontSize = '40px';
            gameOverTitle.style.fontFamily = 'Helvetica';
            gameOverTitle.style.color = 'white';
            gameOverTitle.style.marginBottom = '20px';
            endGameScreen.appendChild(gameOverTitle);
        
            // Create a form for submission
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "connect.php");

            // Create a new input for the player's name
            let playerNameInput = document.createElement('input');
            playerNameInput.setAttribute("type", "text");
            playerNameInput.setAttribute("placeholder", "Enter your name");
            playerNameInput.setAttribute("name", "name");
            playerNameInput.setAttribute("maxlength","8");
            playerNameInput.style.marginBottom = '10px';
            playerNameInput.style.fontSize = '20px';
            playerNameInput.style.padding = '5px 10px';
            form.appendChild(playerNameInput);
                    
            // Hidden field for score value submission
            let scoreInput = document.createElement('input');
            scoreInput.setAttribute("type","hidden");
            scoreInput.setAttribute("name", "inputScore");
            scoreInput.setAttribute("value", score);
            form.appendChild(scoreInput);

            // Create a new submit button
            let submitButton = document.createElement('button');
            submitButton.setAttribute("value", "Submit");
            submitButton.setAttribute("type", "submit");
            submitButton.innerText="Submit";
            submitButton.style.fontSize = '24px';
            submitButton.style.padding = '10px 20px';
            submitButton.style.cursor = 'pointer';
            submitButton.style.marginBottom = '20px';
            form.appendChild(submitButton);
            endGameScreen.appendChild(form);

            // Create a new refresh button
            let refreshButton = document.createElement('button');
            refreshButton.innerText = 'Restart';
            refreshButton.style.fontSize = '24px';
            refreshButton.style.padding = '10px 20px';
            refreshButton.style.cursor = 'pointer';
            refreshButton.addEventListener('click', function () {
                location.reload();
            });
        
            // Add the refresh button to the endgame screen
            endGameScreen.appendChild(refreshButton);           
        }

        const input = new InputHandler();
        const background = new Background(canvas.width, canvas.height);
        const player = new Player(canvas.width, canvas.height);
       
        let lastTime = 0;
        let enemyTimer = 0;
        let enemyInterval = 1000;
        let randomEnemyInterval = (Math.random() * 1000) + 500;
        if(!firstTime){
            randomEnemyInterval = (Math.random() * 1000) + 500;
        } else {
            randomEnemyInterval = (Math.random() * 1000) + 7000;
        }
        
        let flyEnemyTimer = 0;
        let flyEnemyInterval = 1000;
        let randomflyEnemyInterval = (Math.random() * 1000) + 500;
        if(!firstTime){
            randomflyEnemyInterval = (Math.random() * 1000) + 500;
        } else {
            randomflyEnemyInterval = (Math.random() * 1000) + 7000;
        }
        
        let platformTimer = 0;
        let platformInterval = 3000;
        let randomPlatformInterval = (Math.random() * 4000) + 500;
        let coinTimer = 0;
        let coinInterval = 3000;
        let randomCoinInterval = (Math.random() * 4000) + 500;
        let playerAlive = true;
        let counter = 0;
        
        function animate(timeStamp){
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            background.draw(ctx);
            background.update();
            player.draw(ctx);
            player.update(input, deltaTime, enemies, flyEnemies, platforms, coins);
            handleEnemies(deltaTime);
            handleFlyEnemies(deltaTime);
            handlePlatforms(deltaTime);
            if(Math.round(Math.random() * 10) > 5){
                handleCoins(deltaTime);
            } else {
                handleCoinsTwo(deltaTime);
            }
            displayStatusText(ctx);
            if (!gameOver) requestAnimationFrame(animate);
        }
        animate(0);
    }
});
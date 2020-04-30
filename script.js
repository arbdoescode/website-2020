var myGamePiece;
var myObstacles = [];
var myScore;
var myJumpBtn;
var myLeftBtn;
var myRightBtn;
var lives = 3;
var myTraps;
var Boss;
var fireball = [];

function startGame() {
    myGamePiece = new component(50, 75, "assets/arbwalk.png", 10, 260, "image");
    myTraps = new component(695, 15, "assets/traps.png", 0, -1, "image");
    myScore = new component("30px", "Consolas", "black", 500, 40, "text");
    myJumpBtn = new component(50, 50, "buttons/jumpbutton.png", 600, 370,"image");   
    myLeftBtn = new component(30, 30, "buttons/leftbutton.png", 40, 377,"image");
    myRightBtn = new component(30, 30, "buttons/rightbutton.png", 110, 377,"image");
    Boss = new component(217, 327, "assets/xhoissj.png", 1000, 33.5,"image");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 695;
        this.canvas.height = 419;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousedown', function (e) {
      myGameArea.x = e.pageX;
      myGameArea.y = e.pageY;
    })
    window.addEventListener('mouseup', function (e) {
      myGameArea.x = false;
      myGameArea.y = false;
    })
    window.addEventListener('touchstart', function (e) {
      myGameArea.x = e.pageX;
      myGameArea.y = e.pageY;
    })
    window.addEventListener('touchend', function (e) {
      myGameArea.x = false;
      myGameArea.y = false;
    })
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGamePiece.gravity = 0.15;
            myGameArea.key = false;
        })
      },  
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.angle = 0;
    this.moveAngle = 1;
    this.gravity = 0.07;
    this.gravitySpeed = 0;
    this.bounce = 0.35;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
          } 
        else if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    } 
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed; 
        this.hitBottom();     
    }
    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      life--;
    }
    if (life == 0){
        crash = false;
    }
    return crash;
  }
    this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height-59;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;}
    return crash;
  }
   this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var clicked = true;
        if ((mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
   
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        } 
    }
    for (i = 0; i < fireball.length; i += 1) {
        if (myGamePiece.crashWith(fireball[i])) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        } 
    }
    if (myGamePiece.crashWith(myTraps)) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        } if (myGamePiece.crashWith(Boss)) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        } 
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 2 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        y = myGameArea.canvas.height - 200;
        myObstacles.push(new component(45, 45, "assets/denikoopatroopa.png", x+400, height,"image"));
    }
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 200;
        myObstacles.push(new component(40, 50, "assets/semgoomba.png", x, y+90,"image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -3.5; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 3.5; }
    if (myGameArea.key && myGameArea.key == 32) {accelerate(-0.4);}
    myScore.text = "SCORE: " + myGameArea.frameNo/10;
    myScore.update();
    if (myGameArea.x && myGameArea.y) {
        if (myJumpBtn.clicked()) {
            myGamePiece.speedY -= 5;
            myGamePiece.image.src = "assets/arbjump.png";
        }
        if (myLeftBtn.clicked()) {
            myGamePiece.x += -3.5;
        }
        if (myRightBtn.clicked()) {
            myGamePiece.x += 3.5;
        }
    }
    if(myGamePiece.y >= 255){myGamePiece.image.src = "assets/arbwalk.png"}
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -3.5; myGamePiece.image.src = "assets/arbwalkback.png"}
    if(myGamePiece.y <= 256){myGamePiece.image.src = "assets/arbjump.png"}
    myTraps.update();
    myJumpBtn.update();                
    myLeftBtn.update();        
    myRightBtn.update(); 
    Boss.update();
    if (Boss.x > 500){Boss.x += -0.25;}
    if (Boss.x == 500){
        Boss.x = 500;
      if (myGameArea.frameNo == 2 || everyinterval(150)) {
        Boss.image.src = "assets/xhoiattack.png";
    } if (myGameArea.frameNo == 2 || everyinterval(155)) {
        Boss.image.src = "assets/xhoissj.png";
    }
        if (myGameArea.frameNo == 2 || everyinterval(150)) {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
        x = myGameArea.canvas.width;
        minHeight = 200;
        maxHeight = 250;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        y = myGameArea.canvas.height - 200;
        fireball.push(new component(20, 20, "assets/fireball.png", x-150, height,"image"));
            }
        for (i = 0; i < fireball.length; i += 1) {
        fireball[i].x += -3;
        fireball[i].update();
            }
        }
    myGamePiece.newPos();
    myGamePiece.update();
  }

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var myGamePiece;
var gameHeight;
var gameWidth;
var myObstacles = [];
var delta = 0.001;
var maxSpeed = 5;
var minSpeed = -5;
var maxSpeedUp = -5;
var gravityLowerBound = -5;
var horizontalModifier = 1;
var verticalModifier = 1;
var loot;
var left = false;
var right = false;
var timer;
var lootGet = true;
var score = 0;
var lootDelta = 5;
var deadlyObstacles = [];
var gameOver = false;
var touchLock = false;
var difficultyModifier = 150;
var gamePieceHeight;
var gamePieceWidth
var deadlyRight = false;



//Startet das Spiel mit dem Spielfeld 
function startGame() {
	myGamePiece = new component(10,10,"navy", (window.innerWidth)/2,0);
	gamePieceHeight = myGamePiece.height;
	gamePieceWidth = myGamePiece.width;
	checkAcc();
	myGameArea.start();
	setObstacles();
	lootPos();
	
}

//Eigenschaften und Funktionen des Spielfeldes
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {

    this.canvas.width = window.innerWidth; 
	gameWidth = this.canvas.width;
    this.canvas.height = window.screen.availHeight;
	gameHeight = this.canvas.height;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
	this.frame = 0;
	this.canvas.addEventListener("touchstart", moveUp);
	this.canvas.addEventListener("touchend", stopUp);
	this.canvas.addEventListener("mousedown", moveUp);
	this.canvas.addEventListener("mouseup", stopUp);
  },
  stop : function() {
    clearInterval(this.interval);
	this.clear();
	ctx.strokeStyle = "silver";
	ctx = this.context;
	ctx.moveTo(myGameArea.canvas.width/2, 0);
    ctx.lineTo(myGameArea.canvas.width/2, myGameArea.canvas.height);
    ctx.stroke();
	ctx.textAlign = "center";
	ctx.font = "30px Arial"
	ctx.fillStyle = "black";
    ctx.fillText("Game Over! ", myGameArea.canvas.width/2, myGameArea.canvas.height/2); 
	ctx.fillText("Score: "+ score, myGameArea.canvas.width/2, myGameArea.canvas.height/2 + 30);
	setTimeout(function(){window.location.reload(); }, 5000);
  },

  //Leert das gesamte Spielfeld
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

//Eigenschaften und Funktionen des Spielsteins und den Hindernissen
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
	this.speedX=0;
	this.speedY=0;
    this.gravity = 0.1;
    this.gravitySpeed = 0;
	this.bounce = 0.4;
    this.x = x;
    this.y = y;
	randomMinSpeed = 1;
    randomMaxSpeed = 3;
	if(deadlyRight==false){
    this.randomSpeed = Math.floor(Math.random()*(randomMaxSpeed-randomMinSpeed+1)+randomMinSpeed);
	}else {
	this.randomSpeed = (-1)*(Math.floor(Math.random()*(randomMaxSpeed-randomMinSpeed+1)+randomMinSpeed));
	}
	
	//Updatefunktion fuer jeden neuen Frame
this.update = function(){	
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
	ctx.textAlign = "top";
	ctx.font = "15px Arial"
	ctx.fillStyle = "black";
    ctx.fillText("Score: "+ score, 15, 15); 
 }
 
 //Errechnet die Position des Spielsteins
    this.newPos = function() {
	this.gravitySpeed = Math.max(this.gravitySpeed + this.gravity, gravityLowerBound);
    this.x = this.x + Math.min(maxSpeed,((this.speedX)*horizontalModifier));
	if(this.speedY >= 0){
    this.y = this.y + ((this.speedY + this.gravitySpeed)*horizontalModifier);
	}else{
    this.y = this.y + Math.max(maxSpeedUp,((this.speedY + this.gravitySpeed)*horizontalModifier));
    }	
	this.hitLeft();
	this.hitRight();
	verticalModifier = 1;
	horizontalModifier = 1;
    myGamePiece.gotLoot(loot);
	for(i=0; i < myObstacles.length; i++){	
    if(myGamePiece.crashTop(myObstacles[i])){	  
		this.topSide(myObstacles[i]);
		horizontalModifier = 0.5;
	
	}
	if(myGamePiece.crashBottom(myObstacles[i])){
	    this.bottomSide(myObstacles[i]);
		horizontalModifier = 0.5;
	}	
	if(myGamePiece.crashLeft(myObstacles[i])){
		this.x = myObstacles[i].x + myObstacles[i].width; 
		verticalModifier = 0.5;
	}
	 if(myGamePiece.crashRight(myObstacles[i])){
		this.x = myObstacles[i].x - this.width;
		 verticalModifier = 0.5;
	 }
	
	
   }
   this.hitCeiling();
   this.hitBottom();
  }
  
  //Prueft ob der Spielstein die Decke des Spielfeldes trifft
  this.hitCeiling = function() {
    var ceiling = 0;
    if (this.y < ceiling) {
      this.y = ceiling;
	  this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
  }
  
  
  //Prueft ob der Spielstein den Boden des Spielfeldes trifft
  this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - gamePieceHeight;
    if (this.y > rockbottom) {
      this.y = rockbottom;
	  this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
  }
  
  //Prueft ob der Spielstein den linken Rand trifft 
  this.hitLeft = function() {
    var leftEdge = 0;
    if (this.x < leftEdge) {
      this.x = leftEdge;
	 // this.sideGravity = -(this.sideGravity * this.sideBounce);
    }
  }
  
  //Prueft ob der Spielstein den rechten Rand trifft
  this.hitRight = function() {
    var rightEdge = myGameArea.canvas.width - gamePieceWidth;
    if (this.x > rightEdge) {
      this.x = rightEdge;
	 // this.sideGravity = -(this.sideGravity * this.sideBounce);
    }
  }
  
  //Prueft ob der Spielstein ein Hinderniss von unten trifft
    this.crashBottom = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (gamePieceHeight);
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (gamePieceWidth);
    var otherleft = otherobj.x;
	var myleft = this.x;
    var otherright = otherobj.x + (otherobj.width);
    var crash = false;
    if ((mybottom > otherbottom) && (mytop < otherbottom) &&
	((myright > otherleft && myleft < otherleft)||
	(myleft < otherright && myright > otherright)||
	(myleft < otherright && myright < otherright && myleft > otherleft && myright > otherleft)))
    {
      crash = true;
    }
    return crash;
  }
  
  //Prueft ob der Spielstein ein Hinderniss von oben trifft
   this.crashTop = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (gamePieceHeight);
    var othertop = otherobj.y;
	var myright = this.x + (gamePieceWidth);
    var otherleft = otherobj.x;
	var myleft = this.x;
    var otherright = otherobj.x + (otherobj.width);
    var crash = false;
    if ((mybottom > othertop) && (mytop < othertop) &&
	((myright > otherleft && myleft < otherleft)||
	(myleft < otherright && myright > otherright)||
	(myleft < otherright && myright < otherright && myleft > otherleft && myright > otherleft)))
    {
      crash = true;
    }
    return crash;
  }
  
  //Prueft ob der Spielstein ein Hinderniss von links trifft
  this.crashLeft = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (gamePieceHeight);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (gamePieceWidth);
	var myleft = this.x
	var otherright = otherobj.x + (otherobj.width);
    var crash = false;
    if ((myleft < otherright) &&
	(myright > otherright) &&
	((mybottom > othertop && mytop > othertop && mybottom < otherbottom)||
	(mytop < otherbottom && mybottom > otherbottom)||
	(mybottom > othertop && mytop < othertop)))
	{
      crash = true;
    }
    return crash;
  }
  
  //Prueft ob der Spielstein ein Hinderniss von rechts trifft
   this.crashRight = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (gamePieceHeight);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (gamePieceWidth);
	var myleft = this.x
    var otherleft = otherobj.x;
    var crash = false;
     if ((myright > otherleft) &&
	(myleft < otherleft) &&
	((mytop > othertop && mybottom < otherbottom)||
	(mybottom > othertop && mytop > othertop && mybottom < otherbottom)||
	(mytop < otherbottom && mybottom > otherbottom))) 
	{
      crash = true;
    }
    return crash;
  }
  
  // Prueft ob der Spielstein nach links,rechts oder oben kommt
    this.topSide = function(otherobj){
    var mybottom = this.y + (gamePieceHeight);
    var othertop = otherobj.y;
	var myright = this.x + (gamePieceWidth);
	var myleft = this.x
    var otherleft = otherobj.x;
	var otherright = otherobj.x + (otherobj.width);
	var left = distance(myleft + gamePieceWidth/2, mybottom,otherleft,othertop) <
	distance(myright + gamePieceWidth/2, mybottom,otherright,othertop);
	if (left){
		var point = myright; 
		if(point < otherleft){
			point = otherleft;
		}
		if(distance(myright, mybottom,point,othertop) <
		distance(myright, mybottom,otherleft,mybottom)){
			this.y = othertop - gamePieceHeight;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherleft - gamePieceWidth -delta;
		}
	}else{
		var point = myleft; 
		if(point > otherright){
			point = otherright;
		}
		if(distance(myleft, mybottom ,point,othertop) <
		distance(myleft ,mybottom,otherright,mybottom)){
			this.y = othertop - gamePieceHeight;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherright + delta;
		}
	}
}
// Prueft ob der Spielstein nach links,rechts oder unten kommt
  this.bottomSide = function(otherobj){
    var mytop = this.y;
    var mybottom = this.y + (gamePieceHeight);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (gamePieceWidth);
	var myleft = this.x
    var otherleft = otherobj.x;
	var otherright = otherobj.x + (otherobj.width);
	var left = distance(myleft + gamePieceWidth/2, mytop,otherleft,otherbottom) <
	distance(myright + gamePieceWidth/2, mytop,otherright,otherbottom);
	if (left){
		var point = myright; 
		if(point < otherleft){
			point = otherleft;
		}
		if(distance(myright, mytop,point,otherbottom) <
		distance(myright, mytop,otherleft,mytop)){
			this.y = otherbottom;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherleft - gamePieceWidth -delta;
		}
	}else{
		var point = myleft; 
		if(point > otherright){
			point = otherright;
		}
		if(distance(myleft, mytop ,point,otherbottom) <
		distance(myleft ,mytop,otherright,mytop)){
			this.y = otherbottom;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherright + delta;
		}
	}
 }
 
 this.deadlyCrash = function (){
	 for(i= 0; i < deadlyObstacles.length ; i++){
      if(deadlyObstacles[i].x < myGameArea.canvas.width +100){
	   if(this.crashBottom(deadlyObstacles[i]) || this.crashLeft(deadlyObstacles[i]) || 
	   this.crashRight(deadlyObstacles[i]) || this.crashTop(deadlyObstacles[i])){
		 gameOver = true;
	   }
	  }
	}
   return gameOver;
 }
 
 this.gotLoot = function(otherobj){
	 if(this.crashBottom(otherobj) || this.crashLeft(otherobj) || this.crashRight(otherobj) || this.crashTop(otherobj)){
		 lootPos();
		 score++;
		 difficultyModifier = max (10,difficultyModifier - 2);
		 
	 }
	 
 }
 
}

//Aktualisiert das gesamte Spielfeld
function updateGameArea() {
  if (myGamePiece.deadlyCrash()) {
    myGameArea.stop();
  } else{
  myGameArea.clear();
  myGameArea.frame += 1;
  for(i=0; i < myObstacles.length; i++){
  myObstacles[i].update();
  }
  if (myGameArea.frame == 1 || everyinterval(difficultyModifier)) {
	  newDeadly();
  }
  for(m=0; m < deadlyObstacles.length; m++){
  deadlyObstacles[m].x += deadlyObstacles[m].randomSpeed;
  deadlyObstacles[m].update();
  }
  myGamePiece.newPos();
  myGamePiece.update();
  loot.update();
  }
}

function newDeadly(){
    minSpawnHeight = 10;
    maxSpawnHeight = myGameArea.canvas.height-10;
    spawnHeight = Math.floor(Math.random()*(maxSpawnHeight-minSpawnHeight+1)+minSpawnHeight);
	minWidth = 10;
    maxWidth = 50;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
	minHeight = 10;
    maxHeight = 50;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	if(deadlyRight== false){
    deadlyObstacles.push(new component(width, height, "red", 0 - width, spawnHeight));
	deadlyRight= true;
	}else{
		deadlyObstacles.push(new component(width, height, "red", myGameArea.canvas.width, spawnHeight));
		deadlyRight = false;
	}
}

//Stellt die Hindernisse auf dem Spielfeld auf
function setObstacles(){
	myObstacles[0] = new component(40,40,"gray",gameWidth*(2/10)-20,gameHeight*(2/10)-20);
	myObstacles[1] = new component(120,20,"gray",gameWidth*(5/10)-60,gameHeight*(5/10)-100);
	myObstacles[2] = new component(40,40,"gray",gameWidth*(8/10)-20,gameHeight*(2/10)-20);
	myObstacles[3] = new component(40,40,"gray",gameWidth*(5/10)-20,gameHeight*(8/10)-20);
	myObstacles[4] = new component(20,20,"gray",gameWidth*(2/10)-10,gameHeight*(9/10)-10);
	myObstacles[5] = new component(20,20,"gray",gameWidth*(8/10)-10,gameHeight*(9/10)-10);
	myObstacles[6] = new component(30,100,"gray",gameWidth*(2.5/10),gameHeight*(5/10));
	myObstacles[7] = new component(30,100,"gray",gameWidth*(7/10),gameHeight*(5/10));
}

//Bewegungssteuerung des Spielsteins
function deviceMotionListener(event) {
	if (window.matchMedia("(orientation: landscape)").matches) {
       if(event.accelerationIncludingGravity.y > 0){
		   myGamePiece.speedX =(-1)* (Math.min(event.accelerationIncludingGravity.y,maxSpeed));
	}else{
     myGamePiece.speedX = (-1)*(Math.max(event.accelerationIncludingGravity.y,minSpeed));
	}
   }else{
	if (event.accelerationIncludingGravity.x > 0){
	myGamePiece.speedX = (-1)*(Math.min(event.accelerationIncludingGravity.x,maxSpeed));
	}else{
     myGamePiece.speedX =(-1)* (Math.max(event.accelerationIncludingGravity.x,minSpeed));
	}
  }
}

//Bewegt den Spielstein nach oben
function moveUp(){
	if(touchLock == false){
    touchLock = true;	
	myGamePiece.speedY = myGamePiece.speedY/10;
	myGamePiece.gravitySpeed = -1;
	timer = window.setInterval(moving,20);
	 }
	
}

//Bewegt den Spielstein nach oben
function moving(){
	myGamePiece.gravity = -0.1;
	
}

//Stoppt den Spielstein vom Steigen
function stopUp(){
	clearInterval(timer);
	touchLock = false;
    myGamePiece.gravitySpeed = myGamePiece.gravitySpeed/3;
	myGamePiece.gravity = 0.1;

}

//Entfernung zwischen zwei Punkten mit Phytagoras
function distance(x1, y1, x2, y2) {
         var dx = x1 - x2
		 var dy = y1 - y2;
         return Math.sqrt(dx * dx + dy * dy);
}
		

//Prueft ob das Geraet Bewegungssteuerung unterstuetzt
function checkAcc() {
 if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", deviceMotionListener,true);
      } else {
        alert("Sorry, your browser doesn't support Device Orientation");
      }
}
	  
function everyinterval(n) {
  if ((myGameArea.frame / n) % 1 == 0) {
	  return true;
	  }
  return false;
}	 

function lootPos(){
	minHeight = 10;
    maxHeight = myGameArea.canvas.height-10;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	minWidth = 20;
    maxWidth = myGameArea.canvas.width-20;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
	loot = new component(5,5,"lime",width,height);
	for(i=0; i < myObstacles.length; i++){	
	if (lootInside(loot,myObstacles[i])){
		 lootPos();
  }
 }
}
 
 //Schaut ob das Einsammelobjekt in einem Hinderniss drinnen ist
function lootInside(loot,obstacle){
	var mytop = loot.y;
    var mybottom = loot.y + (loot.height);
    var othertop = obstacle.y;
    var otherbottom = obstacle.y + (obstacle.height);
	var myright = loot.x + (loot.width);
	var myleft = loot.x
    var otherleft = obstacle.x;
	var otherright = obstacle.x + (obstacle.width);
	var inside = false;
	if(mytop > othertop - lootDelta && mybottom < otherbottom + lootDelta &&
	myright < otherright + lootDelta && myleft > otherleft - lootDelta){
		inside = true;
	}
	return inside;
}
	
  
	  
//Ruft das Spielfeld im Vollbildmodus auf	  	  
function fullscreen(){
	if(navigator.userAgent.match(/iPad/i) ||navigator.userAgent.match(/iPhone/i)){
          element = document.getElementById("start")
		  element.parentNode.removeChild(element);
		  startGame();
    } else{
        var el = document.documentElement;

           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else if(el.mozRequestFullScreen) {
             el.mozRequestFullScreen();
          }
		  else{
			  el.requestFullScreen();
		  }
		  element = document.getElementById("start")
		  element.parentNode.removeChild(element);
		  startGame();
		  var orient = window.screen.orientation;
		  orient.lock(orient.type);
		  //screen.orientation.lock(orient.type);
        }
}
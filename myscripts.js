var myGamePiece;
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

//Startet das Spiel mit dem Spielfeld 
function startGame() {
	myGamePiece = new component(10,10,"white", (window.innerWidth)/2,0);
	myGameArea.start();
	setObstacles();
	
}

//Eigenschaften und Funktionen des Spielfeldes
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {

    this.canvas.width = window.innerWidth; 
    this.canvas.height = window.screen.availHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
	this.frame = 0;
	this.canvas.addEventListener("touchstart", moveUp);
	this.canvas.addEventListener("touchend", stopUp);
	this.canvas.addEventListener("mousedown", moveUp);
	this.canvas.addEventListener("mouseup", stopUp);
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
	
	//Updatefunktion fuer jeden neuen Frame
this.update = function(){	
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
	if (lootGet == true){
		lootPos();
		lootGet = false;
	}
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
    var rockbottom = myGameArea.canvas.height - this.height;
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
    var rightEdge = myGameArea.canvas.width - this.width;
    if (this.x > rightEdge) {
      this.x = rightEdge;
	 // this.sideGravity = -(this.sideGravity * this.sideBounce);
    }
  }
  
  //Prueft ob der Spielstein ein Hinderniss von unten trifft
    this.crashBottom = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (this.width);
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
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
	var myright = this.x + (this.width);
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
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (this.width);
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
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (this.width);
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
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
	var myright = this.x + (this.width);
	var myleft = this.x
    var otherleft = otherobj.x;
	var otherright = otherobj.x + (otherobj.width);
	var left = distance(myleft + this.width/2, mybottom,otherleft,othertop) <
	distance(myright + this.width/2, mybottom,otherright,othertop);
	if (left){
		var point = myright; 
		if(point < otherleft){
			point = otherleft;
		}
		if(distance(myright, mybottom,point,othertop) <
		distance(myright, mybottom,otherleft,mybottom)){
			this.y = othertop - this.height;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherleft - this.width -delta;
		}
	}else{
		var point = myleft; 
		if(point > otherright){
			point = otherright;
		}
		if(distance(myleft, mybottom ,point,othertop) <
		distance(myleft ,mybottom,otherright,mybottom)){
			this.y = othertop - this.height;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}else{
			this.x = otherright + delta;
		}
	}
}
// Prueft ob der Spielstein nach links,rechts oder unten kommt
  this.bottomSide = function(otherobj){
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (this.width);
	var myleft = this.x
    var otherleft = otherobj.x;
	var otherright = otherobj.x + (otherobj.width);
	var left = distance(myleft + this.width/2, mytop,otherleft,otherbottom) <
	distance(myright + this.width/2, mytop,otherright,otherbottom);
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
			this.x = otherleft - this.width -delta;
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
 this.gotLoot = function(otherobj){
	 if(this.crashBottom || this.crashLeft || this.crashRight || this.crashTop){
		 lootGet = true;
	 }
	 
 }
 
}

//Aktualisiert das gesamte Spielfeld
function updateGameArea() {
  myGameArea.clear();
  for(i=0; i < myObstacles.length; i++){
  myObstacles[i].update();
  }
  myGamePiece.newPos();
  myGamePiece.update();
  loot.update();
 
}

//Stellt die Hindernisse auf dem Spielfeld auf
function setObstacles(){
	myObstacles[0] = new component(40,40,"gray",(myGameArea.canvas.width)*(2/10)-20,myGameArea.canvas.height*(2/10)-20);
	myObstacles[1] = new component(120,20,"gray",(myGameArea.canvas.width)*(5/10)-60,myGameArea.canvas.height*(5/10)-100);
	myObstacles[2] = new component(40,40,"gray",(myGameArea.canvas.width)*(8/10)-20,myGameArea.canvas.height*(2/10)-20);
	myObstacles[3] = new component(40,40,"gray",(myGameArea.canvas.width)*(5/10)-20,myGameArea.canvas.height*(8/10)-20);
	myObstacles[4] = new component(20,20,"gray",(myGameArea.canvas.width)*(2/10)-10,myGameArea.canvas.height*(9/10)-10);
	myObstacles[5] = new component(20,20,"gray",(myGameArea.canvas.width)*(8/10)-10,myGameArea.canvas.height*(9/10)-10);

}

//Bewegungssteuerung des Spielsteins
function deviceOrientationListener(event) {
	if (event.gamma > 0){
	myGamePiece.speedX = Math.min(event.gamma/5,maxSpeed);
	}else{
     myGamePiece.speedX = Math.max(event.gamma/5,minSpeed);
	}
}

//Bewegt den Spielstein nach oben
function moveUp(){
	myGamePiece.speedY = myGamePiece.speedY/10;
	myGamePiece.gravitySpeed = -1;
	timer = window.setInterval(moving,20); 
}

//Bewegt den Spielstein nach oben
function moving(){
	myGamePiece.gravity = -0.1;
	
}

//Stoppt den Spielstein vom Steigen
function stopUp(){
	clearInterval(timer);
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
 if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
      } else {
        alert("Sorry, your browser doesn't support Device Orientation");
      }
	  
	  
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
	  return true;
	  }
  return false;
}	 

function lootPos(){
	minHeight = 10;
    maxHeight = myGameArea.canvas.height-10;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	minWidth = 10;
    maxWidth = myGameArea.canvas.height-10;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
	loot = new component(5,5,getRandomColor(),width,height);
 }
 
 function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
  
	  
//Ruft das Spielfeld im Vollbildmodus auf	  	  
function fullscreen(){
        var el = document.documentElement;

           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }
		  element = document.getElementById("start")
		  element.parentNode.removeChild(element);
		  startGame();
        }

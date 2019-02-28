var myGamePiece;
var myObstacles = [];
//Startet das Spiel mit dem Spielfeld 
function startGame() {
    myGameArea.start();
	myGamePiece = new component(20,20,"blue", (myGameArea.canvas.width)/2,0);
	myObstacles[0] = new component(10,50,"red",(myGameArea.canvas.width)/2-100,myGameArea.canvas.height-50)
	//myObstacles[1] = new component(50,100,"red",(myGameArea.canvas.width)/2-50,300)
	//myObstacles[2] = new component(50,50,"red",(myGameArea.canvas.width)/2-100,280)
}
//Eigenschaften und Funktionen des Spielfeldes
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.outerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
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
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;  
	//Updatefunktion für jeden neuen Frame
this.update = function(){	
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
 }
 //Errechnet die Position des Spielsteins
 this.newPos = function() {
	this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
	this.hitBottom();
	this.hitLeft();
	this.hitRight();
	for(i=0; i < myObstacles.length; i++){
	if(myGamePiece.crashVertically(myObstacles[i])){
		this.y = myObstacles[i].y - myObstacles[i].height;
		this.gravitySpeed = 0;
	}
	/*if(myGamePiece.crashLeft(myObstacles[i])){
		this.x = myObstacles[i].x + myObstacles[i].width; 
	}
	 if(myGamePiece.crashRight(myObstacles[i])){
		 this.x = myObstacles[i].x - this.x;
	 }*/
	}
  }
  //Prüft ob der Spielstein den Boden des spielfeldes trifft
  this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
    }
  }
  //Prüft ob der Spielstein den linken Rand trifft 
  this.hitLeft = function() {
    var leftEdge = 0;
    if (this.x < leftEdge) {
      this.x = leftEdge;
    }
  }
  //Prüft ob der Spielstein den rechten Rand trifft
  this.hitRight = function() {
    var rightEdge = myGameArea.canvas.width - this.width;
    if (this.x > rightEdge) {
      this.x = rightEdge;
    }
  }
  //Prüft ob der Spielstein ein Hinderniss von oben trifft
   this.crashVertically = function(otherobj) {
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom)) {
      crash = false;
    }
    return crash;
  }
  //Prüft ob der Spielstein ein Hinderniss von links trifft
  this.crashLeft = function(otherobj) {
	var mytop = this.y;
    var mybottom = this.y + (this.height);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
	var myright = this.x + (this.width);
    var otherleft = otherobj.x;
    var crash = true;
    if ((myright < otherleft)&& (mytop > othertop) && (mybottom < otherbottom ) ) {
      crash = false;
    }
    return crash;
  }
  //Prüft ob der Spielstein ein Hinderniss von rechts trifft
   this.crashRight = function(otherobj) {
	var myleft = this.x;
    var otherright = otherobj.x + (otherobj.width);
    var crash = true;
    if ((myleft > otherright) && (mytop > othertop) && (mybottom < otherbottom ) ) {
      crash = false;
    }
    return crash;
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
 
}
//Bewegungssteuerung des Spielsteins
function deviceOrientationListener(event) {
	myGamePiece.speedX = event.gamma/3;
}
//Prüft ob das Gerät Bewegungssteuerung unterstützt
 if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
      } else {
        alert("Sorry, your browser doesn't support Device Orientation");
      }
//Ruft das Spielfeld im vollbildmodus auf	  	  
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

    

function startGame() {
    myGameArea.start();
	myGamePiece = new component(30,30,"blue", (myGameArea.canvas.width)/2, 10);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 500;
    this.canvas.height = 1000;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
	this.speedX=0;
	this.speedY=0;
    this.x = x;
    this.y = y;  
this.update = function(){	
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
 }
 this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  } 
}

function updateGameArea() {
  myGameArea.clear();
  
  myGamePiece.newPos();
  myGamePiece.update();
}

function deviceOrientationListener(event) {
	myGamePiece.speedX = event.gamma/10;
}

 if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
      } else {
        alert("Sorry, your browser doesn't support Device Orientation");
      }
	  
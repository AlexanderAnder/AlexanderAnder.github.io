
function startGame() {
    myGameArea.start();
	myGamePiece = new component(30,30,"blue", (myGameArea.canvas.width)/2,0);
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
	  
	   var width = this.canvas.width;
            var height = this.canvas.height;        
            //canvas.webkitRequestFullScreen();                
			ratio = width / height;
            //Höhe und Breite passend zum Seitenverhältnis

            var heightval;
            var widthval;
			//innerWidth/innerHeight < 4:3
			if ((innerWidth / innerHeight) < ratio) {
				//Scrollbalken verhindern => -16
				widthval = window.innerWidth - 16;
				heightval = (widthval / ratio) - 16;
                this.canvas.style.height = heightval + "px";
                this.canvas.style.width = widthval + "px";
            //innerWidth/innerHeight >= 4:3
			} else {
				heightval = window.innerHeight - 16;
				widthval = (heightval * ratio) - 16;
                this.canvas.style.height = heightval + "px";
                this.canvas.style.width = widthval + "px";
			}		


   // this.canvas.width = window.innerWidth*devicePixelRatio;
    //this.canvas.height = window.innerHeight*devicePixelRatio-10;
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
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;  
	
this.update = function(){	
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
 }
 
 this.newPos = function() {
	this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
	this.hitBottom();
	this.hitLeft();
	this.hitRight();
  }
  
  this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
    }
  }
  this.hitLeft = function() {
    var leftEdge = 0;
    if (this.x < leftEdge) {
      this.x = leftEdge;
    }
  }
  this.hitRight = function() {
    var rightEdge = myGameArea.canvas.width - this.width;
    if (this.x > rightEdge) {
      this.x = rightEdge;
    }
  }
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.newPos();
  myGamePiece.update();
}

function deviceOrientationListener(event) {
	myGamePiece.speedX = event.gamma/3;
}

 if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", deviceOrientationListener);
      } else {
        alert("Sorry, your browser doesn't support Device Orientation");
      }
	  	  
function fullscreen(){
        var el = myGameArea.canvas;

           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
        }

    myGameArea.canvas.addEventListener("click",fullscreen)
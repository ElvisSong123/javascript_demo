
 
 var content = document.getElementsByClassName('content')[0];
 var scorecount = document.getElementsByClassName('score-count')[0];
 var lostgame = document.getElementsByClassName('lostGame')[0];
 var finalscore = document.getElementsByClassName('final-score')[0];
 var cancel = document.getElementsByClassName('cancel')[0];
 var leftside = document.getElementsByClassName('left-side')[0];
 var startgame = document.getElementsByClassName('startGame')[0];
 var startPng = document.getElementsByClassName('startPng')[0];
 var startpause = document.getElementsByClassName('start-pause')[0];

init();

function init(){

this.contentWidth = parseInt(getComputedStyle(content,null).width);
this.contentheight = parseInt(getComputedStyle(content,null).height);
this.foodwidth = 20;
this.foodheight = 20;
this.foodX = 0;
this.foodY = 0;
this.maincontent = content;
this.snakeBody = [[4,2,"head"],[3,2,'body'],[2,2,'body']];
this.snakeW = 20;
this.snakeH = 20;
this.direct = 'right';
this.left = false;
this.right = false;
this.up = true;
this.down = true;
this.setMove;
this.speed = 200;
this.score = 0;
this.startgamebool = true;
this.startpausebool = true;

// startGame();

trigger();


}

function startGame(){
    startgame.style.display = "none";
    leftside.style.display = "block";
	food();
	snake();

	
	
}

function food(){
	var food = document.createElement('div');
	food.style.position = 'absolute';
	food.style.width = this.foodwidth + "px";
    food.style.height = this.foodheight + "px";
	this.foodX　=　Math.floor(Math.random() * (this.contentWidth/ 20));
	this.foodY =  Math.floor(Math.random() * (this.contentheight/ 20));
    food.style.left = (this.foodX) * 20  + "px";
    food.style.top = (this.foodY) * 20  + "px";
    
    this.maincontent.appendChild(food).setAttribute('class','food');
  

    
}

function snake(){
	for(var i = 0; i < this.snakeBody.length; i++){
		var snake = document.createElement('div');
		snake.style.width = this.snakeW + "px";
		snake.style.height = this.snakeH + "px";
		snake.style.position = "absolute";
		snake.style.left = this.snakeBody[i][0] * 20 + "px";
		snake.style.top =  this.snakeBody[i][1] * 20 + "px";
		snake.classList.add(this.snakeBody[i][2]);
		this.maincontent.appendChild(snake).classList.add('snake');
		switch(this.direct){
          case "right":
              break;
          case "left":
              snake.style.transform = "rotate(180deg)";
              break;
          case "up":
              snake.style.transform = "rotate(270deg)";
              break;
          case "down":
              snake.style.transform = "rotate(90deg)";
              break;
		}
  }
}


 function move(){
 	for(var i = this.snakeBody.length -1; i > 0 ; i --){
 		this.snakeBody[i][0] = this.snakeBody[i - 1][0];
 		this.snakeBody[i][1] = this.snakeBody[i - 1][1];
}
   switch(this.direct){
   	case 'right':
   	     this.snakeBody[0][0] ++;
   	     break;
   	case 'left':
   	     this.snakeBody[0][0] --;
   	     break;
   	case 'up':
   	     this.snakeBody[0][1] --;
   	     break;
    case 'down':
         this.snakeBody[0][1] ++;
         break;
    default:
          break;



   }   
   removeClass('snake');
   snake();
   if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY){
         var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
         var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
         switch(this.direct){
         	case "right":
         	   this.snakeBody.push([snakeEndX - 1,snakeEndY,"body"]);
         	   break;
         	case "left":
         	   this.snakeBody.push([snakeEndX + 1,snakeEndY,"body"]);
         	   break;
         	case "up":
         	   this.snakeBody.push([snakeEndX,snakeEndY+1,"body"]);
         	   break;
         	case "down":
         	   this.snakeBody.push([snakeEndX + 1,snakeEndY-1,"body"]);
         	   break;
         	 default:
         	 break;

         }

         this.score += 1;
          
         scorecount.innerHTML = this.score; 
         
         removeClass('food');
         food(); 
     }
     if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] > this.contentWidth/20){
     	reloadGame();
     }
     if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] > this.contentheight/20){
     	reloadGame();
     }
     var snakeHeadX = this.snakeBody[0][0];
     var snakeHeadY = this.snakeBody[0][1];

     for(var i = 1 ; i < this.snakeBody.length;i++){
     	if(snakeHeadX == this.snakeBody[i][0] && snakeHeadY == this.snakeBody[i][1]){
     		reloadGame();
     	}

     }
 }

 function reloadGame(){
 	removeClass('snake');
 	removeClass('food');
 	lostgame.style.display = "block";
    finalscore.innerHTML = this.score; 
    clearInterval(setMove);
    this.snakeBody = [[4,2,"head"],[3,2,'body'],[2,2,'body']];
    this.direct = 'right';
	this.left = false;
	this.right = false;
	this.up = true;
	this.down = true;
	this.score = 0;
	this.startpausebool = true;
	this.startgamebool = true;
	startpause.setAttribute('src','start.png');

 }

 function removeClass(className){
   var ele = document.getElementsByClassName(className);
   while(ele.length > 0){
   	ele[0].remove();
   }

 }

function trigger(){


cancel.onclick = function(){
	lostgame.style.display = "none";
	scorecount.innerHTML = 0;
	

}
leftside.onclick = function(){

}
startPng.onclick = function(){
	startAndPause();

}
startpause.onclick = function(){
	startAndPause();

	

}



}

function startAndPause(){
if(this.startpausebool == true){
	if(this.startgamebool == true){
		startGame();
		this.startgamebool = false;
	}
 startpause.setAttribute('src','pause.png');
 document.onkeydown = function(e){
      var code = e.keyCode;
      
      setDerict(code);
}
	setMove = setInterval(function(){
		move();
	},speed);
 this.startpausebool = false;
}else{
	startpause.setAttribute('src','start.png');
	clearInterval(setMove);
	document.onkeydown = function(e){
       e.returnValue = false;
       return false;
	}
	startpausebool = true;

}


}

function setDerict(keyC){
	switch(keyC){
		case 37:
		   if(this.left){
		   	this.left = false;
		   	this.right = false;
		   	this.up = true;
		   	this.down = true;
		   	this.direct = "left";
		   }
		   break;
		case 38:
		   if(this.up){
		   	this.left = true;
		   	this.right = true;
		   	this.up = false;
		   	this.down = false;
		   	this.direct = "up";
		   }
		   break;
		case 39:
		   if(this.right){
		   	this.left = false;
		   	this.right = false;
		   	this.up = true;
		   	this.down = true;
		   	this.direct = "right";
		   }
		   break;
		 case 40:
		   if(this.down){
		   	this.left = true;
		   	this.right = true;
		   	this.up = false;
		   	this.down = false;
		   	this.direct = "down";
		   }
		   break;
		  default:
		   break;
	}

}


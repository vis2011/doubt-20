/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;
var coinGroup , coin , cImage;
var reGroup , gGroup;

var score=0;

var lifetime = 3;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("kangaroo1.png","kangaroo2.png","kangaroo3.png");
  kangaroo_collided = loadAnimation("kangaroo1.png");
  jungleImage = loadImage("bg.png");
  shrub1 = loadImage("shrub1.png");
  shrub2 = loadImage("shrub2.png");
  shrub3 = loadImage("shrub3.png");
  obstacle1 = loadImage("stone.png");
  cImage = loadImage("gc.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
  moneySound = loadSound("money.mp3");
  shrubsSound = loadSound("shrubs.mp3");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  kangaroo.setCollider("circle",0,0,300)

  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver=createSprite(width/2,width/2-300);
  gameOver.addImage(gameOverImg);
  gameOver.visible=false;

  restart=createSprite(width/2,width/2-200);
  restart.addImage(restartImg);
  restart.visible = false;

  restart.scale=0.15;
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  coinGroup= new Group();
  reGroup=new Group();
  gGroup=new Group();
  score=0
}

function draw() {
  background(255);

  // kangaroo.x=camera.positionX-270;
  // kangaroo.x=Camera.position.x-270;
   kangaroo.x=camera.position.x-270;
   //kangaroo.x=Camera.Position.X-270;

  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }

    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();
    GoldCoin();

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      obstaclesGroup.destroyEach();
      lifetime=lifetime-1
    }

    if(coinGroup.isTouching(kangaroo))[
      coinGroup.destroyEach(),
      score=score+1,
      moneySound.play()
    ]

    if(score === 3){
      lifetime=lifetime+1;
      score=0
    }

    if(shrubsGroup.isTouching(kangaroo)){
      lifetime=lifetime+0.5
      shrubsGroup.destroyEach();
      shrubsSound.play();
    }
  
 if (lifetime===0 || lifetime<0) {
    
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    gameOver.visible= true;
    restart.visible = true;
    kangaroo.changeAnimation("collided",kangaroo_collided);


 }
 
  }
  if(mousePressedOver(restart)) {
    handlerestart();
}
  drawSprites();
  fill("black");
  stroke("white");
  strokeWeight(4);
  textSize(30);
  text("score:"+score,90,30);
  text("lifetime :"+lifetime,500,30);

}

/*function reset(){
  gameState = PLAY;
  gameOver.visible = true;
  restart.visible = true;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running",
                kangaroo_running);
  obstaclesGroup.Each();
  shrubsGroup.destroyEach();
  score = 0;
}*/

function handlerestart(){
  gameState = PLAY;
}

/*function handlerestart(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running",
               kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  score = 0;
}*/


function spawnShrubs() {

  if (frameCount % 150 === 0) {

    // var shrub = createSprite(camera.position+500,330,40,10);
     var shrub = createSprite(camera.position.x+500,330,40,10);
    // var shrub = createSprite(camera.positionX+500,330,40,10);
    // var shrub = createSprite(Camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
         
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function GoldCoin() {
  if(frameCount % 160 === 0) {

     var coin = createSprite(camera.position.x+400,200,40,40);

    coin.setCollider("rectangle",0,0,200,200)
    coin.addImage(cImage);
   coin.velocityX = -(6 + 3*score/100)
    coin.scale = 0.15;   
 
    coin.lifetime = 400;
    coinGroup.add(coin);
    
  }
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    // var obstacle = createSprite(camera.Position.X+400,330,40,40);
    // var obstacle = createSprite(Camera.Position.x+400,330,40,40);
     var obstacle = createSprite(camera.position.x+400,330,40,40);
    // var obstacle = createSprite(camera.position.x.400,330,40,40);

    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;   
 
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
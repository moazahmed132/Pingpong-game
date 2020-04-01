const canvas = document.getElementById("pong");
console.log("canvas", canvas)
const context = canvas.getContext("2d");
console.log("context", context);

// function to draw the rectangular shape 
drawRect = (x, y, w, h, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

// function to draw the circle

drawCircle = (x, y, r, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();

}

// function to draw text 

drawText = (text, x, y, color) => {
  context.fillStyle = color;
  context.font = "75px fantasy"
  context.fillText(text, x, y);

}

// create user & computer paddles

// user object 

const user = {
  x: 0,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
  score: 0
}

// computer object 

const com = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: 100,
  color: "white",
  score: 0
}

// net object
const net = {
  x: canvas.width / 2 - 2 / 2,
  y: 0,
  width: 2,
  height: 10,
  color: "white"
}
// function to draw the net 


// ball object
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "white"

}
drawNet = () => {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}
// function to reset the ball after anyone wins
resetBall = () => {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
}


// function to know if the ball hit the paddle
// b for ball and p for paddle


render = () => {

  // color the canvas
  drawRect(0, 0, canvas.width, canvas.height, "black");
  // draw the net
  drawNet();
  //draw the ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  // draw the score of user
  drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
  // draw the score of the computer
  drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "white");
  // draw the user paddle
  drawRect(user.x, user.y, user.width, user.height, user.color);
  //draw the computer paddle
  drawRect(com.x, com.y, com.width, com.height, com.color);

}


// function to move the paddle
movePaddle = (event) => {
  let rect = canvas.getBoundingClientRect();
  user.y = event.clientY - rect.top - user.height / 2;

}
canvas.addEventListener("mousemove", movePaddle);


collision = (b, p) => {
  // paddle edges detection
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  // ball edges detection 
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.right = b.x + b.radius;
  b.left = b.x - b.radius;

  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}
update = () => {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  let computerLevel = .1;
  com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

  // condition if the ball hit edges
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = (ball.x < canvas.width / 2) ? user : com;
  if (collision(ball, player)) {
    let collidePoint = (ball.y - (player.y + player.height / 2));
    collidePoint = collidePoint / (player.height / 2) // to make it between 1 : -1
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = (ball.x < canvas.width / 2) ? 1 : -1;

    ball.velocityX = direction * ball.speed * (Math.cos(angleRad));
    ball.velocityY = direction * ball.speed * (Math.sin(angleRad));

    ball.speed += .5;
  }
  if (ball.x - ball.radius < 0) {

    com.score++;
    console.log("update -> com.score", com.score)
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}






Game = () => {
  render();
  update();
}
const framePerSecond = 50;
setInterval(Game, 1000 / framePerSecond);

document.addEventListener("DOMContentLoaded", function(){
  //let newMusic = new Audio('./assets/blipStream.mp3')
  //newMusic.play()
})

//Global Variables
let DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
}

let rounds = [5, 5, 3, 3, 2]
let colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6']

//Create & Add Images
let player1a = new Image()
player1a.src = "./assets/miniPlayer.png"

let player2a = new Image()
player2a.src = "./assets/miniPlayer.png"

// Music
//let newMusic = new Audio("./assets/blipStream.mp3")


//Ball object
let Ball = {
  new: function(incredmentedSpeed){
    return{
      width: 18,
      height: 18,
      x: (this.canvas.width/2) - 9,
      y: (this.canvas.height/2) - 9,
      moveX: DIRECTION.IDLE,
      moveY: DIRECTION.IDLE,
      speed: incredmentedSpeed || 9
    }
  }
}

//Paddle object
let Paddle = {
  new: function(side){
    return {
      width: 18,
      height: 70,
      x: side === 'left' ? 150 : this.canvas.width - 150,
      y: (this.canvas.height/2) - 35,
      score: 0,
      moveY: DIRECTION.IDLE,
      speed: 12,

    }
  }
}

//MiniPlayers object
let MiniPlayer = {
  new: function(side){
    return {
      width: 35,
      height: 50,
      x: side === 'left' ? 50 : this.canvas.width - 50,
      y: (this.canvas.height/2) - 35,
      moveY: DIRECTION.IDLE,
      speed: 5,
      lives: 2
    }
  }
}

//creating bullets
let Bullet = {
  new: function(side){
    return{
      width: 40,
      height: 12,
      x: side === 'left' ? 150 : this.canvas.width - 175,
      y: (this.canvas.height/2) - 5,
      move: DIRECTION.IDLE,
      speed: 20
    }
  }
}

let Game = {
  initialize: function(){

    this.canvas = document.querySelector('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = 1400
    this.canvas.height = 1000

    this.canvas.style.width = (this.canvas.width/2) + 'px'
    this.canvas.style.height = (this.canvas.height/2) + 'px'

    //add players
    this.player1 = Paddle.new.call(this, 'left')
    this.player2 = Paddle.new.call(this, 'right')
    //add miniplayers
    this.player1a = MiniPlayer.new.call(this, 'left')
     // this.player1a = new Image();
    // this.player1a.src = "./Images/miniPlayer.png"
    this.player2a = MiniPlayer.new.call(this, 'right')
    //add bullets
    this.bullet1 = Bullet.new.call(this, 'left')
    this.bullet2 = Bullet.new.call(this, 'right')


    //add ball
    this.ball = Ball.new.call(this)

    this.running = this.over = false
    this.turn = this.player2
    this.timer = this.round = 0
    this.color = '#2c3e50'

    Pong.menu()
    Pong.listen()
  },

  endGameMenu: function(text){
    //change the canvas font size and color
    Pong.context.font = '50px Courier New'
    Pong.context.fillStyle = this.color

    //draw the rectangle behind the 'Press space to begin' text
    Pong.context.fillRect(
      Pong.canvas.width/2 - 350,
      Pong.canvas.height/2 - 48,
      700,
      100
    )
    //change the canvas color
    Pong.context.fillStyle = '#ffffff'
    //draw the end game menu text
    Pong.context.fillText(
      text,
      Pong.canvas.width/2,
      Pong.canvas.height/2 + 15
    )

    setTimeout(function(){
      Pong = Object.assign({}, Game)
      Pong.initialize()
    }, 3000)
  },
  menu: function(){
    //draw all Pong objects in their current state
    Pong.draw()

    //change font size and color
    this.context.font = '50px Courier New'
    this.context.fillStyle = this.color
    //draw rectangle behind 'press any key to begin' text
    this.context.fillRect(
      this.canvas.width/2 - 350,
      this.canvas.height/2 - 48,
      700,
      100
    )
    //change canvas color
    this.context.fillStyle = '#ffffff'
    //draw 'press any key to begin' text
    this.context.fillText(
      'Press space to begin',
      this.canvas.width/2,
      this.canvas.height/2 + 15
    )
  },

  //Update all objects (move players, ball, increment score, etc)
  update: function(){
    if(!this.over){
      //if the ball collides with bound limits - correct x and y coords
      if(this.ball.x <= 0){
        console.log("left edge")
        Pong._resetTurn.call(this, this.player2, this.player1)
        this.color = this._generateRoundColor()
      }
      if(this.ball.x >= this.canvas.width - this.ball.width){
        //debugger
        console.log("right edge")
        Pong._resetTurn.call(this, this.player1, this.player2)
        this.color = this._generateRoundColor()
      }
      if(this.ball.y <= 0){
        console.log("top")
        this.ball.moveY = DIRECTION.DOWN
      }
      if(this.ball.y >= this.canvas.height){
        console.log("bottom")
        this.ball.moveY = DIRECTION.UP
      }

      //controll MiniPlayer collision with bound limits
      if(this.player1a.y <= 0){
        this.player1a.moveY = DIRECTION.DOWN
      }
      if(this.player1a.y >= this.canvas.height - this.player1a.height){
        this.player1a.moveY = DIRECTION.UP
      }

      if(this.player2a.y <= 0){
        this.player2a.moveY = DIRECTION.DOWN
      }
      if(this.player2a.y >= this.canvas.height - this.player2a.height){
        this.player2a.moveY = DIRECTION.UP
      }

      //PLAYER 1 MOVE
      //move player if the player.move value was updated by a keyboard event
      if(this.player1.move === DIRECTION.UP){
        this.player1.y -= this.player1.speed
        if(this.bullet1.move === DIRECTION.IDLE){
          this.bullet1.y -= this.player1.speed
        } else if(this.bullet1.move === DIRECTION.LEFT){
          this.bullet1.y = this.bullet1.y
        }
      } else if(this.player1.move === DIRECTION.DOWN){
        this.player1.y += this.player1.speed
        if(this.bullet1.move === DIRECTION.IDLE){
          this.bullet1.y += this.player1.speed
        } else if(this.bullet1.move === DIRECTION.LEFT){
          this.bullet1.y = this.bullet1.y
        }
      }
      //MiniPlayer1 move
      if(this.player1a.move === DIRECTION.UP){
        this.player1a.y -= this.player1a.speed
      } else if(this.player1a.move === DIRECTION.DOWN){
        this.player1a.y += this.player1a.speed
      }

      //PLAYER 2 MOVE
      if(this.player2.move === DIRECTION.UP){
        this.player2.y -= this.player2.speed
        if(this.bullet2.move === DIRECTION.IDLE){
          this.bullet2.y -= this.player2.speed
        } else if(this.bullet2.move === DIRECTION.RIGHT){
          this.bullet2.y = this.bullet2.y
        }
      } else if(this.player2.move === DIRECTION.DOWN){
        this.player2.y += this.player2.speed
        if(this.bullet2.move === DIRECTION.IDLE){
          this.bullet2.y += this.player2.speed
        } else if(this.bullet2.move === DIRECTION.RIGHT){
          this.bullet2.y = this.bullet2.y
        }
      }
      //MiniPlayer2 move
      if(this.player2a.move === DIRECTION.UP){
        this.player2a.y -= this.player2a.speed
      } else if(this.player2a.move === DIRECTION.DOWN){
        this.player2a.y += this.player2a.speed
      }

      //on new serve(start of each turn) move the ball to the correct side
      //randomize direction to add challenge
      if(Pong._turnDelayIsOver.call(this) && this.turn){
        this.ball.moveX = this.turn === this.player1 ? DIRECTION.LEFT : DIRECTION.RIGHT
        this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())]
        this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200

        //start MiniPlayers moving
        this.player1a.moveY = DIRECTION.UP
        this.player2a.moveY = DIRECTION.DOWN

        this.turn = null
      }

      //PLAYER 1 COLLISION
      if(this.player1.y <= 0){
        this.player1.y = 0
        this.bullet1.y = 30
      } else if(this.player1.y >= (this.canvas.height - this.player1.height)){
        this.player1.y = (this.canvas.height - this.player1.height)
        this.bullet1.y = (this.canvas.height - 40)
      }
      //PLAYER 2 COLLISION
      if(this.player2.y <= 0){
        this.player2.y = 0
        this.bullet2.y = 30
      } else if(this.player2.y >= (this.canvas.height - this.player2.height)){
        this.player2.y = (this.canvas.height - this.player2.height)
        this.bullet2.y = (this.canvas.height - 40)
      }
      //move ball in intended direction based on moveX and moveY values
      if(this.ball.moveY === DIRECTION.UP){
        this.ball.y -= (this.ball.speed/1.5)
      } else if(this.ball.moveY === DIRECTION.DOWN){
        this.ball.y += (this.ball.speed/1.5)
      }
      if(this.ball.moveX === DIRECTION.LEFT){
        this.ball.x -= this.ball.speed
      } else if(this.ball.moveX === DIRECTION.RIGHT){
        this.ball.x += this.ball.speed
      }

      //move MiniPlayers based on moveY value
      if(this.player1a.moveY === DIRECTION.UP){
        this.player1a.y -= this.player1a.speed
      } else if(this.player1a.moveY === DIRECTION.DOWN){
        this.player1a.y += this.player1a.speed
      }

      if(this.player2a.moveY === DIRECTION.UP){
        this.player2a.y -= this.player2a.speed
      } else if(this.player2a.moveY === DIRECTION.DOWN){
        this.player2a.y += this.player2a.speed
      }

      //handle player-ball collisions
      //PLAYER 1
      if (this.ball.x - this.ball.width <= this.player1.x && this.ball.x >= this.player1.x - this.player1.width) {
				if (this.ball.y <= this.player1.y + this.player1.height && this.ball.y + this.ball.height >= this.player1.y) {
					this.ball.x = (this.player1.x + this.ball.width);
          console.log("ball with player1")
					this.ball.moveX = DIRECTION.RIGHT;
        }
      }
      //PLAYER 2
      if (this.ball.x - this.ball.width <= this.player2.x && this.ball.x >= this.player2.x - this.player2.width) {
				if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
					this.ball.x = (this.player2.x - this.ball.width);
          console.log("ball with player2")
					this.ball.moveX = DIRECTION.LEFT;
        }
      }

      //move bullet based on direction
      if(this.bullet1.move === DIRECTION.LEFT){
        this.bullet1.x += this.bullet1.speed
      }
      if(this.bullet2.move === DIRECTION.RIGHT){
        this.bullet2.x -= this.bullet2.speed
      }

      //MiniPlayer collisions with bullet
      if(this.bullet1.x - this.bullet1.width >= this.player2a.x && this.bullet1.y + this.bullet1.height >= this.player2a.y){
        if(this.bullet1.y <= this.player2a.y + this.player2a.height){
          console.log("player2 hit")
          this.player2a.lives -= 1
          console.log(`${this.player2a.lives}`)
          this.bullet1.x = (this.player1.x + this.player1.width)
          this.bullet1.y = (this.player1.y + (this.player1.height/2))
          this.bullet1.move = DIRECTION.IDLE
          this.player1.score += 5
        }
      }
      //bullet2
      if(this.bullet2.x <= this.player1a.x && this.bullet2.y + this.bullet2.height >= this.player1a.y){
        if(this.bullet2.y <= this.player1a.y + this.player1a.height){
          console.log("player1 hit")
          this.player1a.lives -= 1
          console.log(`${this.player1a.lives}`)
          //debugger
          this.bullet2.x = (this.player2.x - this.player2.width)
          this.bullet2.y = (this.player2.y + (this.player2.height/2))
          this.bullet2.move = DIRECTION.IDLE
          this.player2.score += 5
        }
      }

      //bullet goes off screen
      if(this.bullet1.x - this.bullet1.width >= this.canvas.width){
        console.log("bullet1 miss")
        console.log(`${this.player2a.lives}`)
        this.bullet1.x = (this.player1.x + this.player1.width)
        this.bullet1.y = (this.player1.y + (this.player1.height/2))
        this.bullet1.move = DIRECTION.IDLE
      }
      //bullet2
      if(this.bullet2.x - this.bullet2.width <= 0){
        console.log("bullet2 miss")
        console.log(`${this.player1a.lives}`)
        this.bullet2.x = (this.player2.x - this.player2.width)
        this.bullet2.y = (this.player2.y + (this.player2.height/2))
        this.bullet2.move = DIRECTION.IDLE
      }

      //bullet collision paddle
      if(this.bullet1.x - this.bullet1.width >= this.player2.x && this.bullet1.y + this.bullet1.height >= this.player2.y){
        if(this.bullet1.y <= this.player2.y + this.player2.height){
          console.log("player2 shielded")
          console.log(`${this.player2a.lives}`)
          this.bullet1.x = (this.player1.x + this.player1.width)
          this.bullet1.y = (this.player1.y + (this.player1.height/2))
          this.bullet1.move = DIRECTION.IDLE
        }
      }
      //bullet2
      if(this.bullet2.x <= this.player1.x && this.bullet2.y + this.bullet2.height >= this.player1.y){
        if(this.bullet2.y <= this.player1.y + this.player1.height){
          console.log("player1 shielded")
          console.log(`${this.player1a.lives}`)
          this.bullet2.x = (this.player2.x - this.player2.width)
          this.bullet2.y = (this.player2.y + (this.player2.height/2))
          this.bullet2.move = DIRECTION.IDLE
        }
      }
    }

    //handle end of round transition (THIS WILL HAVE TO BE CHANGED)
    //check to see if player1 won the round
    if(this.player2a.lives === 0){
      //debugger
      this.over = true
      if(this.player1.score > this.player2.score){
        setTimeout(function(){
          Pong.endGameMenu('Player 1 Wins!')
        }, 1000)
      } else if(this.player1.score < this.player2.score){
        setTimeout(function(){
          Pong.endGameMenu('Player 2 Wins!')
        }, 1000)
      } else {
        setTimeout(function(){
          Pong.endGameMenu('Tie!')
        }, 1000)
      }
    } else if(this.player1a.lives === 0){
      this.over = true
      if(this.player2.score > this.player1.score){
        setTimeout(function(){
          Pong.endGameMenu('Player 2 Wins!')
        }, 1000)
      } else if(this.player2.score < this.player1.score){
        setTimeout(function(){
          Pong.endGameMenu('Player 1 Wins!')
        }, 1000)
      } else {
        setTimeout(function(){
          Pong.endGameMenu('Tie!')
        }, 1000)
      }
    }
  },

  //Draw objects to canvas element
  draw: function(){
    //clear the canvas
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    //set fill style to black
    this.context.fillStyle = this.color
    //draw the background
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    //set fill style to wite for paddles and ball
    this.context.fillStyle = '#ffffff'

    //draw player1
    this.context.fillRect(
      this.player1.x,
      this.player1.y,
      this.player1.width,
      this.player1.height
    )


    //draw MiniPlayer1
    this.context.drawImage(
      player1a,

      this.player1a.x,
      this.player1a.y,
      this.player1a.width,
      this.player1a.height
    )
    //draw bullet1
    this.context.fillRect(
      this.bullet1.x,
      this.bullet1.y,
      this.bullet1.width,
      this.bullet1.height
    )

    // draw player2
    this.context.fillRect(
      this.player2.x,
      this.player2.y,
      this.player2.width,
      this.player2.height
    )
    //draw MiniPlayer2
    this.context.drawImage(
      player2a,
      this.player2a.x,
      this.player2a.y,
      this.player2a.width,
      this.player2a.height
    )
    //draw bullet2
    this.context.fillRect(
      this.bullet2.x,
      this.bullet2.y,
      this.bullet2.width,
      this.bullet2.height
    )

    //draw ball
    if(Pong._turnDelayIsOver.call(this)){
      this.context.fillRect(
        this.ball.x,
        this.ball.y,
        this.ball.width,
        this.ball.height
      )
    }

    //draw the net (dotted line in the middle)
    this.context.beginPath()
    this.context.setLineDash([7, 15])
    this.context.moveTo((this.canvas.width/2), this.canvas.height - 140)
    this.context.lineTo((this.canvas.width/2), 140)
    this.context.lineWidth = 10
    this.context.strokeStyke = '#ffffff'
    this.context.stroke()

    //set default canvas font and alight it to center
    this.context.font = '100px Courier New'
    this.context.textAlign = 'center'

    //draw player1 score (left)
    this.context.fillText(
      this.player1.score.toString(),
      (this.canvas.width/2) - 300,
      200
    )

    //draw player2 score (right)
    this.context.fillText(
      this.player2.score.toString(),
      (this.canvas.width/2) + 300,
      200
    )

    //change font size for center score text
    this.context.font = '30px Courier New'

    //draw winning score(center)
    this.context.fillText(
      'Round ' + (Pong.round + 1),
      (this.canvas.width/2),
      35
    )

    //change font size for center score value
    this.context.font = '40px Courier'

    //draw current round number
    this.context.fillText(
      rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round -1],
      (this.canvas.width/2),
      100
    )
  },

  loop: function(){
    Pong.update()
    Pong.draw()

    //if the game is not over, draw the next frame
    if(!Pong.over){
      requestAnimationFrame(Pong.loop)
    }
  },

  listen: function(){
    document.addEventListener('keydown', function(key){
      //handle pressing key to start
      if(key.keyCode == 32){
        if(Pong.running === false){
          Pong.running = true
          window.requestAnimationFrame(Pong.loop)
          //newMusic.play()
        }
      }

      //CONTROLS
      if(Pong.running === true){
        //player1
        if(key.keyCode === 87){
          Pong.player1.move = DIRECTION.UP
        } else if(key.keyCode === 83){
          Pong.player1.move = DIRECTION.DOWN
        }
        //fire bullet
        if(key.keyCode === 68){
          console.log("d pressed")
          Pong.bullet1.move = DIRECTION.LEFT
          console.log("bullet1 fired")
        }

        //player2
        if(key.keyCode === 80){
          Pong.player2.move = DIRECTION.UP
        } else if(key.keyCode === 186){
          Pong.player2.move = DIRECTION.DOWN
        }
        //fire bullet
        if(key.keyCode === 76){
          console.log("l pressed")
          Pong.bullet2.move = DIRECTION.RIGHT
          console.log("bullet2 fired")
        }
      }
    })
    //stop players from moving when no keys are pressed
    document.addEventListener('keyup', function(key){
      if(Pong.running === true){
        //player1
        if(key.keyCode === 87 || key.keyCode === 83){
          Pong.player1.move = DIRECTION.IDLE
        }
        //player2
        if(key.keyCode === 80 || key.keyCode === 186){
          Pong.player2.move = DIRECTION.IDLE
        }
      }
    })
  },

  //reset ball location, player turns, and set delay before next round begins
  _resetTurn: function(winner, loser){
    this.ball = Ball.new.call(this, this.ball.speed)
    this.turn = loser
    this.timer = (new Date().getTime())

    winner.score++
    //beep2.play()
  },

  //wait for delay to pass after each turn
  _turnDelayIsOver: function(){
    return((new Date()).getTime() - this.timer >= 1000)
  },

  //select random color as background of each level/round
  _generateRoundColor: function(){
    var newColor = colors[Math.floor(Math.random() * colors.length)]
    if(newColor === this.color){
      return Pong._generateRoundColor()
    }
    return newColor
  }
}

var Pong = Object.assign({}, Game)
Pong.initialize()

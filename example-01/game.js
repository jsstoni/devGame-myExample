(function(window, document, DEVGAME, undefined){
  'use strict'

  var canvas  = document.getElementById('game')
  var context = canvas.getContext('2d')
  
  var debugRefresh = 400

  var deltaTime  = 0
  var timeElapse = 0

  var _seg = 0
  var _fps = 0

  var mousex = 0
  var mousey = 0

  var stage = null
  var buttonPlay = null
  var mouse = null
  var sprite = null

  function init(){
    stage = new DEVGAME.Container()
    buttonPlay = new DEVGAME.entity.Rect(15, 40, 120, 40)
    stage.setContext(context)

    sprite = new DEVGAME.Sprite({
      source:  'sprite.png', 
      swidth:  162,
      sheight: 54,
      fps: 6,
      animation: 'ini',
      animations: {
        ini : [
          {
            sx : 0,
            sy : 0
          }
        ],
        hover : [
          {
            sx : 0,
            sy: 53
          }
        ]
      }
    });

    mouse = new DEVGAME.entity.Circle(mousex, mousey, 5)
    mouse.visible = false
    
    mouse.logic = function(){
      this.x = mousex
      this.y = mousey
      if (this.getX() < 0){
        this.x = 0
      }
      if (this.getX() > canvas.clientWidth){
        this.x = canvas.clientWidth
      }
      if (this.getY() < 0){
        this.y = 0
      }
      if (this.getY() > canvas.clientHeight){
        this.y = canvas.clientHeight
      }
    }

    buttonPlay.logic = function() {
      if (this.collisionCircle(mouse)){
        this.sprite.use('hover')
      }else {
        this.sprite.use('ini')
      }
    }

    sprite.load(function(error){
      events()
      run(loop)
    })

    buttonPlay.setSprite(sprite)

    stage.add(mouse, buttonPlay)
  }

  function exec(timestamp){
    timeElapse = timeElapse === 0 ? timestamp : timeElapse
    
    deltaTime  = timestamp - timeElapse
    timeElapse = timestamp

    _seg += deltaTime

    //debug refresh
    if (_seg >= debugRefresh){
      
      _fps = (1/deltaTime)*1000
      _seg = 0
    }
    
    if (deltaTime > 17){
      deltaTime = 0
    }

    stage.exec()
  }

  function draw(){
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    stage.render()
    context.fillStyle = '#000'
    context.font      = 'normal 10pt Arial'
    context.fillText('hecho por: jsstoni', 20, 20)
    context.fillText('DevGame', 20, 40)
  }

  function events(){
    document.addEventListener('mousemove', function(event){
      mousex = event.pageX - canvas.offsetLeft
      mousey = event.pageY - canvas.offsetTop
    }, false)
  }

  function loop(timestamp){
    exec(timestamp)
    draw()

    run(loop)

  }

  var run = DEVGAME.requestAnimationFrame(loop)
  window.addEventListener('load', init, false)



})(window, document, DEVGAME)

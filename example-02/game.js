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
  var _mouseClick = 0

  var state = 'inicio'
  var stage = null
  var stagePlay = []
  var menu = null
  var play = null
  var mouse = null
  var sprite = null
  var personaje = null

  function init(){
    menu = new DEVGAME.Container()
    menu.setContext(context)

    play = new DEVGAME.Container()
    play.setContext(context)

    stagePlay['inicio'] = menu
    stagePlay['play'] = play

    sprite = new DEVGAME.Sprite({
      source:  'sprite.png', 
      swidth:  162,
      sheight: 54,
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
    })

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

    personaje = new DEVGAME.entity.Circle(200, 200, 15)
    personaje.color = '#9c9'
    personaje.fill = true

    sprite.load(function(error){
      events()
      run(loop)
    })

    menu.add(mouse, new Play(1, 15, 40, 120, 40))
    play.add(mouse, personaje)
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

    stagePlay[state].exec()
  }

  function draw(){
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    stagePlay[state].render()
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
    canvas.addEventListener('mousedown',function(event){
      _mouseClick = event.which
    }, false);
  }

  function Play(id, x, y, sx, sy) {
  	DEVGAME.entity.Rect.call(this, x, y, sx, sy)
        this.setSprite(sprite)
        this.id = id
  	this.select = false
  }

  Play.prototype = Object.create(DEVGAME.entity.Rect.prototype)

  Play.prototype.logic = function() {
    // se guarda el valor del click
    this.click = _mouseClick
    // se reinicia el flag
    _mouseClick = 0

    // se verifica si estamos teniendo colision con el mouse
    if (this.collisionCircle(mouse)){

      // si nos han dado click, iniciamos el juego
      if (this.click === 1 && this.id == 1) {
        state = 'play'
      }else{
        this.sprite.use('hover')
      }

    }else {
      this.sprite.use('ini')
    }
  }

  function loop(timestamp){
    exec(timestamp)
    draw()

    run(loop)

  }

  var run = DEVGAME.requestAnimationFrame(loop)
  window.addEventListener('load', init, false)



})(window, document, DEVGAME)

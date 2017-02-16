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

  var game = null
  var state = 'inicio'
  var stage = []
  var menu = null
  var mouse = null
  var sprite = null

  function init(){
    game = new DEVGAME.Container()
    game.setContext(context)
    game.logic = function() {
      var timestamp = this.timestamp

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
    }

    menu = new DEVGAME.Container()
    game.add(menu)
    stage['inicio'] = menu

    sprite = new DEVGAME.Sprite({
      source:  'sprite.png', 
      swidth:  162,
      sheight: 54,
      fps:     60,
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
    }

    sprite.load(function(error){
      events()
      run(loop)
    })

    game.add(mouse)
    menu.add(new Play(1, 15, 80, 120, 40))
  }

  function exec(timestamp) {
    game.timestamp = timestamp
    game.exec()
    stage[state].exec()
  }

  function draw(){
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    stage[state].render()
    gui()
  }

  function gui() {
    context.fillStyle = '#000'
    context.font      = 'normal 10pt Arial'
    context.fillText('hecho por: jsstoni', 20, 20)
    context.fillText('DevGame',  20, 40)
  }

  function events(){
    document.addEventListener('mousemove', function(event){
      mousex = event.pageX - canvas.offsetLeft
      mousey = event.pageY - canvas.offsetTop
    }, false)
  }

  function Play(id, x, y, sx, sy) {
    DEVGAME.entity.Rect.call(this, x, y, sx, sy)
    this.setSprite(sprite)
    this.id = id
    this.select = false
  }

  Play.prototype = Object.create(DEVGAME.entity.Rect.prototype)

  Play.prototype.logic = function() {
    if (this.collisionCircle(mouse)) {
      this.sprite.use('hover')
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

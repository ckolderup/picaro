gameObject = {rooms: []}

drawRoom = (room) ->
  roomDiv = $("<div class='room'>#{room.name}</div>")
  directionMap =
    "N": 'top'
    "E": 'right'
    "S": 'bottom'
    "W": 'left'

  $(".rooms").append(roomDiv)
  if room.paths
    for compass, border of directionMap
      if room.paths[compass]
        console.log room.name, 'border-#{border}', '6px solid cyan'
        roomDiv.css("border-#{border}", '6px solid cyan') 
    

resetGameData = (game) ->
  gameObject = game
  console.log game
  $("#roomNum").html game.rooms.length
  $(".rooms").empty()
  drawRoom room for room in game.rooms

$ ->
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"),
    mode: "yaml"
    theme: "monokai"
    onChange: (mirror, changes) ->
      mirror.save()
      jsGameObject = jsyaml.load(mirror.getTextArea().value)
      resetGameData(jsGameObject)
      #if gameObject.rooms.length isnt jsGameObject.rooms.length
  )
  # on first load, reset the gameworld representation
  resetGameData jsyaml.load($('#code').html())

define [ "jquery", "room", "vendor/underscore" ], ($, Room) ->
  Editor = 
    drawRoom: (roomName, x, y) ->
      room = Room.findByName roomName
      return if room.drawn

      positionOffset = 140
      borderStyle = '6px solid cyan'
      roomDiv = $("<div data-room-id='#{room.name}' class='room'>#{room.name}<small class='itemCount'>Items: #{room.items.length}</small></div>")
      roomDiv.css("left", x).css('top', y)
      $(".rooms").append roomDiv 
      room.drawn = true

      for direction, destination of room.paths
        switch direction
          when "North", "N"
            roomDiv.css 'border-top', borderStyle
            @drawRoom(destination, x, y - positionOffset)
          when "South", "S"
            roomDiv.css 'border-bottom', borderStyle
            @drawRoom(destination, x, y + positionOffset)
          when "East", "E"
            roomDiv.css 'border-right', borderStyle
            @drawRoom(destination, x + positionOffset, y)
          when "West", "W"
            roomDiv.css 'border-left', borderStyle
            @drawRoom(destination,  x - positionOffset, y)

    resetGameData: (game) ->
      gameObject = game
      Room.all = game.rooms
      $("#roomNum").html game.rooms.length
      $(".rooms").empty()
      @drawRoom Room.all[0].name, 220, 220

  $ ->
    myCodeMirror = CodeMirror.fromTextArea document.getElementById("code"),
      mode: "yaml"
      theme: "monokai"
      onChange: (mirror, changes) ->
        mirror.save()
        jsGameObject = jsyaml.load(mirror.getTextArea().value)
        Editor.resetGameData jsGameObject
        #if gameObject.rooms.length isnt jsGameObject.rooms.length
    
    # on first load, reset the gameworld representation
    Editor.resetGameData jsyaml.load($('#code').html())

  Editor

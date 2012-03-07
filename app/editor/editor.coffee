define [ "jquery", "room", "vendor/underscore" ], ($, Room) ->
  Editor = 
    drawRoom: (roomName, x, y) ->
      room = Room.findByName roomName
      return if room.drawn
      room.drawn = true

      positionOffset = 125
      roomDiv = $("<div data-room-id='#{room.name}' data-content='#{_.escape(room.description)}' class='room'><h4>#{room.name} </h3></div>")
      roomDiv.append '&#9823;' if room.starter
      roomDiv.popover placement: 'left', title: roomName, animation: false
      if room.items
        itemDots = ''
        itemDots += "&#9817;" for item in room.items
        roomDiv.append itemDots

      roomDiv.css("left", x).css('top', y)
      $(".rooms").append roomDiv 

      for direction, destination of room.paths
        switch direction
          when "North", "N"
            @drawRoom(destination, x, y - positionOffset)
          when "South", "S"
            @drawRoom(destination, x, y + positionOffset)
          when "East", "E"
            @drawRoom(destination, x + positionOffset, y)
          when "West", "W"
            @drawRoom(destination, x - positionOffset, y)

    resetGameData: (game) ->
      gameObject = game
      Room.all[room.name] = room for room in game.rooms
      $('.hero-unit h2').html game.gameName
      $('.hero-unit p').html game.gameDescription

      $("#roomNum").html game.rooms.length
      $(".rooms").empty()
      @drawRoom Room.starter().name, 300, 550

  $ ->
    myCodeMirror = CodeMirror.fromTextArea document.getElementById("code"),
      mode: "yaml"
      theme: "monokai"
      onChange: (mirror, changes) ->
        mirror.save()
        try
          jsGameObject = jsyaml.load(mirror.getTextArea().value)
          Editor.resetGameData jsGameObject if typeof jsGameObject is 'object'
        catch error
          console.log "Game not parsing so good at this point:", error

    # on first load, reset the gameworld representation
    Editor.resetGameData jsyaml.load($('#code').html())

  Editor

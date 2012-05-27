define [ "jquery", "room", "vendor/underscore" ], ($, Room) ->
  Editor =
    saveGameButton:
      $('.btn.save-game')

    form:
      $('#form')

    codeTextArea:
      $('#code')

    yamlIsValid: (valid, errorObject) ->
      @yamlIndicator ?= $('#yaml-indicator')

      if valid
        @yamlIndicator.removeClass('badge-warning')
        @yamlIndicator.addClass('badge-success')
        @preventSave false
      else
        @yamlIndicator.addClass('badge-warning')
        @yamlIndicator.removeClass('badge-success')
        @preventSave true
        console.log "Game not parsing so good at this point:", errorObject

    preventSave: (gameInSaveableState) ->
      @saveGameButton.attr('disabled', gameInSaveableState)

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
      if game and game.rooms
        Editor.yamlIsValid true
        Room.construct(id, room) for id, room of game.rooms
        $('.game-name').html game.gameName
        $("#roomNum").html(game.rooms.length)
        $(".rooms").empty()
        @drawRoom(Room.starter().name, 75, 100)
      else
        Editor.yamlIsValid false

  $ ->
    Editor.saveGameButton.click ->
      console.log 'yayuh'
      Editor.submitForm.trigger('submit')

    mirror = CodeMirror.fromTextArea document.getElementById("code"),
      mode: "yaml"
      theme: "monokai"
      onChange: (mirror, changes) ->
        mirror.save()
        try
          jsGameObject = jsyaml.load(mirror.getTextArea().value || '')
          Editor.resetGameData(jsGameObject)
        catch error
          Editor.resetGameData(false)

    # on first load, reset the gameworld representation
    Editor.resetGameData jsyaml.load(Editor.codeTextArea.html())

  Editor

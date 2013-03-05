define [ "jquery", "room", "util", "vendor/underscore" ], ($, Room, util) ->
  Editor =
    saveGameButton:
      $('#save-game')

    form:
      $('form#game')

    codeTextArea:
      document.getElementById "code"

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
      return if not room or room.drawn?
      room.drawn = true

      positionOffset = 125
      $(".section-visual").scrollTop(650).scrollLeft(650)
      roomDiv = $("<div data-room-id='#{room.name}' data-content='#{_.escape(room.description)}' class='room'><h4>#{room.name} </h3></div>")
      roomDiv.append '&#9823;' if room.starter
      roomDiv.popover placement: 'right', title: roomName, animation: false
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
        for id, room of game.rooms
          if room.name.length > 20
            # TODO: move this to a Game.isValid() function
            Editor.yamlIsValid(false, "Room names must be 20 characters or less.")
          else
            Room.construct(id, room)
        $('.game-name').html game.gameName
        $("#roomNum").html(game.rooms.length)
        $(".rooms").empty()
        @drawRoom(Room.starter().name, 900, 900)
      else
        Editor.yamlIsValid false

    initCodeMirror: (mode) ->
      mirror = CodeMirror.fromTextArea Editor.codeTextArea,
        mode: mode
        theme: "monokai"
        onChange: (mirror, changes) ->
          mirror.save()
          try
            jsGameObject = jsyaml.load(Editor.codeTextArea.value)
            Editor.resetGameData(jsGameObject)
          catch error
            Editor.resetGameData(false)

    initPlaintextUpdate: ->
      updateGame = (v,e) ->
        try
          jsGameObject = jsyaml.load(Editor.codeTextArea.value)
          Editor.resetGameData(jsGameObject)
        catch error
          Editor.resetGameData(false)

      Editor.codeTextArea.onkeyup = updateGame
      Editor.codeTextArea.blur = updateGame

  $ ->
    Editor.resetGameData jsyaml.load(Editor.codeTextArea.value)
    $('#yaml-indicator').tooltip(placement: 'left', delay: {show: 200, hide: 1000})
    mode = util.getQueryParams()["mode"] || 'text'
    if mode is 'plain' then Editor.initPlaintextUpdate() else Editor.initCodeMirror(mode)

  Editor

define ["jquery", "util", "item", "room", "inventory", "talk", "vendor/underscore"], ($, util, Item, Room, Inventory, Talk) ->
  itemTriggers = []
  UI =
    messageDiv:
      $("#game")

    updateStatus: (message) ->
      $(document).trigger "updateStatus", message
      UI.messageDiv.scrollTop(UI.messageDiv.height())

    resetForNewRoom: (room, roomItems) ->
      message = room.description || "You enter #{room.name}."
      message += "\n"
      message += Item.descriptionsFor roomItems
      @updateStatus(message)
      @resetMenus()
      @resetCompass(room)

    renderMenuItem: (item, verb, showHeld) ->
      heldIndicator = "<small>(held)</small>"
      $("#action-#{verb} ul").append "<li>
          <a href='#' class='item' data-action-id='#{util.actionId(item, verb)}'>
            #{item.name} #{if showHeld then heldIndicator else ''}
          </a>
        </li>"

    resetMenus: ->
      unaryVerbs = ['look', 'take', 'talk', 'attack']
      binaryVerbs = ['use']

      # What goes in the action menus? Everything in the Room, plus everything in your Inventory.
      itemsForMenus = Item.findByRoom(Room.current).concat(Inventory.list())
      # Special case for the "Self" item.
      itemsForMenus.push self if self = Item.find('self')

      $(".ui-action ul").empty()
      for item in itemsForMenus
        for verb in unaryVerbs
          # If the item responds to the verb, the action will be drawn as a menu item.
          UI.renderMenuItem(item, verb, Inventory.include(item.id)) if item[verb]

        for verb in binaryVerbs
          # TODO: When should Use be shown? Show it always, for now.
          UI.renderMenuItem(item, verb, Inventory.include(item.id))

    resetCompass: (room) ->
      $("#move li").addClass "disabled"
      for direction, roomId of room.paths
        id = util.toIdString roomId
        adjacentRoom = Room.find(id)
        normalized_direction = switch direction
          when "North", "N" then 'north'
          when "East",  "E" then 'east'
          when "South", "S" then 'south'
          when "West",  "W" then 'west'
          else direction

        $('#move-preview').data('room-name', adjacentRoom.name)
        $("#move-preview .ul-modal-inner").html(adjacentRoom.name)

        $("#move-compass-#{normalized_direction} a").attr("href", id)
        $("#move-compass-#{normalized_direction} a").data("room-name", adjacentRoom.name)
        $("#move-compass-#{normalized_direction}, #move-compass-#{normalized_direction} a").removeClass "disabled"

    # TODO: remove the first, old classes if the styles remain unused
    newStatusMessage: (message, messageClass) ->
      lastMessage = $("p.new:first ")
      lastMessage.removeClass("new").addClass("old")
      lastMessage.delay(3000).animate(
        opacity: .5
        background: '#e0d9ca'
      )
      n = $("p.old").length
      $("p.old:first").remove() if n > 15
      messageClass ||= "new"
      UI.messageDiv.append "<p class='#{messageClass}'>" + message + "</p>"

    changeRoom: (e, roomData) ->
      room = roomData.room
      items = roomData.items
      Room.current = room
      UI.resetForNewRoom(room, items)
      $("#header h2").html(room.name)
      $(document).trigger("roomReady", room)

    # After triggering the actionTalk event, clear the list the Talk list and trigger `actionTalk`
    beginTalk: (event, item) ->
      $('#action-talk-character h3').html item.name
      $('#action-talk-character').show()

    # should just be a reset menu / close menu most likely
    itemTaken: (e, item) ->
      $(document).trigger "updateStatus", "You take the #{item.name}."
      $("#action-take a[data-action-id='" + util.actionId(item, "take") + "']").remove()
      $("#action-use  a[data-action-id='" + util.actionId(item, "use") + "']").append $("<small> (held) </small>")
      $("#action-look a[data-action-id='" + util.actionId(item, "look") + "']").append $("<small> (held) </small>")
      $("#action-use").trigger "closeMenu"

    hideCompass: ->
      $("#move").fadeOut 'fast'

    init: (gameName) ->
      $("title").html gameName

      # Common item actions, gradually being extracted into custom handlers i.e. Use and Talk
      oldMenus = _([ "look", "take", "attack" ])
      oldMenus.each (action) ->
        menuSelector = "#action-" + action
        $("#footer-" + action + " a").click ->
          $(menuSelector).fadeIn "fast"
          false

        $(menuSelector + ".ui-overlay," + menuSelector + " .ui-action-sheet-back").click ->
          $(".active").removeClass "active"
          $(this).fadeOut "fast"
          $(".ui-action, .ui-overlay, #move").fadeOut "fast"

        $(menuSelector + " ul li a").live "click", (event) ->
          actionAndId = util.splitActionId(this)
          $(this).trigger "closeMenu"
          itemAction actionAndId[0], actionAndId[1], event

      $("#header-move, #move").click ->
        $("#move").fadeToggle "fast"
        $(".ui-overlay").fadeToggle "fast"
        false

      $("#move-compass li").mouseover ->
        unless $(this).hasClass("disabled")
          roomName = $(this).children("a").data("room-name")
          $("#move-preview .ui-modal-inner").html(roomName)
          $("#move-preview").fadeIn "fast"
        false

      $("#move-compass li:not(.disabled) a").mouseout ->
        $("#move-preview").fadeOut "fast"
        false

      itemAction = (action, item, event) ->
        item = Item.find item
        $(document).trigger "actionLook", item if action is "look"
        $(document).trigger "actionTake", item if action is "take"
        $(document).trigger "actionAttack", item if action is "attack"
        if action is "use"
          event.stopPropagation()
          false

  # Event Binding
  # ================

  $("#footer ul li a").click ->
    $(".ui-overlay").fadeIn "fast"
    $(".ui-action").fadeOut "fast"
    $(".active").removeClass "active"
    $("#footer").addClass "active"
    $(this).parent().addClass "active"

  $(".ui-overlay").click ->
    $(".ui-action, .ui-overlay, #move").fadeOut "fast"

  $("a.path:not(.disabled)").click ->
    room = Room.find($(this).attr("href"))
    roomData =
      room: room
      items: Item.findByRoom(room)

    $(document).trigger "changeRoom", roomData

  # Use
  # ----------------

  $("#action-use li a").live "click", ->
    itemTriggers.push Item.find(util.splitActionId(this)[1])

    # TODO: this selector chain should be optimized, for some reason .closest() isn't finding the h3. perhaps add an ID to this for a faster find?
    menuHeader = $(this).closest("div.ui-modal-inner").find('h3')
    if itemTriggers.length is 1
      menuHeader.html("Use <strong>#{itemTriggers[0].name}</strong> on &hellip;")
      $(this).addClass "active"
    else if itemTriggers.length is 2
      $(this).trigger "closeMenu"
      menuHeader.html("Use&hellip;")
      $(document).trigger "actionUse", itemTriggers
      itemTriggers = []

  $("#footer-use").click ->
    $("#action-use").trigger "openMenu"

  # Talk
  # ----------------

  # Open the talk menu, in order to select someone in the Room to talk to.
  $("#footer-talk").click ->
    $("#action-talk").trigger "openMenu"

  # Talk menu click handlers - these are for starting converations
  $("#action-talk li a.item").live "click", ->
    itemId = util.splitActionId(this)[1]
    $(this).trigger "actionTalk", itemId

  # When a conversation is in progress, populate the talk list with responses
  $(document).bind "askQuestion", (e, question) ->
    $("#action-talk-character-message").html question.message
    $('#action-talk-player ul').empty()
    _.each question.responses, (response, index) ->
      $("#action-talk-player ul").append $("<li><a class='talkResponse' data-response-id='#{index}' href='#'>#{response.message}</a></li>")

  # Talk menu responses - triggerwed when a response is chosen
  $('#action-talk-player a.talkResponse').live 'click', event, ->
    Talk.answerQuestion $(this).data("response-id")
    event.stopPropagation()

  # This updates the NPC's dialog box.
  $(document).bind "updateCharacterDialog", (event, dialog) ->
    message = if typeof dialog is "string" then dialog else dialog.message
    $("#action-talk-character-message").html message

  # The conversation has run out of steam. The NPC always gets the last word- your menu vanishes.
  $(document).bind "endTalk", ->
    $("#action-talk-player").hide()
    $(document).trigger "resetMenus"


  # Menus
  # ----------------
  $(".ui-action").bind "openMenu", (e, i) ->
    $(".ui-overlay").fadeIn "fast"
    $(this).fadeIn("fast").addClass "active"

  $(".ui-action").bind "closeMenu", ->
    $(this).fadeOut("fast").removeClass "active"
    $(".ui-overlay").fadeOut "fast"

  $(document).bind "updateStatus", (event, message) ->
    UI.newStatusMessage message

  $(document).bind "gameOver", (event, message) ->
    UI.newStatusMessage message, 'end'

  $(document).bind "beginTalk", UI.beginTalk
  $(document).bind "resetMenus", UI.resetMenus
  $(document).bind "itemTaken", UI.itemTaken
  $(document).bind "changeRoom", UI.changeRoom

  UI
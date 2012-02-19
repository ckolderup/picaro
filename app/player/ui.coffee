define [ "jquery", "util", "item", "room", "inventory", "vendor/underscore" ], ($, util, Item, Room, Inventory) ->
  itemTriggers = []
  UI =
    updateStatus: (message) ->
      $(document).trigger "updateStatus", message

    resetForNewRoom: (room, roomItems) ->
      @resetMenus()
      itemNames = _.pluck(roomItems, "name")
      message = ""
      if room.description
        message += room.description
        message += "\n"
      @updateStatus message + "You see " + util.toArrayToSentence(itemNames)

    resetMenus: ->
      roomItems = Item.findByRoom(Room.current)
      console.log "resetMenus", Room.current, roomItems
      $(".ui-action ul").empty()
      _.each Inventory.list(), (item) ->
        $("#action-use ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "use") + "'>" + item.name + " <small> (held) </small></a></li>"
        $("#action-look ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + " <small> (held) </small></a></li>"

      _.each _.difference(roomItems, Inventory.list()), (item) ->
        $("#action-take ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>"
        $("#action-use ul").append "<li><a href='#' class='item' data-item-id='" + item.id + "' data-action-id='" + util.actionId(item, "use") + "'>" + item.name + "</a></li>"
        $("#action-look ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "look") + "'>" + item.name + "</a></li>"

      _.each roomItems, (item) ->
        $("#action-talk ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>"  if item.talk
        $("#action-attack ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>"  if item.attack

    newStatusMessage: (message) ->
      $("p.new:first ").removeClass("new").addClass "old"
      n = $("p.old").length
      $("p.old:first").remove()  if n > 5
      $("#game").append "<p class='new'>" + message + "</p>"

    changeRoom: (e, roomData) ->
      room = roomData.room
      items = roomData.items
      Room.current = room
      UI.resetForNewRoom room, items
      $("#header h2").html room.name
      $("#move-preview .ul-modal-inner").html room.name
      $(document).trigger "roomReady", room

    itemTaken: (e, item) ->
      $(document).trigger "updateStatus", "You take the " + item.name + "."
      $("#action-take a[data-action-id='" + util.actionId(item, "take") + "']").remove()
      $("#action-use  a[data-action-id='" + util.actionId(item, "use") + "']").append $("<small> (held) </small>")
      $("#action-look a[data-action-id='" + util.actionId(item, "look") + "']").append $("<small> (held) </small>")
      $("#action-use").trigger "closeMenu"

    renderUseMenu: (inventoryItems, roomItems) ->
      $(".ui-action ul").empty()
      _.each inventoryItems, (item) ->
        $("#action-use ul").append "<li><a href='#' class='item data-action-id='" + util.actionId(item, "use") + "'>" + item.name + " <small> (held) </small></a></li>"
        $("#action-look ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + " <small> (held) </small></a></li>"

      _.each _.difference(roomItems, inventoryItems), (item) ->
        $("#action-take ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>"
        $("#action-use ul").append "<li><a href='#' class='item' data-item-id='" + item.id + "' data-action-id='" + util.actionId(item, "use") + "'>" + item.name + "</a></li>"
        $("#action-look ul").append "<li><a href='#' class='item' data-action-id='" + util.actionId(item, "look") + "'>" + item.name + "</a></li>"

    init: ->
      oldMenus = _([ "look", "take", "talk", "attack" ])
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
          preview = $(this).children("a").attr("href")
          $("#move-preview .ui-modal-inner").html preview
          $("#move-preview").fadeIn "fast"
        false

      $("#move-compass li:not(.disabled) a").mouseout ->
        $("#move-preview").fadeOut "fast"
        false

      itemAction = (action, item, event) ->
        item = Item.allById[item]
        $(document).trigger "actionLook", item  if action is "look"
        $(document).trigger "actionTake", item  if action is "take"
        $(document).trigger "actionTalk", item  if action is "talk"
        $(document).trigger "actionAttack", item  if action is "attack"
        if action is "use"
          event.stopPropagation()
          false

  $("#footer ul li a").click ->
    $(".ui-overlay").fadeIn "fast"
    $(".ui-action").fadeOut "fast"
    $(".active").removeClass "active"
    $("#footer").addClass "active"
    $(this).parent().addClass "active"

  $("a.path:not(.disabled)").click ->
    room = Room.findByName($(this).attr("href"))
    roomData =
      room: room
      items: Item.findByRoom(room)

    $(document).trigger "changeRoom", roomData

  $("#footer-use").click ->
    $("#action-use").trigger "openMenu"

  $("#action-use li a").live "click", ->
    itemTriggers.push util.splitActionId(this)[1]
    if itemTriggers.length is 1
      $(this).addClass "active"
    else if itemTriggers.length is 2
      $(this).trigger "closeMenu"
      $(document).trigger "actionUse", itemTriggers
      itemTriggers = []

  $(".ui-action").bind "openMenu", (e, i) ->
    $(".ui-overlay").fadeIn "fast"
    $(this).fadeIn("fast").addClass "active"

  $(".ui-action").bind "closeMenu", ->
    $(this).fadeOut("fast").removeClass "active"
    $(".ui-overlay").fadeOut "fast"

  $(document).bind "resetMenus", UI.resetMenus
  $(document).bind "itemTaken", UI.itemTaken
  $(document).bind "changeRoom", UI.changeRoom

  UI
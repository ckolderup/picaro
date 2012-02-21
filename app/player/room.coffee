define [ "jquery", "item", "inventory", "vendor/underscore" ], ($, Item, Inventory) ->
  Room =
    all: []

    init: (startingRoom) ->
      @current = startingRoom
      roomItems = Item.findByRoom(startingRoom)
      $(document).trigger "changeRoom",
        room: startingRoom
        items: roomItems

    findByName: (name) ->
      _(@all).find (room) ->
        room.name is name

    get: (room, roomItems) ->
      $("#move a").attr "href", "#"
      $("#move li").addClass "disabled"
      for i of room.paths
        direction = room.paths[i].Direction
        if direction is "North"
          $("#move-compass-north a").attr "href", room.paths[i].name
          $("#move-compass-north, #move-compass-north a").removeClass "disabled"
        else if direction is "South"
          $("#move-compass-south a").attr "href", room.paths[i].name
          $("#move-compass-south, #move-compass-south a").removeClass "disabled"
        else if direction is "East"
          $("#move-compass-east a").attr "href", room.paths[i].name
          $("#move-compass-east, #move-compass-east a").removeClass "disabled"
        else if direction is "West"
          $("#move-compass-west a").attr "href", room.paths[i].name
          $("#move-compass-west, #move-compass-west a").removeClass "disabled"

  $(document).bind "roomChanged", (e, room) ->
    console.log "yes i know i changed"

  $(document).bind "roomReady", (e, room) ->
    roomItems = _(Item.allById).filter((item, id) ->
      item.location is room.name
    )
    Room.get room, roomItems

  Room
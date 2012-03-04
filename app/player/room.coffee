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
      for direction, name of room.paths
        switch direction
          when "North", "N"
            $("#move-compass-north a").attr "href", name
            $("#move-compass-north, #move-compass-north a").removeClass "disabled"
          when "South", "S"
            $("#move-compass-south a").attr "href", name
            $("#move-compass-south, #move-compass-south a").removeClass "disabled"
          when "East", "E"
            $("#move-compass-east a").attr "href", name
            $("#move-compass-east, #move-compass-east a").removeClass "disabled"
          when "West", "W"
            $("#move-compass-west a").attr "href", name
            $("#move-compass-west, #move-compass-west a").removeClass "disabled"

  $(document).bind "roomReady", (e, room) ->
    roomItems = _(Item.allById).filter (item, id) -> item.location is room.name
    Room.get room, roomItems

  Room
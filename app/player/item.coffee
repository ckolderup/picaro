define [ "jquery", "util", "inventory", "action_guard", "vendor/underscore" ], ($, Util, Inventory, ActionGuard) ->
  Item =
    allById: {}

    init: (items) ->
      @allById = items

    # Takes a room object and returns all items whose `location` is the same as its name.
    findByRoom: (room) ->
      _.filter @allById, (item, id) ->
        item.location is room.name

    look: (item) ->
      if item.look instanceof Array
        item.lookNum or= 0
        $(document).trigger "updateStatus", item.look[item.lookNum]
        item.lookNum += 1  if item.look.length > (item.lookNum + 1)
      else if item.look instanceof String
        $(document).trigger "updateStatus", item.look
      else
        $(document).trigger "updateStatus", item.look.message
        $(document).trigger "gameEvent", item.look if item.look.after

    talk: (item) ->
      $(document).trigger "updateStatus", item.talk[item.talkNum]
      item.talkNum += 1  if item.talk.length > (item.talkNum + 1)

    attack: (item) ->
      $(document).trigger "updateStatus", item.attack[item.attackNum]
      item.attackNum += 1  if item.attack.length > (item.attackNum + 1)

    # Add the item to the Inventory.
    take: (item) ->
      Inventory.add item
      $(document).trigger "itemTaken", item
      $(document).trigger "closeMenu"
      $(document).trigger "gameEvent", item.take if item.take.after

    tryToTake: (item) ->
      if @canTake(item)
        @take(item)
      else
        @willNotTake(item)

    canTake: (item) ->
      if item.take is true
        true
      else if item.take and item.take.actionGuard
        ActionGuard.test item.take
      else
        false

    willNotTake: (item) ->
      message = "You can't take the " + item.name + ". "
      message += item.take.cannotTakeMessage  if item.take and item.take.cannotTakeMessage
      $(document).trigger "updateStatus", message

    immediateTake: (gameEvent) ->
      item = Item.allById[gameEvent.item]
      Item.take item

    # This method first looks up the two item IDs passed as arguments.  Then, if the second item has a Use property mentioning the first, it checks if this action is guarded and fires it if not.
    use: (itemId1, itemId2) ->
      [item1, item2] = [@allById[itemId1], @allById[itemId2]]
      if item1 and item2 and item2.use and item2.use[item1.id]
        using = item2.use[item1.id]
        $(document).trigger "gameEvent", using if not using.actionGuard or ActionGuard.test(using)
      else
        $(document).trigger "updateStatus", "You can't use those things together."

  #### DOM Event binding

  # The current crop of 5 actions are bound here.
  $(document).bind "actionTalk", (e, o) ->
    Item.talk o

  $(document).bind "actionAttack", (e, o) ->
    Item.attack o

  $(document).bind "actionLook", (e, o) ->
    Item.look o

  # Notce that Use takes two items as arguments, while the others take only one.
  $(document).bind "actionUse", (e, item1, item2) ->
    Item.use item1, item2

  $(document).bind "actionTake", (e, o) ->
    Item.tryToTake o

  $(document).bind "immediateTake", (e, o) ->
    Item.immediateTake o

  Item
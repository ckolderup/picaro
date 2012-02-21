define [ "jquery", "util", "inventory", "action_guard", "vendor/underscore" ], ($, Util, Inventory, ActionGuard) ->
  Item =
    init: (items) ->
      @allById = items

    findByRoom: (room) ->
      _.filter @allById, (item, id) ->
        item.location is room.name

    look: (item) ->
      console.log arguments
      item.lookNum or= 0
      $(document).trigger "updateStatus", item.look[item.lookNum]
      item.lookNum += 1  if item.look.length > (item.lookNum + 1)

    talk: (item) ->
      $(document).trigger "updateStatus", item.talk[item.talkNum]
      item.talkNum += 1  if item.talk.length > (item.talkNum + 1)

    attack: (item) ->
      $(document).trigger "updateStatus", item.attack[item.attackNum]
      item.attackNum += 1  if item.attack.length > (item.attackNum + 1)

    take: (item) ->
      Inventory.add item
      $(document).trigger "itemTaken", item
      $(document).trigger "closeMenu"
      $(document).trigger "gameEvent", item.take  if item.take.after

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

    use: (itemId1, itemId2) ->
      item1 = @allById[itemId1]
      item2 = @allById[itemId2]
      if item1 and item2 and item2.use and item2.use[item1.id]
        using = item2.use[item1.id]
        $(document).trigger "gameEvent", using  if not using.actionGuard or ActionGuard.test(using)
      else
        $(document).trigger "updateStatus", "You can't use those things together."
        console.log "you can't use this on that.", item1, item2

  $(document).bind "actionTalk", (e, o) ->
    Item.talk o

  $(document).bind "actionAttack", (e, o) ->
    Item.attack o

  $(document).bind "actionLook", (e, o) ->
    Item.look o

  $(document).bind "actionUse", (e, item1, item2) ->
    Item.use item1, item2

  $(document).bind "actionTake", (e, o) ->
    Item.tryToTake o

  $(document).bind "immediateTake", (e, o) ->
    Item.immediateTake o

  Item
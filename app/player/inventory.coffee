define
  _items: []

  add: (item) ->
    @_items.push item

  remove: (itemId) ->
    @_items = _.reject @list(), (item) ->
      item.id is itemId

  list: ->
    @_items

  include: (itemId) ->
    _.any @list(), (item) ->
      item.id is itemId
define ['vendor/underscore'],
  _items: {}

  add: (item) ->
    @_items[item.id] = item

  remove: (itemId) ->
    if @include itemId
      delete @_items[itemId]
      true

  list: ->
    _.values(@_items)

  get: (itemId) ->
    @_items[itemId]

  include: (itemId) ->
    @get(itemId)?

  size: ->
    _.size(@_items)
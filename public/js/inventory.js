define({
  _items : [],

  add: function(item) {
    this._items.push(item)
  },

  remove: function(itemId) {
    var removedItem
    this._items = _.reject(this.list(), function(item) {
      if (item.id === itemId) {
        removedItem = item
        return true
      }
    })
    return removedItem
  },

  list: function() {
    return this._items
  },

  include: function(itemId) {
    return _.any(this.list(), function(item) {
      return item.id == itemId
    })
  }

})
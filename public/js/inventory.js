
define({
  _items: {},
  add: function(item) {
    return this._items[item.id] = item;
  },
  remove: function(itemId) {
    if (this.include(itemId)) {
      delete this._items[itemId];
      return true;
    }
  },
  list: function() {
    return _.values(this._items);
  },
  get: function(itemId) {
    return this._items[itemId];
  },
  include: function(itemId) {
    return this.get(itemId) != null;
  }
});


define({
  _items: [],
  add: function(item) {
    return this._items.push(item);
  },
  remove: function(itemId) {
    return this._items = _.reject(this.list(), function(item) {
      return item.id === itemId;
    });
  },
  list: function() {
    return this._items;
  },
  include: function(itemId) {
    return _.any(this.list(), function(item) {
      return item.id === itemId;
    });
  }
});

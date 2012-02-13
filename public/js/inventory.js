define({
  items : [],

  add:function(item) {
    this.items.push(item)
  },

  list: function() {
    return this.items;
  },

  include: function(itemId) {
    return _.any(this.list(), function(item) {return item.id == itemId})
  }

})
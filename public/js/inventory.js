define({
  items : [],

  add:function(item) {
    this.items.push(item)
  },

  list: function() {
    return this.items;
  }

})
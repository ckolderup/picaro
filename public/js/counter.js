define(["jquery", "vendor/underscore"], function($) {

  var Counter = {
    init: function(counters) {
      this.all = counters
    }
  }

  return Counter;
})
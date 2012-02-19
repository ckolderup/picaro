(function() {

  define(["jquery", "vendor/underscore"], function($) {
    var Counter;
    Counter = {
      init: function(counters) {
        return this.all = counters;
      }
    };
    return Counter;
  });

}).call(this);

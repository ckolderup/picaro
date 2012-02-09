define(["jquery", 'item', "vendor/underscore"], function($, Item) {
  var GameEvent = {};

  GameEvent.allById =  _({});;

  GameEvent.types = {
    takeItem : function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      var item = Item.allById[gameEvent.item]
      Item.take(item)
    },

    instantVictory: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
    }
  }

  $(document).bind('gameEvent', function(e, using) {
    var afterEvent = GameEvent.allById[using['after']];
    if (afterEvent) {
      GameEvent.types[afterEvent.type](afterEvent)
    }
  });

  return GameEvent;
})
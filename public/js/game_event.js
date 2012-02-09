define(["jquery", 'item', "vendor/underscore"], function($, Item) {
  var GameEvent = {};

  GameEvent.allById =  _({});;

  GameEvent.types = {
    takeItem : function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      Item.take(gameEvent.item)
      console.log("111111111111111", arguments)
    },

    instantVictory: function(event) {
      console.log("instantVictory", arguments)
    }
  }

  $(document).bind('itemsUsed', function(e, using) {
    var afterEvent = GameEvent.allById[using['after']];
    if (afterEvent) {
      console.log('afterEvent', afterEvent)
      GameEvent.types[afterEvent.type](afterEvent)
    }
  });

  return GameEvent;
})

define(["jquery", "room", "vendor/underscore"], function($, Room) {
  var Editor;
  Editor = {
    drawRoom: function(roomName, x, y) {
      var destination, direction, item, itemDots, positionOffset, room, roomDiv, _i, _len, _ref, _ref1, _results;
      room = Room.findByName(roomName);
      if (room.drawn) {
        return;
      }
      room.drawn = true;
      positionOffset = 125;
      roomDiv = $("<div data-room-id='" + room.name + "' data-content='" + (_.escape(room.description)) + "' class='room'><h4>" + room.name + " </h3></div>");
      if (room.starter) {
        roomDiv.append('&#9823;');
      }
      roomDiv.popover({
        placement: 'left',
        title: roomName,
        animation: false
      });
      if (room.items) {
        itemDots = '';
        _ref = room.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          itemDots += "&#9817;";
        }
        roomDiv.append(itemDots);
      }
      roomDiv.css("left", x).css('top', y);
      $(".rooms").append(roomDiv);
      console.log(room);
      _ref1 = room.paths;
      _results = [];
      for (direction in _ref1) {
        destination = _ref1[direction];
        console.log(direction, destination);
        switch (direction) {
          case "North":
          case "N":
            _results.push(this.drawRoom(destination, x, y - positionOffset));
            break;
          case "South":
          case "S":
            _results.push(this.drawRoom(destination, x, y + positionOffset));
            break;
          case "East":
          case "E":
            _results.push(this.drawRoom(destination, x + positionOffset, y));
            break;
          case "West":
          case "W":
            _results.push(this.drawRoom(destination, x - positionOffset, y));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    },
    resetGameData: function(game) {
      var id, room, _ref;
      if (!(game && game.rooms)) {
        return;
      }
      _ref = game.rooms;
      for (id in _ref) {
        room = _ref[id];
        Room.construct(id, room);
      }
      $('h3.editor span').html(game.gameName);
      $("#roomNum").html(game.rooms.length);
      $(".rooms").empty();
      return this.drawRoom(Room.starter().name, 75, 100);
    }
  };
  $(function() {
    var mirror;
    mirror = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "yaml",
      theme: "monokai",
      onChange: function(mirror, changes) {
        var jsGameObject;
        mirror.save();
        try {
          jsGameObject = jsyaml.load(mirror.getTextArea().value || '');
          if (typeof jsGameObject === 'object') {
            return Editor.resetGameData(jsGameObject);
          }
        } catch (error) {
          return console.log("Game not parsing so good at this point:", error);
        }
      }
    });
    return Editor.resetGameData(jsyaml.load($('#code').html()));
  });
  return Editor;
});

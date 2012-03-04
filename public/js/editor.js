
define(["jquery", "room", "vendor/underscore"], function($, Room) {
  var Editor;
  Editor = {
    drawRoom: function(roomName, x, y) {
      var borderStyle, destination, direction, positionOffset, room, roomDiv, _ref, _results;
      room = Room.findByName(roomName);
      if (room.drawn) return;
      positionOffset = 140;
      borderStyle = '6px solid cyan';
      roomDiv = $("<div data-room-id='" + room.name + "' class='room'>" + room.name + "<small class='itemCount'>Items: " + room.items.length + "</small></div>");
      roomDiv.css("left", x).css('top', y);
      $(".rooms").append(roomDiv);
      room.drawn = true;
      _ref = room.paths;
      _results = [];
      for (direction in _ref) {
        destination = _ref[direction];
        switch (direction) {
          case "North":
          case "N":
            roomDiv.css('border-top', borderStyle);
            _results.push(this.drawRoom(destination, x, y - positionOffset));
            break;
          case "South":
          case "S":
            roomDiv.css('border-bottom', borderStyle);
            _results.push(this.drawRoom(destination, x, y + positionOffset));
            break;
          case "East":
          case "E":
            roomDiv.css('border-right', borderStyle);
            _results.push(this.drawRoom(destination, x + positionOffset, y));
            break;
          case "West":
          case "W":
            roomDiv.css('border-left', borderStyle);
            _results.push(this.drawRoom(destination, x - positionOffset, y));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    },
    resetGameData: function(game) {
      var gameObject;
      gameObject = game;
      Room.all = game.rooms;
      $("#roomNum").html(game.rooms.length);
      $(".rooms").empty();
      return this.drawRoom(Room.all[0].name, 220, 220);
    }
  };
  $(function() {
    var myCodeMirror;
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "yaml",
      theme: "monokai",
      onChange: function(mirror, changes) {
        var jsGameObject;
        mirror.save();
        jsGameObject = jsyaml.load(mirror.getTextArea().value);
        return Editor.resetGameData(jsGameObject);
      }
    });
    return Editor.resetGameData(jsyaml.load($('#code').html()));
  });
  return Editor;
});

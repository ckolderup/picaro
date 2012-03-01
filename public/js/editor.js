var drawRoom, gameObject, resetGameData;

gameObject = {
  rooms: []
};

drawRoom = function(room) {
  var border, compass, directionMap, roomDiv, _results;
  roomDiv = $("<div class='room'>" + room.name + "</div>");
  directionMap = {
    "N": 'top',
    "E": 'right',
    "S": 'bottom',
    "W": 'left'
  };
  $(".rooms").append(roomDiv);
  if (room.paths) {
    _results = [];
    for (compass in directionMap) {
      border = directionMap[compass];
      if (room.paths[compass]) {
        console.log(room.name, 'border-#{border}', '6px solid cyan');
        _results.push(roomDiv.css("border-" + border, '6px solid cyan'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};

resetGameData = function(game) {
  var room, _i, _len, _ref, _results;
  gameObject = game;
  console.log(game);
  $("#roomNum").html(game.rooms.length);
  $(".rooms").empty();
  _ref = game.rooms;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    room = _ref[_i];
    _results.push(drawRoom(room));
  }
  return _results;
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
      if (gameObject.rooms.length !== jsGameObject.rooms.length) {
        return resetGameData(jsGameObject);
      }
    }
  });
  return resetGameData(jsyaml.load($('#code').html()));
});

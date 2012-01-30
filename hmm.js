var data = {
"gameName": "Adventure at Joe's House",
"gameDescription": "THIS IS WHERE THE MAGIC HAPPENS BABY",
"Version": "311",
"noDo": "You can't do that.",

"Counters": [
  {"Name": "Elbow Drops", "Min": 0, "Max": 5, "Val": 0}
],

"ItemCombos": [
  {"Name": "Cool Jackalope", "Message": "You created a cool jackalope", "Ingredients": ["Jackalope", "a pair of Sunglasses"], "Location": "Room"},
  {"Name": "Jacko Couch", "Message": "You put Jacko on da couch", "Ingredients": ["Jackalope", "Couch"], "Desctructive": true},
  {"Name": "Jacko Table", "Message": "You put Jacko on da table", "Ingredients": ["Jackalope", "Table"]}
],

"Rooms" : [
  {
    "Starter" : true,
    "Name": "Living Room",
    "Description": "You are in the living room. There is a jackalope head mounted on the wall, an old coffee table that Joe's parents gave him on the floor, and you're sitting on a couch.",
      "paths": [
		{"Name": "Joe's Room", "Direction": "South"},
		{"Name": "Kitchen", "Direction": "North"},
		{"Name": "Bathroom", "Direction": "East"}
		],
      "items": [
		{"Name": "Coffee Table", "Look": ["Dope coffee table.","Totally dope coffee table."], "Attack": ["You elbow drop that mess. Wood flies everywhere.", "You cut your elbow badly on a jagged piece of wood. Dummy."], "Counters" : {"Attack" : ["Elbow Drops", 1] }},
		{"Name": "Couch", "Look": ["Dope couch."],  "Attack": ["Done. A good place for a practice elbow drop. Search elsewhere for the real deal.", "Test"], "Counters" : {"Talk" : ["Elbow Drops", 1]}},
		{"Name": "Jackalope", "Look": ["Dope jackalope"], "Take": true, "Talk": ["The jackalope can't talk. It's dead."], "Attack": ["The jackalope sends you straight to hell."]},
		{"Name": "a pair of Sunglasses", "Look": ["Dope sunglasses."],  "Take": true}
       ]
  },

  {
    "Name": "Joe's Room",
    "Description": "You are in Joe's room. There is a thirty square-foot black light poster of Jimi Hendrix on the wall. There is nothing else in the room.",
      "paths": [
		{"Name": "Living Room", "Direction": "North"}
		],
      "items": [
		{"Name": "Hendrix Poster", "Take": true}
       ]
  },

    {
    "Name": "Bathroom",
    "Description": "You are in Joe's bathroom. There is a plentiful supply of floss.",
      "paths": [
		{"Name": "Living Room", "Direction": "West"}
		],
      "items": [
		{"Name": "Toilet", "Take": true}
       ]
  },

  {
    "Name": "Kitchen",
    "Description": "You are in the kitchen. I GOT YA ALL IN CHEQUE",
      "paths": [
		{"Name": "Living Room", "Direction": "South"}
		],
      "items": [
		{"Name": "Stove", "Take": true}
       ]
  }

]

}

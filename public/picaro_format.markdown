Picaro Format, v1 DRAFT
=========================

Each Picaro world is defined by a single text file. The format uses minimal syntax and meaningful indentation to produce a document that's easy for a human to read, while also being unambiguous for a machine to interpet.

Picaro's worlds are primarily written in [YAML](http://yaml.org), although similiarly structured [JSON](http://json.org) is supported as well.

Worlds are made up of `Rooms`, `Actions`, `Items`, and `Events`- we'll explain what these all of these mean in turn.

Room Basics
-------------
Rooms are where your game takes place- a set of locations linked together by paths. Any type of setting in your game should be thought of as a room- even if it doesn't have four walls and a ceiling.

Rooms are defined by their ID followed by a colon, and then a set of properties nicely indented to show they belong to that room.  A typical property of most rooms is its description, which is shown to the player whenever they enter. Here are two, for example:

		Narrow Alley:
			description: A cramped space between houses barely allows you entry.
			starter: true
		Dead End:
			description: The alley is abruptly cut off by a chain link fence.
			
You may have noticed that the Narrow Alley has two properties.  Good noticing! `starter` indicates that this is the room that the player should begin in.

Now, these rooms are not in any way connected. If we want the player to be able to move from one to the next, we're going to have to give them `paths`.

		Narrow Alley:
			description: A cramped space between houses barely allows you entry.
			starter: true
			paths:
				west: Dead End
		Dead End:
			description: The alley is abruptly cut off by a chain link fence.
			paths:
				east: Narrow Alley
				
There you go. Each room's `paths` property names one or more cardinal directions (either spelled out or in shorthand, e.g. NSEW), each of which points to another room by its ID.  Now when a player starts out in the Narrow Alley, clicking on the compass rose will show her a path the the West.

Note that no spatial consistency is enforced on how you lay out your paths. Going east won't neccesarily offer you a way to return west, and far-flung rooms could have improbable shortcuts to each other.  This opens up certain creative possibilities, but can also confuse the player if you're not careful.

Action Basics
--------------
Actions are the the verbs that items in your game will respond to. You can think of an action as an extremely short sentence made up of a verb and a noun, like "TAKE LAMP" or "ATTACK GORBACHEV". The verbs that items can respond to in V1 of the Picaro player are `Look`, `Take`, `Use`, `Talk` and `Attack`.

Item Basics
--------------
Items are the objects, obstacles and characters that the player will interact with in your world. Like rooms, they have an ID (which can double as the name displayed to the player- more on this later) and a set of properties.  The most important properties that Items have are their actions.  These specify what the Item should do when the player tries a certain verb on them. In their simplest form, the action specifies nothing more than a message to display to the player:

		Crumpled candy wrapper:
			look: It's a greasy piece of plastic, compacted into a tight little ball.
			take: You don't want to pick it up; you're afraid it may be full of ants.
			attack: You step on the wrapper and grind your heel, hoping to kill any ants that may be inside.
			
In a more complex form, actions specify events that will occur before or after the user is allowed to perform the action. It's through these events that more complex gameplay can start to emerge. See below for more on events.

Items are generally defined within Rooms. Here's an example of a one-room game file with a few items in it, to give you an idea of how they all look together:

		rooms:
			Dead End:
				description: Did J.P. Satre write this game? Because there's no exit.
				items:
					Crumpled candy wrapper:
						look: Gross. Ants. You know the drill.
					Gilded skull:
						look: Now that looks interesting.
						take: true
						
Bonus point for noticers- see the extra property on the Skull? That makes the item take-able, as you you might suppose.
					  

Event Basics
---------------
Events are the change agent in Picaro worlds.  They're how your players will face obstacles, solve puzzles, and ultimately win (or lose) the game.

Events are attached to actions. We say an event is "fired" when the player tries the action- when she combines a verb with a noun. There are two types: After Events and Before Events.  

"Befores" are generally "guards"- they check to see if some condition is met before they let the player perform the action.   An example might be an elevator that will only lower if the player is carrying a certain heavy object, or a character that will only talk with the player if they are dressed appropriately. 

"After Events", predictably, fire after the player performs the action.  They are the primary way in which players will change the game world.  After you take a forbidden idol, your after event might seal the door to the current room.  After attacking a dusty plaque, you might "destroy" it, or remove it from the game.  After looking at it, you might want to replace the item with a new, readable version. In both cases, you'd want to print a message to the player's screen describing what happened. Here's an example item with two actions, each having an Event attached.

		Dusty Plaque:
			attack:
		  		type: removeItem
		  		message: You hit the plaque with a closed hand. It disintegrates.
			look:
				type: replaceItem
			  	message: You blow the dust away from the plaque's surface. You think you can make out a message, now.
		  			newItem: 
		  				Clean Plaque:
			  			look: It says "Thanks for cleaning our plaque - the Management".

		
Miscellania
----------------
How you indent your story file doesn't much matter: use 1 tab, 2 tabs, 4 spaces, whatever floats your boat.  What IS important, however, is that your indentation levels stay consistent within the file. So try not to mix tabs and spaces, and make sure things at the same level of indentation line.

Property names should generally be lowercased.

The ID of a Room or Item is also copied to become it's "name", which is what the player will see in the UI.  However, it's sometimes easier to keep the ID short and machine-readable (like `livingRoom:` instead of `The Living Room:`, so a "name" property can always be added to provide a more human-readable name.
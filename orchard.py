from random import choice, randint, shuffle
from math import pow
import json
import string

class Orchard:
	
	def __init__(self, depth):
		self.squareFactor = int(pow(2, depth))
		
		self.colors = Grid(depth, 8)
		self.names = Grid(depth, 25)
		self.adjectives = Grid(depth, 25)
		self.conditions = Grid(depth, 9)
		
		self.goalX = randint(0, self.squareFactor)
		self.goalY = randint(0, self.squareFactor)
		
		self.rooms = Grid(depth, 0)
				
		self.branchAdjectives = ["angular", "branchy", "curled", "dendritic", "elegant", "flourishing", "gnarled", "hoary", "independent", "jostling", "kind", "loose", "meandering", "neat", "open", "pruned", "quavering", "rustling", "spread-out", "trembling", "undulating", "verdant", "waxy", "xylophone-ready", "young", "zephyr-touched"]

		self.fruitColors = ["silver", "emerald", "green", "yellow", "golden", "brown", "pink", "red", "ruby"]

		self.fruitConditions = ["soft", "malformed", "stippled", "ripening", "perfect", "lumpy", "wormy", "mealy", "crisp", "mouldering"]
		
		self.treeNouns = ["Actress", "Boilermaker", "Corporal", "Docent", "Elephant", "Firefighter", "Grandmother", "Hammerhead", "Independent", "Journeyman", "Knuckledragger", "Lord", "Milliner", "Neoconservative", "Overachiever", "Patriarch", "Quizmaster", "Rapunzel", "Schoolmarm", "Truant", "Ululator", "Vegetarian", "Winemaker", "Xenops", "Yearling", "Zookeeper"]
		self.treeAdjectives = ["accomplished", "beatific", "careworn", "druidic", "esteemed", "filthy", "geriatric", "hoary", "insatiable", "jocund", "kevlar", "loquacious", "moribund", "nocturnal", "old", "placid", "quiescent", "rapacious", "shrunken", "tumescent", "upright", "voluptuous", "wizened", "xenon", "yammering", "zaftig"]
		
		shuffle(self.treeNouns)
		shuffle(self.treeAdjectives)
		shuffle(self.branchAdjectives)
		
		for y in range(self.squareFactor + 1):
			for x in range(self.squareFactor + 1):
				adj = string.capitalize(self.treeAdjectives.pop())
				
				self.rooms.put(x, y, "The " + adj + " " + self.treeNouns.pop())
		#self.rooms.printme()
		
		shuffle(self.fruitConditions)	
	
	def printme(self):
		for y in range(self.squareFactor + 1):
			for x in range(self.squareFactor + 1):
				print str(x) + ", " + str(y) + ": " + self.branchAdjectives[self.adjectives.get(x, y)] + " branches, " + self.fruitConditions[self.conditions.get(x, y)] + " " + self.fruitColors[self.colors.get(x, y)] + " fruit."
	
	def getGoal(self):
		return self.goalApple
		
	def chooseApple(self, roomList):
		whichRoom = randint(0, len(roomList) - 1)
		
		whichItem = randint(0, len(roomList[whichRoom]['items']))
		
		return roomList[whichRoom]['items'][whichItem]['Name']
	
	def getRooms(self):
		roomList = []
		
		for y in range(self.squareFactor + 1):
			for x in range(self.squareFactor + 1):
				thisRoom = {}
				thisRoom['Name'] = self.rooms.get(x, y)
				thisRoom['Description'] = "It has " + self.branchAdjectives.pop() + " branches, and mostly " + self.fruitColors[self.colors.get(x, y)] + " fruit."
				paths = []
				if (x == 0):
					path = {}
					path['Name'] = self.rooms.get(x + 1, y)
					path['Direction'] = "East"
				elif (x == self.squareFactor):
					path = {}
					path['Name'] = self.rooms.get(x - 1, y)
					path['Direction'] = "West"
				else:
					path = {}
					path['Name'] = self.rooms.get(x + 1, y)
					path['Direction'] = "East"
					paths.append(path)
					path = {}
					path['Name'] = self.rooms.get(x - 1, y)
					path['Direction'] = "West"
				paths.append(path)
				
				if (y == 0):
					path = {}
					path['Name'] = self.rooms.get(x, y + 1)
					path['Direction'] = "South"
				elif (y == self.squareFactor):
					path = {}
					path['Name'] = self.rooms.get(x, y - 1)
					path['Direction'] = "North"
				else:
					path = {}
					path['Name'] = self.rooms.get(x, y + 1)
					path['Direction'] = "South"
					paths.append(path)
					path = {}
					path['Name'] = self.rooms.get(x, y - 1)
					path['Direction'] = "North"
				paths.append(path)
				
				thisRoom['paths'] = paths
				
				items = []
				
				numApples = randint(5, 22)
				for a in range(numApples):
					apple = {}
					
					baseColor = self.colors.get(x, y)
					if (baseColor == 0):
						baseColor2 = 8
					else:
						baseColor2 = baseColor - 1
					
					if (baseColor == 8):
						baseColor3 = 0
					else:
						baseColor3 = baseColor + 1
					
					appleColor = randint(0, 100)
					
					if (appleColor < 70):
						apple['Name'] = choice(self.fruitConditions) + " " + self.fruitColors[baseColor] + " apple"
					elif (appleColor < 85):
						apple['Name'] = choice(self.fruitConditions) + " " + self.fruitColors[baseColor2] + " apple"
					else:
						apple['Name'] = choice(self.fruitConditions) + " " + self.fruitColors[baseColor3] + " apple"
					
					#if ((x == self.goalX) and (y == self.goalY) and (a == 3)):
						#print "FOOBAR"
						#self.goalApple = apple['Name']
					
					apple['Take'] = "true"
					
					items.append(apple)
				
				thisRoom['items'] = items	
				roomList.append(thisRoom)
		
		return roomList

class Grid:
	
	def __init__(self, depth, maxVal):
		self.max = maxVal
		self.depthy = depth
		
		self.grid = []
		
		squareFactor = int(pow(2, depth))

		for y in range(squareFactor + 1):
			temp = []
			for x in range(squareFactor + 1):
				temp.append(-1)
			#print temp
			self.grid.append(temp)

		if maxVal > 0:
			self.grid[0][0] = randint(0, self.max)
			self.grid[0][squareFactor] = randint(0, self.max)
			self.grid[squareFactor][0] = randint(0, self.max)
			self.grid[squareFactor][squareFactor] = randint(0, self.max)

			self.displace(0, 0, squareFactor, squareFactor, 0)

	def printme(self):
		for row in self.grid:
			print row
			
	def get(self, x, y):
		return self.grid[y][x]
		
	def put(self, x, y, what):
		self.grid[y][x] = what
		return

	def displace(self, minX, minY, maxX, maxY, level):
		if level > self.depthy:
			return

		midX = (minX + maxX) / 2
		midY = (minY + maxY) / 2

		self.grid[midX][minY] = (self.grid[minX][minY] + self.grid[maxX][minY]) / 2
		self.grid[midX][maxY] = (self.grid[minX][maxY] + self.grid[maxX][maxY]) / 2
		self.grid[minX][midY] = (self.grid[minX][minY] + self.grid[minX][maxY]) / 2
		self.grid[maxX][midY] = (self.grid[maxX][minY] + self.grid[maxX][maxY]) / 2

		#displacer = randint(-(self.max/3), self.max/3) / (level + 1)
		displacer = randint(-2, 2) / (level + 1)

		self.grid[midX][midY] = ((self.grid[minX][minY] + self.grid[minX][maxY] + self.grid[maxX][minY] + self.grid[maxX][maxY]) / 4) + displacer

		if self.grid[midX][midY] < 0:
			self.grid[midX][midY] = 0

		if self.grid[midX][midY] > self.max:
			self.grid[midX][midY] = self.max


		#print self.land[midX][midY]
		#print "level is " + str(level) + " minX is " + str(minX) + " minY is " + str(minY) + " maxX is " + str(maxX) + " maxY is " + str(maxY) + " midX is " + str(midX) + " midY is " + str(midY) 

		self.displace(minX, minY, midX, midY, level + 1)
		self.displace(midX, minY, maxX, midY, level + 1)
		self.displace(minX, midY, midX, maxY, level + 1)
		self.displace(midX, midY, maxX, maxY, level + 1)
	

foo = Orchard(2)

titleWords = ["Quest", "Fight", "Search"]

antagonists = ["Astrid", "Beatrice", "Caroline", "Donnie", "Ebenezer", "Farrah", "Gordon", "Helga", "Ingrid", "Jacob", "Kurt", "LaVar", "Melanie", "Nancy", "Ovid", "Paulo", "Quentin", "Reggie", "Selma", "Terry", "Umberto", "Victor", "Wanda", "Yolanda", "Zed"]



futureOutput = {}

ant = choice(antagonists)

gameName = "The Orchard: " + choice(titleWords) + " for " + ant + "'s Apple"

futureOutput['gameName'] = gameName
futureOutput['noTake'] = "That isn't an apple."
futureOutput['noDo'] = "Not in this orchard."

futureOutput['Rooms'] = foo.getRooms()

futureOutput['Description'] = ant + " has demanded a " + foo.chooseApple(futureOutput['Rooms']) + ". Can you find one?"


#print futureOutput

print json.dumps(futureOutput, indent = 2)
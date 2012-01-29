<?

$episodeQuests = array("Search", "Quest", "Fight");

$antagonists = array("Astrid", "Beatrice", "Caroline", "Donnie", "Ebenezer", "Farrah", "Gordon", "Helga", "Ingrid", "Jacob", "Kurt", "LaVar", "Melanie", "Nancy", "Ovid", "Paulo", "Quentin", "Reggie", "Selma", "Terry", "Umberto", "Victor", "Wanda", "Yolanda", "Zed");

$apples = array();

$branchAdjectives = array("angular", "branchy", "curled", "dendritic", "elegant", "flourishing", "gnarled", "hoary", "independent", "jostling", "kind", "loose", "meandering", "neat", "open", "pruned", "quavering", "rustling", "spread-out", "trembling", "undulating", "verdant", "waxy", "xylophone-ready", "young", "zephyr-touched");
	
	
	
	
)

shuffle($episodeQuests);

shuffle($antagonists);

$mainAntagonist = array_pop($antagonists);

$gameName = "The Orchard: " . array_pop($episodeQuests) . " for " . $mainAntagonist . "'s Apple";

?>
<html>
{<br />
"gameName": "<?=$gameName)?>",<br />
"noTake": "You can't take that.",<br />
"noDo": "You can't take that.",<br />	


	
}
</html>
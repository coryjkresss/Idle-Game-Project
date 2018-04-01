var Engine = {
	
	var golemArmy = [];
	
	// Timing related Objects
	var timeThen = Date.now();
	var timeDeltaProduction = 0;
	var timeDeltaCombat = 0;
	var cycleProduction = 1000;
	var cycleCombat = 500;
	
	// 
	Init: function() {
		Engine.Load();
		Engine.Clock();
	},
    
	Clock: function() {
		
		var timeNow = Date.now();
		
		Engine.timeDeltaProduction += timeNow - Engine.timeThen;
		Engine.timeDeltaCombat += timeNow - Engine.timeThen;
		Engine.timeThen = timeNow;
		
		if(Engine.timeDeltaProduction >= Engine.cycleProduction || Engine.timeDeltaCombat >= Engine.cycleCombat) {
			if(Engine.timeDeltaProduction >= Engine.cycleProduction) {
				Engine.Production(Math.floor(Engine.timeDeltaProduction / Engine.cycleProduction));
				Engine.timeDeltaProduction %= Engine.cycleProduction;
			} else if(Engine.timeDeltaCombat >= Engine.cycleCombat) {
				Engine.Combat(Math.floor(Engine.timeDeltaCombat / Engine.cycleCombat));
				Engine.timeDeltaCombat %= Engine.cycleCombat;
			}
			Engine.Display();
		}
		window.requestAnimationFrame(Engine.Clock);
	},
	
	// Contains all aspects of production
	Production: function(value) {
		
	},
	
	// Contains all aspects of combat
	Combat: function(value) {
		
	},
	
	// Updates the display
	Display: function() {
		gold: null;
		mana: null;
		focusGems: null;
		stone: null;
		chiselledStone: null;
	},
	
	// Contains all of the information to be saved
	playerData: {
		timeLastPlayed: null;
		gold: 0;
		mana: 0;
		focusGems: 0;
		stone: 0;
		chiselledStone: 0;
	},
	
	// Saves the current game by converting the playerData object into a string and storing the string in localStorage
	Save: function() {
		
		// Set time of save
		Engine.playerData.timeLastPlayed = Date.now();
		
		// Convert playerData object into string
		var tmpSaveFile = JSON.Stringify(Engine.playerData);
		
		// Store in localStorage
		window.localStorage.setItem("Mage Quest Save File", tmpSaveFile);
		
		// News update
		console.log("Saved!")
	},
	
	// Checks if a save game is in the localStorage
	// If save data is found the file is converted back into an object
	Load: function() {
		
		// Checks for a save file
		if(!window.localStorage.getItem("Mage Quest Save File")) {
			
			// News update
			console.log("No save file present to load.");
			
		} else {
			
			// Get save file
			var tmpSaveFile = window.localStorage.getItem("Mage Quest Save File");
			
			// Parse the save file
			Engine.playerData = JSON.parse(tmpSaveFile);
			
			
			// News update
			console.log("Save file loaded successfully!");
			
		}
	},
	
	// Deletes any save games in localStorage
	Delete: function() {
		
		// Checks for a save file
		if (!window.localStorage.getItem("Mage Quest Save File")) {
			
			// News update
			console.log("No save file present to delete.");
			
		} else {
			
			
			// Remove the save file
			window.localStorage.removeItem("Mage Quest Save File");
			
			// News update
			console.log("Save file deleted successfully.");
			
		}
	}
	
	GolemCreation: function() {
		// [Type, HP, Damage, Armor, Speed, Mana Cost, Type of focus, Focus Gems, Material Cost]
		var golemCombined = [];
		
		golemCombined.push(
			(golemSelectedInfusion + " " + magicSchool + " Golem of " + golemSelectedMaterial),
			(golemSelectedInfusionHp + golemSelectedMaterialHp),
			(golemSelectedInfusionDamage + golemSelectedMaterialDamage),
			(golemSelectedInfusionArmor + golemSelectedMaterialArmor),
			(golemSelectedInfusionSpeed + golemSelectedMaterialSpeed),
			golemSelectedInfusionMana,
			golemSelectedInfusionFocusGems,
			golemSelectedMaterialCost);

		Engine.golemArmy.push(golemCombined[0]);
	},
	
	ConcentrationCheck: function(value) {
		switch(value){
			default:
				console.log('Error in ConcentrationCheck function');
				break;
			case value = "Mana":
				document.getElementById('buttonMana').style.borderColor: #2196F3;
				document.getElementById('buttonMana').style.color: dodgerblue;
				
				
				
	}
};

window.onload = Engine.Init();








































	//Variable creation
	var magicSchool = 'Arcane';
	var mana = 1000;
	var gold = 1000;
	var stone = 1000;
	var chiselledStone = 1000;

	//Focus gem variables
	var focusGems = 1000;
	var focusGemsBaseChance = 1300;
	var focusGemsChance = focusGemsBaseChance;

	// Golem variables
	// golem army
	var golemArmy = [];
	// Material variables
	// Rocks and dirt material stats [Type, HP, Damage, Armor, Speed]
	var materialDirt = ['Rocks and Dirt', 1, 0, 0, 0];
	// Rough Stone material stats [Type, HP, Damage, Armor, Speed, Cost]
	var materialStone = ['Rough Stone', 10, 2, 1, 0, 1];
	// Chiselled Stone material stats [Type, HP, Damage, Armor, Speed, Cost]
	var materialChiselled = ['Chiselled Stone', 12, 5, 4, 0, 1];

	// Infusion variables
	// Poorly Infused infusion stats [Type, HP, Damage, Armor, Speed, Mana Cost, Focus Gems]
	var infusionPoorly = ['Poorly Infused', 1, 1, 0, 0, 1, 1];
	// Weakly Infused infustion stats [Type, HP, Damage, Armor, Speed, Mana Cost, Focus Gems]
	var infusionWeakly = ['Weakly Infused', 4, 1, 0, 0, 10, 1];
	// Infused infusion stats [Type, HP, Damage, Armor, Speed, Mana Cost, Focus Gems]
	var infusionInfused = ['Infused', 20, 5, 0, 0, 100, 1];

	// Demon variables
	// Current demon based on zone
	var maxZone = 0;
	var currentZone = 0;

	// Basic demons
	// Imp stats [Type, HP, Damage, Armor, Speed, Bounty]
	var demonImp = ['Imp', 1, 1, 0, 0, 1];




// Selects the correct material for golem construction
SelectGolemMaterial: function(value) {
	switch(value){
		default:
			console.log('Error in SelectGolemMaterial function');
			break;
		case value = materialDirt[0]:
			golemSelectedMaterial = materialDirt[0];
			golemSelectedMaterialHp = materialDirt[1];
			golemSelectedMaterialDamage = materialDirt[2];
			golemSelectedMaterialArmor = materialDirt[3];
			golemSelectedMaterialSpeed = materialDirt[4];
			golemSelectedMaterialCost = 0;
			break;
		case value = materialStone[0]:
			golemSelectedMaterial = materialStone[0];
			golemSelectedMaterialCost = materialStone[5];
			golemSelectedMaterialAmount = stone;
			golemSelectedMaterialHp = materialStone[1];
			golemSelectedMaterialDamage = materialStone[2];
			golemSelectedMaterialArmor = materialStone[3];
			golemSelectedMaterialSpeed = materialStone[4];
			break;
		case value = materialChiselled[0]:
			golemSelectedMaterial = materialChiselled[0];
			golemSelectedMaterialCost = materialChiselled[5];
			golemSelectedMaterialAmount = chiselledStone;
			golemSelectedMaterialHp = materialChiselled[1];
			golemSelectedMaterialDamage = materialChiselled[2];
			golemSelectedMaterialArmor = materialChiselled[3];
			golemSelectedMaterialSpeed = materialChiselled[4];
			
	}
	golemCombinationCreation();
}

function SelectGolemInfusion(value){
	switch(value){
		default:
			console.log('Error in SelectGolemInfusion function');
			break;
		case value = infusionPoorly[0]:
			golemSelectedInfusion = infusionPoorly[0];
			golemSelectedInfusionMana = infusionPoorly[5];
			golemSelectedInfusionFocusGems = infusionPoorly[6];
			golemSelectedInfusionHp = infusionPoorly[1];
			golemSelectedInfusionDamage = infusionPoorly[2];
			golemSelectedInfusionArmor = infusionPoorly[3];
			golemSelectedInfusionSpeed = infusionPoorly[4];
			break;
		case value = infusionWeakly[0]:
			golemSelectedInfusion = infusionWeakly[0];
			golemSelectedInfusionMana = infusionWeakly[5];
			golemSelectedInfusionFocusGems = infusionWeakly[6];
			golemSelectedInfusionHp = infusionWeakly[1];
			golemSelectedInfusionDamage = infusionWeakly[2];
			golemSelectedInfusionArmor = infusionWeakly[3];
			golemSelectedInfusionSpeed = infusionWeakly[4];
			break;
		case value = infusionInfused[0]:
			golemSelectedInfusion = infusionInfused[0];
			golemSelectedInfusionMana = infusionInfused[5];
			golemSelectedInfusionFocusGems = infusionInfused[6];
			golemSelectedInfusionHp = infusionInfused[1];
			golemSelectedInfusionDamage = infusionInfused[2];
			golemSelectedInfusionArmor = infusionInfused[3];
			golemSelectedInfusionSpeed = infusionInfused[4];
	}
	golemCombinationCreation();
}

function createGolemCombination(){
	if(mana >= golemCombinedCostInfusion && golemSelectedMaterialAmount >= golemCombinedCostMaterial && focusGems >= golemSelectedInfusionFocusGems){
		golems.push(golemCombination);
	}
	console.log(golems);
}
// Checks zone and adjusted demon you will be fighting
function demon_zone_check(){
	switch(){
		default:
			console.log('Error in demon_zone_check function');
			break;
		case currentZone >= 1 && currentZone%10 > 0:
			demonCurrentType = demonTypeImp;
			currentBounty = demonImpBounty;
			demonCurrentHp = demonImpHp;
			demonCurrentDamage = demonImpDamage;
			demonCurrentArmor = demonImpArmor;
			demonCurrentSpeed = demonImpSpeed;
			break;
		case currentZone % 10 === 0:
			demonCurrentType = demonTypeLesserImp;
			currentBounty = demonLesserImpBounty;
			demonCurrentHp = demonLesserImpHp;
			demonCurrentDamage = demonLesserImpDamage;
			demonCurrentArmor = demonLesserImpArmor;
			demonCurrentSpeed = demonLesserImpSpeed;
	}
	document.getElementById("demon_current_zone") = currentZone;
	document.getElementById("demon_current_type") = demonCurrentType;
	document.getElementById("demon_current_bounty") = currentBounty;
	document.getElementById("demon_current_stats_hp") = demonCurrentHp;
	document.getElementById("demon_current_stats_damage") = demonCurrentDamage;
	document.getElementById("demon_current_stats_armor") = demonCurrentArmor;
	document.getElementById("demon_current_stats_speed") = demonCurrentSpeed;
}

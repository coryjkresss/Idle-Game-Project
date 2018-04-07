var Engine = {
	
	// Basic Resources
	mana: 0,
	roughCrystals: 0,
	cutCrystals: 0,
	infusedCrystals: 0,
	gold: 0,
	roughStone: 0,
	cutStone: 0,
	
	// Base Resource values
	manaBase: 0,
	crystallizingBase: 100,
	cutCrystalBase: 0,
	infusingBase: 0,
	
	// Concentrations
	manaConcentration: 0,
	cuttingConcentration: 0,
	infusingConcentration: 0,
	creationConcentration: 0,
	castingConcentration: 0,
	
	// Rates and Chances
	manaRate: 0,
	manaConcentrationRate: 0,
	crystallizationChance: 0,
	cutRate: 0,
	cuttingConcentrationRate: 0,
	infusingRate: 0,
	infusingConcentrationRate: 0,
	creationRate: 0,
	
	// Player Statics
	attunementLevel: 0,
	manaLevel: 1,
	crystallizingLevel: 1,
	cuttingLevel: 1,
	infusingLevel: 1,
	creationLevel: 1,
	spellLevel: 1,
	
	// Experience 
	manaExperience: 0,
	crystallizingExperience: 0,
	cuttingExperience: 0,
	infusingExperience: 0,
	creationExperience: 0,
	spellExperience: 0,	
	
	// Types
	cuttingType: "Haphazardly",
	infusionType: "Faintly",
	
	// Counters
	manaCounter: 0,
	crystallizationCounter: 0,
	cuttingCounter: 0,
	infusingCounter: 0,
	creationCounter: 0,
	castingCounter: 0,
	
	golemArmy: [],
	
	// Timing related Objects
	timeThen: Date.now(),
	timeDeltaProduction: 0,
	timeDeltaCombat: 0,
	cycleProduction: 1000,
	cycleCombat: 500,
	
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
			}
			if(Engine.timeDeltaCombat >= Engine.cycleCombat) {
				Engine.Combat(Math.floor(Engine.timeDeltaCombat / Engine.cycleCombat));
				Engine.timeDeltaCombat %= Engine.cycleCombat;
			}
			Engine.Display();
		}
		window.requestAnimationFrame(Engine.Clock);
	},
	
	// Contains all aspects of production
	Production: function(value) {
		
		Engine.SetCounters(0);
		Engine.RateCalculations(value);
		
		if(Engine.manaRate > 0) {
			Engine.ManaCalculations();
			Engine.CrystalCalculations(value);
		}
		
		if(Engine.cutRate > 0 && Engine.roughCrystals > 0) {
			Engine.CutCrystals();
		}
		
		if(Engine.infusingRate > 0 && Engine.cutCrystals > 0 && Engine.mana >= Engine.cuttingMax) {
			Engine.InfuseCrystals();
		}
		
		Engine.ConcentrationExperience();
		
		Engine.LevelingCheck();
		
		Engine.RateCalculations(Engine.cycleProduction/1000);
	},
	
	RateCalculations: function(value) {
		Engine.manaConcentrationRate = (Engine.manaConcentration * Engine.manaLevel + Engine.attunementLevel) * value;
    Engine.cuttingConcentrationRate = Engine.cuttingConcentration * value;
		Engine.infusingConcentrationRate = Engine.infusingConcentration * value;    
    Engine.manaRate = (Engine.manaBase * Engine.attunementLevel + Engine.manaConcentration * Engine.manaLevel + Engine.attunementLevel) * value;
		Engine.crystallizationChance = Engine.crystallizingBase * Engine.crystallizingLevel + Engine.attunementLevel;
		Engine.cutRate = (Engine.cutCrystalBase * Engine.cuttingLevel + Engine.cuttingConcentration * Engine.cuttingLevel + Engine.attunementLevel) * value;
    Engine.infusingRate = (Engine.infusingBase * Engine.infusingLevel + Engine.infusingConcentration * Engine.infusingLevel + Engine.attunementLevel) * value;
		
	},
	
	ManaCalculations: function() {
		
		Engine.mana += Engine.manaRate;
    
    if(Engine.manaConcentration > 0) {
			Engine.manaExperience += Engine.manaConcentrationRate;
      }
	},
	
	CrystalCalculations: function(value) {
		
		var i = 0;
    var tempCrystallizations = Math.floor(Engine.crystallizationChance / 100);
		var tempCrystallizationChance = Engine.crystallizationChance % 100;
    
    Engine.roughCrystals += tempCrystallizations;
    
    if(Engine.manaConcentration > 0) {
					Engine.crystallizationCounter += tempCrystallizations;
		}
    
		while(i < value) {
			
			if(Math.floor(Math.random() * 101) < tempCrystallizationChance) {
				
				Engine.roughCrystals++;
				
				if(Engine.manaConcentration > 0) {
					
					Engine.crystallizationCounter++;
				}
			}
			
			i++;
		}
	},
	
	CutCrystals: function() {
		
		var tempCuttingCount = Math.Min(Engine.cuttingRate, Engine.roughCrystals);
    
			Engine.cutCrystals += tempCuttingCount;
			Engine.roughCrystals -= tempCuttingCount;
      
      if(Engine.cuttingConcentrataion > 0) {
      	Engine.cuttingCounter += Math.Min(Engine.cuttingConcentrationRate, tempCuttingCount);
      }
	},
	
	InfuseCrystals: function() {
   
    var tempInfusingCount = Math.Min(Engine.infusingRate, Engine.cutCrystals, (Engine.mana/Engine.cuttingMax));
    
    Engine.mana -= tempInfusingCount * Engine.cuttingMax;
    Engine.cutCrystals -= tempInfusingCount;
    Engine.infusedCrystals += tempInfusingCount;
    
    if(Engine.infusingConcentration > 0) {
    	Engine.infusingCounter += Math.Min(Engine.infusingConcentrationRate, tempInfusingCount); 
    }
	},
	
	ConcentrationExperience() {
		 += Engine.manaCounter;
		Engine.crystallizingExperience += Engine.crystallizationCounter;
		Engine.cuttingExperience += Engine.cuttingCounter;
		Engine.infusingExperience += Engine.infusingCounter;
		Engine.creationExperience += Engine.creationCounter;
		Engine.spellExperience += Engine.castingCounter;
	},
	
	SetCounters: function(value) {
		Engine.manaCounter = value;
		Engine.crystallizationCounter = value;
		Engine.cuttingCounter = value;
		Engine.infusingCounter = value;
		Engine.creationCounter = value;
		Engine.castingCounter = value;
	},
	
	LevelingCheck: function() {
		
		if(Engine.attunementLevel < 0) {
			Engine.attunementLevel++;
		}
		
		if(Engine.manaLevel < (Engine.manaExperience - Engine.manaLevel)) {
			Engine.manaLevel++;
			Engine.manaExperience = 0;
		}
		
		if(Engine.crystallizingLevel  < (Engine.crystallizingExperience - Engine.crystallizingLevel)) {
			Engine.crystallizingLevel++;
			Engine.crystallizingExperience = 0;
		}
		
		if(Engine.cuttingLevel < (Engine.cuttingExperience - Engine.cuttingLevel)) {
			Engine.cuttingLevel++;
			Engine.cuttingExperience = 0;
		}
		
		if(Engine.infusingLevel < (Engine.infusingExperience - Engine.infusingLevel)) {
			Engine.infusingLevel++;
			Engine.infusingExperience = 0;
		}
		
		if(Engine.creationLvel < (Engine.creationExperience - Engine.creationLevel)) {
			Engine.creationLevel++;
			Engine.creationExperience = 0;
		}		
		
		if(Engine.spellLevel < (Engine.spellExperience - Engine.spellLevel)) {
			Engine.spellLevel++;
			Engine.spellExperience = 0;
		}
	},
	
	// Contains all aspects of combat
	Combat: function(value) {
		
	},
	
	// Updates the display
	Display: function() {
		
		// Basic Resources 
		document.getElementById('mana').innerHTML = Engine.mana;
		document.getElementById('roughCrystals').innerHTML = Engine.roughCrystals;
		document.getElementById('cutCrystals').innerHTML = Engine.cutCrystals;
		document.getElementById('infusedCrystals').innerHTML = Engine.infusedCrystals;
		
		// Rates and Chances
		document.getElementById('manaRate').innerHTML = Engine.manaRate;
		document.getElementById('cutRate').innerHTML = Engine.cutRate;
		document.getElementById('infusingRate').innerHTML = Engine.infusingRate;
		
		// Player Levels
		document.getElementById('attunementLevel').innerHTML = Engine.attunementLevel;
		document.getElementById('manaLevel').innerHTML = Engine.manaLevel;
		document.getElementById('crystallizingLevel').innerHTML = Engine.crystallizingLevel;
		document.getElementById('cuttingLevel').innerHTML = Engine.cuttingLevel;
		document.getElementById('infusingLevel').innerHTML = Engine.infusingLevel;
		document.getElementById('creationLevel').innerHTML = Engine.creationLevel;
		document.getElementById('spellLevel').innerHTML = Engine.spellLevel;
		
		// Types
		document.getElementById('cuttingType').innerHTML = Engine.cuttingType;
		document.getElementById('infusionType').innerHTML = Engine.infusionType;
	},
	
	// Contains all of the information to be saved
	playerData: {
  
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
	},
	
	//GolemCreation: function() {
	//	// [Type, HP, Damage, Armor, Speed, Mana Cost, Type of focus, Focus Gems, Material Cost]
	//	var golemCombined = [];
	//	
	//	golemCombined.push(
	//		(golemSelectedInfusion + " " + magicSchool + " Golem of " + golemSelectedMaterial),
	//		(golemSelectedInfusionHp + golemSelectedMaterialHp),
	//		(golemSelectedInfusionDamage + golemSelectedMaterialDamage),
	//		(golemSelectedInfusionArmor + golemSelectedMaterialArmor),
	//		(golemSelectedInfusionSpeed + golemSelectedMaterialSpeed),
	//		golemSelectedInfusionMana,
	//		golemSelectedInfusionFocusGems,
	//		golemSelectedMaterialCost);
    //
	//	Engine.golemArmy.push(golemCombined[0]);
	//},
	
	Concentration: function(value) {
		
		Engine.ResetConcentration();
		
		switch(value) {
			default:
				console.log('Error in Concentration function');
				break;
			case value = "mana":
				document.getElementById('manaButton').style.backgroundColor = "#737373";
				Engine.manaConcentration = 1;
				break;
			case value = "cutting":
				document.getElementById('cuttingButton').style.backgroundColor = "#737373";
				Engine.cuttingConcentration = 1;
				break;
			case value = "infusing":
				document.getElementById('infusingButton').style.backgroundColor = "#737373";
				Engine.infusingConcentration = 1;
				break;
			case value = "creation":
				document.getElementById('creationButton').style.backgroundColor = "#737373";
				Engine.creationConcentration = 1;
				break;
			case value = "casting":
				document.getElementById('castingButton').style.backgroundColor = "#737373";
				Engine.castingConcentration = 1;
		}		
	},

	ResetConcentration: function() {
	
		var l = document.getElementsByClassName('buttonConcentration').length;
		var i = 0;
		
		while(i < l) {
			
			document.getElementsByClassName('buttonConcentration')[i].style.backgroundColor = "#cccccc";
			i++;
		}
		
		Engine.manaConcentration = 0;
		Engine.cuttingConcentration = 0;
		Engine.infusingConcentration = 0;
		Engine.creationConcentration = 0;
		Engine.castingConcentration = 0;
	}
};

window.onload = Engine.Init();

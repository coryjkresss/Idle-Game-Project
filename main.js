var Engine = {
	
	// Updates and todo
	// 4/3/18 - get save function up and running
	// 4/4/18 - on to spells!
	// 4/21/18 - At some point rounding will need to be taken care of for displayed numbers
	// 4/21/18 - Go over cut and infusion types for flow
	
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
	creationBase: 0,
	
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
	cuttingRate: 0,
	cuttingConcentrationRate: 0,
	infusingRate: 0,
	infusingConcentrationRate: 0,
	creationRate: 0,
	
	// Player Statics
	attunementLevel: 1,
	manaLevel: 1,
	crystallizingLevel: 1,
	cuttingLevel: 1,
	infusingLevel: 1,
	creationLevel: 1,
	spellLevel: 1,
	
	// Player Adjusted Levels
	manaAdjustedLevel: 0,
	crystallizingAdjustedLevel: 0,
	cuttingAdjustedLevel: 0,
	infusingAdjustedLevel: 0,
	creationAdjustedLevel: 0,
	spellAdjustedLevel: 0,
	
	// Experience 
	attunementExperience: 0,
	manaExperience: 0,
	crystallizingExperience: 0,
	cuttingExperience: 0,
	infusingExperience: 0,
	creationExperience: 0,
	spellExperience: 0,	
	
	// Level Gates
	attunmentLevelGate: 100,
	
	// Cut Crystal Max mana
	cuttingMax: 5,
	infusingCap: 0.01,
	infusedMana: 0,
	
	// Types
	cuttingType: "Awfully",
	infusingType: "Weakly",	
	
	golemArmy: [],
	
	// Timing related Objects
	timeThen: Date.now(),
	timeDeltaProduction: 0,
	timeDeltaSpellsCombat: 0,
	timeDeltaGolemsCombat: 0,
	cycleProduction: 1000,
	cycleSpellsCombat: 5000,
	cycleGolemsCombat: 10000,
	
	// Delta's of resource production
	manaDelta: 0,
	crystallizationDelta: 0,
	cuttingDelta: 0,
	infusingDelta: 0,
	creationDelta: 0,
	castingDelta: 0,
	
	// Previous Cycle numbers
	manaInitial: 0,
	crystallizationInitial: 0,
	cuttingInitial: 0,
	infusingInitial: 0,
	creationInitial: 0,
	castingInitial: 0,
	

	Init: function() {
		Engine.Load();
		Engine.Display();
		Engine.Clock();
	},
    
	Clock: function() {
		
		var timeNow = Date.now();
		
		Engine.timeDeltaProduction += timeNow - Engine.timeThen;
		Engine.timeDeltaSpellsCombat += timeNow - Engine.timeThen;
		Engine.timeDeltaGolemsCombat += timeNow - Engine.timeThen;
		Engine.timeThen = timeNow;
		
		if(Engine.timeDeltaProduction >= Engine.cycleProduction || Engine.timeDeltaSpellsCombat >= Engine.cycleSpellsCombat || Engine.timeDeltaGolemsCombat >= Engine.cycleGolemsCombat) {
			if(Engine.timeDeltaProduction >= Engine.cycleProduction) {
				Engine.Production(Math.floor(Engine.timeDeltaProduction / Engine.cycleProduction));
				Engine.timeDeltaProduction %= Engine.cycleProduction;
			}
			if(Engine.timeDeltaSpellsCombat >= Engine.cycleSpellsCombat) {
				Engine.SpellsCombat(Math.floor(Engine.timeDeltaSpellsCombat / Engine.cycleSpellsCombat));
				Engine.timeDeltaSpellsCombat %= Engine.cycleSpellsCombat;
			}
			if(Engine.timeDeltaGolemsCombat >= Engine.cycleGolemsCombat) {
				Engine.GolemsCombat(Math.floor(Engine.timeDeltaGolemsCombat / Engine.cycleGolemsCombat));
				Engine.timeDeltaGolemsCombat %= Engine.cycleGolemsCombat;
			}
			Engine.Display();
		}

		window.requestAnimationFrame(Engine.Clock);
	},
	
	// Contains all aspects of production
	Production: function(value) {
		
		Engine.RateCalculations(value);
		
		if(Engine.manaRate > 0) {
			Engine.manaCalculations();
			Engine.crystalCalculations(value);
		}
		
		if(Engine.cuttingRate > 0 && Engine.roughCrystals > 0) {
			Engine.CutCrystals();
		}
		
		if(Engine.infusingRate > 0 && Engine.cutCrystals > 0 && Engine.mana >= Engine.cuttingMax) {
			Engine.InfusingCrystals();
		}
		
		Engine.ConcentrationExperience();
		
		Engine.LevelingCheck();
		
		Engine.ResourceDeltaCalculations();
	},
	
	ResourceDeltaCalculations: function() {
		Engine.manaDelta = Engine.mana - Engine.manaInitial;
		Engine.crystallizationDelta = Engine.crystallization - Engine.crystallizationInitial;
		Engine.cuttingDelta = Engine.cutCrystals - Engine.cuttingInitial;
		Engine.infusingDelta = Engine.infusedCrystals - Engine.infusingInitial;
		Engine.creationDelta = Engine.golemArmy.length - Engine.creationInitial;
		Engine.castingDelta = Engine.castingCount - Engine.castingInitial;
		
		Engine.manaInitial = Engine.mana;
		Engine.crystallizationInitial = Engine.crystallization;
		Engine.cuttingInitial = Engine.cutCrystals;
		Engine.infusingInitial = Engine.infusedCrystals;
		Engine.creationInitial = Engine.golemArmy.length;
		Engine.castingInitial = Engine.castingCount;		
	},
	
	RateCalculations: function(value) {
		
		Engine.AttunementLevelAdjustment();
		
		Engine.manaRate = (Engine.manaBase * Engine.manaAdjustedLevel + Engine.manaConcentration * Engine.manaAdjustedLevel) * value;
		Engine.manaConcentrationRate = Engine.manaConcentration * value;
		// Correct this formula 
		Engine.crystallizationChance = Engine.crystallizingBase * Engine.crystallizingAdjustedLevel;
		Engine.cuttingRate = (Engine.cutCrystalBase * Engine.cuttingAdjustedLevel + Engine.cuttingConcentration * Engine.cuttingAdjustedLevel) * value;
		Engine.cuttingConcentrationRate = Engine.cuttingConcentration * value;
		Engine.infusingRate = (Engine.infusingBase * Engine.infusingAdjustedLevel + Engine.infusingConcentration * Engine.infusingAdjustedLevel) * value;
		Engine.infusingConcentrationRate = Engine.infusingConcentration * value;
	},
	
	AttunementLevelAdjustment: function() {
		
		Engine.manaAdjustedLevel = Engine.manaLevel * Engine.attunementLevel + (Engine.attunementLevel - 1);
		Engine.crystallizingAdjustedLevel = Engine.crystallizingLevel * Engine.attunementLevel;
		Engine.cuttingAdjustedLevel = Engine.cuttingLevel * Engine.attunementLevel;
		Engine.infusingAdjustedLevel = Engine.infusingLevel * Engine.attunementLevel;
		Engine.creationAdjustedLevel = Engine.creationLevel * Engine.attunementLevel;
		Engine.spellAdjustedLevel = Engine.spellLevel * Engine.attunementLevel;
	},
	
	manaCalculations: function() {
		
		Engine.mana += Engine.manaRate;
		Engine.manaExperience += Engine.manaConcentrationRate;
	},

	CrystalCalculations: function(value) {
		
		var i = 0;
		var tempCrystallizations = Math.floor(Engine.crystallizationChance / 100);
		var tempCrystallizationChance = Engine.crystallizationChance % 100;
    
		Engine.roughCrystals += tempCrystallizations * value;
    
		if(Engine.manaConcentration > 0) {
			Engine.crystallizingExperience += tempCrystallizations * value;
		}
    
		while(i < value) {
			if(Math.floor(Math.random() * 101) <= tempCrystallizationChance) {
				Engine.roughCrystals++;
				
				if(Engine.manaConcentration > 0) {
					Engine.crystallizingExperience++;
				}
			}
			
			i++;
		}
	},
	
	CutCrystals: function() {
		var tempCuttingCount = Math.Min(Engine.cuttingRate, Engine.roughCrystals);
    
		Engine.cutCrystals += tempCuttingCount;
		Engine.roughCrystals -= tempCuttingCount;
		Engine.cuttingExperience += Math.Min(Engine.cuttingConcentrationRate, tempCuttingCount);
		
	},
	
	CuttingCrystalTypeCheck: function() {
		if(Engine.cuttingLevel >= 10) {
			Engine.cuttingMax = 10;
			Engine.cuttingType = "Haphazardly";
		} else if(Engine.cuttingLevel >= 20) {
			Engine.cuttingMax = 20;
			Engine.cuttingType = "Poorly";
		} else if(Engine.cuttingLevel >= 30) {
			Engine.cuttingMax = 30;
			Engine.cuttingType = "Asymmetrically"
		} else if(Engine.cuttingLevel >= 40) {
			Engine.cuttingMax = 40;
			Engine.cuttingType = "Symmetrically"
		} else if(Engine.cuttingLevel >= 50) {
			Engine.cuttingMax = 50;
			Engine.cuttingType = "Expertly";
		} else if(Engine.cuttingLevel >= 60) {
			Engine.cuttingMax = 60;
			Engine.cuttingType = "Beautifully";
		} else if(Engine.cuttingLevel >= 70) {
			Engine.cuttingMax = 70;
			Engine.cuttingType = "Dazzlingly";
		} else if(Engine.cuttingLevel >= 80) {
			Engine.cuttingMax = 80;
			Engine.cuttingType = "Brilliantly";
		} else if(Engine.CuttingLevel >= 90) {
			Engine.cuttingMax = 90;
			Engine.cuttingType = "Astonishingly";
		} else if(Engine.cuttingLevel >= 100) {
			Engine.cuttingMax = 100;
			Engine.cuttingType = "Scintillating";
		} else if(Engine.cuttingLevel >= 110) {
			Engine.cuttingMax = 200;
			Engine.cuttingType = "Iridescent";
		}
	},
	
	InfusingCrystalTypeCheck: function() {
		if(Engine.infusingLevel >= 10) {
			Engine.infusingCap = 0.1;
			Engine.infusingType = "Faintly";
		} else if(Engine.infusingLevel > 20) {
			Engine.infusingCap = 0.2;
			Engine.infusingType = "Minimally";
		} else if(Engine.infusingLevel > 30) {
			Engine.infusingCap = 0.3;
			Engine.infusingType = "Barely";
		} else if(Engine.infusingLevel > 40) {
			Engine.infusingCap = 0.4;
			Engine.infusingType = "Slightly";
		} else if(Engine.infusingLevel > 50) {
			Engine.infusingCap = 0.5;
			Engine.infusingType = "Infused";
		} else if(Engine.infusingLevel > 60) {
			Engine.infusingCap = 0.6;
			Engine.infusingType = "PLACE_HOLDER_INFUSING_0.6";
		} else if(Engine.infusingLevel > 70) {
			Engine.infusingCap = 0.7;
			Engine.infusingType = "Strongly";
		} else if(Engine.infusingLevel > 80) {
			Engine.infusingCap = 0.8;
			Engine.infusingType = "PLACE_HOLDER_INFUSING_0.8";
		} else if(Engine.infusingLevel > 90) {
			Engine.infusingCap = 0.9;
			Engine.infusingType = "PLACE_HOLDER_INFUSING_0.9";
		} else if(Engine.infusingLevel > 100) {
			Engine.infusingCap = 1;
			Engine.infusingType = "Precisely";
		} else if(Engine.infusingLevel > 110) {
			Engine.infusingCap = 2;
			Engine.infusingType = "PLACE_HOLDER_INFUSING_2";
		}
	},
	
	InfuseCrystals: function() {
   
		var tempInfusingCount = Math.Min(Engine.infusingRate, Engine.cutCrystals, Math.floor(Engine.mana/Engine.cuttingMax));
		
		Engine.mana -= tempInfusingCount * Engine.cuttingMax;
		Engine.cutCrystals -= tempInfusingCount;
		Engine.infusedCrystals += tempInfusingCount;
		Engine.infusingExperience += Math.Min(Engine.infusingConcentrationRate, tempInfusingCount); 
		Engine.infusedMana = Engine.cuttingMax * Engine.infusionCap;
	},
	
	LevelingCheck: function() {
		
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
			Engine.CuttingCrystalTypeCheck();
		}
		
		if(Engine.infusingLevel < (Engine.infusingExperience - Engine.infusingLevel)) {
			Engine.infusingLevel++;
			Engine.infusingExperience = 0;
			Engine.InfusingCrystalTypeCheck();
		}
		
		if(Engine.creationLvel < (Engine.creationExperience - Engine.creationLevel)) {
			Engine.creationLevel++;
			Engine.creationExperience = 0;
		}		
		
		if(Engine.spellLevel < (Engine.spellExperience - Engine.spellLevel)) {
			Engine.spellLevel++;
			Engine.spellExperience = 0;
		}
		
		Engine.AttunementExperienceCheck();
		
		if(Engine.attunementExperience < (Engine.attunementExperience - Engine.attunmentLevelGate)) {
			Engine.attunementLevel++;
			Engine.attunmentLevelGate += 100;
		}
	},
	
	AttunementExperienceCheck: function() {
		Engine.attunementExperience = Engine.manaLevel + Engine.crystallizingLevel + Engine.cuttingLevel + Engine.infusingLevel + Engine.creationLevel + Engine.spellLevel;
	},
	
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
	},
	// All objects will need to be declared in this function.
	SpellsCombat: function(value) {
		if(Engine.castingConcentration > 0 && Engine.mana > SPELL_MANA_PLACE_HOLDER*value) {
			
		}
	},
	
	// Contains all aspects of combat
	GolemsCombat: function(value) {
		
	},
	
	// Updates the display
	Display: function() {
		
		// Basic Resources 
		document.getElementById('mana').innerHTML = Engine.mana;
		document.getElementById('roughCrystals').innerHTML = Engine.roughCrystals;
		document.getElementById('cutCrystals').innerHTML = Engine.cutCrystals;
		document.getElementById('infusedCrystals').innerHTML = Engine.infusedCrystals;
		
		// Rates and Chances
		document.getElementById('manaRate').innerHTML = Engine.manaDelta;
		document.getElementById('cuttingRate').innerHTML = Engine.cuttingDelta;
		document.getElementById('infusingRate').innerHTML = Engine.infusingDelta;
		
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
		document.getElementById('infusingType').innerHTML = Engine.infusingType;
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
			Engine.CuttingCrystalTypeCheck();
			Engine.InfusingCrystalTypeCheck();
			//Engine.Loading();
			
			// News update
			console.log("Save file loaded successfully!");
			
		}
	},
	
	//Loading: function() {
	//	Engine.mana = Engine.playerData.manaSave;
	//},
	
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
	//}
};

window.onload = Engine.Init();

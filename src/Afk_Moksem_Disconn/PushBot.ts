class Line{
	linePoints:Vector[] = [];
	buildingNames:string[] = [];
	constructor(linePoints:Vector[], buildingNames:string[]) {
		this.linePoints = linePoints
		this.buildingNames = buildingNames
	}
}

class RadiantLines{
	static Home = new Vector(-7045.0625,-6536.0625,512);
	static Top = new Line([
		new Vector(-5956.6875,5439.90625,256),
		new Vector(-1583,6085.5,256),
		new Vector(2119.34375,5880.5,256),
		new Vector(3561.0625,5596.84375,384),
		new Vector(5132.53125,4631.28125,392)
		],[
		"npc_dota_badguys_tower1_top",
		"npc_dota_badguys_tower2_top",
		"npc_dota_badguys_tower3_top",
		"npc_dota_badguys_tower4",
		"npc_dota_badguys_fort"
		]);
	static Middle = new Line([
		new Vector(-568.5, -379.59375, 128),
		new Vector(1645.65625,1275.46875,256),
		new Vector(3290.75,2798.0625,256),
		new Vector(4493.78125,3694.25,384),
		new Vector(5132.53125,4631.28125,392)
		], [
		"npc_dota_badguys_tower1_mid",
		"npc_dota_badguys_tower2_mid",
		"npc_dota_badguys_tower3_mid",
		"npc_dota_badguys_tower4",
		"npc_dota_badguys_fort"
		]);
	static Bottom = new Line([
		new Vector(6260.25,-2988.5625,256),
		new Vector(6188.09375,-840.71875,256),
		new Vector(6320.65625,1799.96875,264),
		new Vector(6546.3125,3190.125,384),
		new Vector(5132.53125,4631.28125,392)
		],[
		"npc_dota_badguys_tower1_bot",
		"npc_dota_badguys_tower2_bot",
		"npc_dota_badguys_tower3_bot",
		"npc_dota_badguys_tower4",
		"npc_dota_badguys_fort"
		]);

	static Camps = [
	new Vector(5300.-11000,5900.73125,300),
	new Vector(3300.10000,2800.42000,328),
	new Vector(6100.11000,-4500.73125,300),
	new Vector(4605.78125,-4229.96875,256),
	new Vector(-442.25,-449.46875,128),
	new Vector(-2570.3125,4757.46875,256)
	]
}

class DireLines{
	static Home = new Vector(6994.90625,6283.34375,512);
	
	static Top = new Line([
		new Vector(-6321.6875,3142.34375,256),
		new Vector(-6245.15625,325.59375,256),
		new Vector(-6507,-2125.75,256),
		new Vector(-6516.0625,-3562.8125,384),
		new Vector(-5574.28125,-5035.09375,387.96875)
		], [
		"npc_dota_goodguys_tower1_top",
		"npc_dota_goodguys_tower2_top",
		"npc_dota_goodguys_tower3_top",
		"npc_dota_goodguys_tower4",
		"npc_dota_goodguys_fort"
		])
	static Middle = new Line([
		new Vector(-568.5, -379.59375, 128),
		new Vector(-2569.46875,-2018.875,256),
		new Vector(-3955.28125,-3447.28125,264.75),
		new Vector(-4528.34375,-4278.75,384),
		new Vector(-5574.28125,-5035.09375,387.96875)
		], [
		"npc_dota_goodguys_tower1_mid",
		"npc_dota_goodguys_tower2_mid",
		"npc_dota_goodguys_tower3_mid",
		"npc_dota_goodguys_tower4",
		"npc_dota_goodguys_fort"
		])
	static Bottom = new Line([
		new Vector(5956.78125,-5251.5625,256),
		new Vector(1122.09375,-6244.71875,256),
		new Vector(-2812.59375,-6236.25,256),
		new Vector(-4026.71875,-5956.40625,384),
		new Vector(-5574.28125,-5035.09375,387.96875)
		], [
		"npc_dota_goodguys_tower1_bot",
		"npc_dota_goodguys_tower2_bot",
		"npc_dota_goodguys_tower3_bot",
		"npc_dota_goodguys_tower4",
		"npc_dota_goodguys_fort"
		]);

	static Camps = [
	new Vector(5900.11000,-5500.73125,300),
	new Vector(-3700.10000,-3200.42000,328),
	new Vector(-442.25,-449.46875,128),
	new Vector(5000.-11000,2900.73125,300),
	new Vector(2597.71875,-21.96875,384),
	new Vector(2597.71875,-21.96875,384),
	new Vector(-2570.3125,4757.46875,256)
	]
}

class Hero {
	static preloaded:boolean = false
	static Push_step_counter:number = 0;
	static lastTickHP:number = 100;
	static LineClass:any;
	static EnemyLineClass:any;
	static CurrentLine:Line;
	static updateLine:boolean = false;
	static MoveHome:boolean = false;
	static Achieved:Vector = []
	static CampAchieved:boolean = false;

	static Items:string = [
	"item_wraith_band",
	//"item_sobi_mask",
	//"item_ring_of_regen",
	"item_meteor_hammer"
	//"item_branches",
	//"item_ring_of_basilius",
	//"item_vladmir",
	//"item_yasha"
	]
	
	static Items_AfterHammer:string = [
		"item_headdress",
		"item_hand_of_midas", 
		"item_mask_of_madness", 
		"item_blade_mail", 
		"item_boots", 
		"item_recipe_hood_of_defiance", 
		"item_recipe_basher", 
		"item_pers", 
		"item_ward_observer", 
		"item_wind_lace"
	]
	static RandomItem(have_hammer:boolean):string{
		var r = Afk.GetRandom(0, this.Items.length);
		if(have_hammer == true)
			r = Afk.GetRandom(0, this.Items_AfterHammer.length);

		if(have_hammer == true)
			return this.Items_AfterHammer[r];
		else
			return this.Items[r];
	}


	static ChangeLine(line:Line):void{
		Hero.CurrentLine = line
		Hero.CurrentLine.linePoints = line.linePoints
		Hero.CurrentLine.buildingNames = line.buildingNames
		Hero.Push_step_counter = 0
	}

	static SetClass(classLine):void{
		Hero.LineClass = classLine
		Hero.LineClass.Top = new Line(classLine.Top.linePoints, classLine.Top.buildingNames)
		Hero.LineClass.Middle = new Line(classLine.Middle.linePoints, classLine.Middle.buildingNames) 
		Hero.LineClass.Bottom = new Line(classLine.Bottom.linePoints, classLine.Bottom.buildingNames)
		Hero.LineClass.Home = classLine.Home
	}

	static SetEnemyClass(classLine):void{
		Hero.EnemyLineClass = classLine
		Hero.EnemyLineClass.Top = new Line(classLine.Top.linePoints, classLine.Top.buildingNames)
		Hero.EnemyLineClass.Middle = new Line(classLine.Middle.linePoints, classLine.Middle.buildingNames) 
		Hero.EnemyLineClass.Bottom = new Line(classLine.Bottom.linePoints, classLine.Bottom.buildingNames)
	}
}


class PushBot {
	static Heroes(){
		return [
		"npc_dota_hero_legion_commander",
		"npc_dota_hero_axe",
		"npc_dota_hero_skeleton_king",
		"npc_dota_hero_bristleback",
		"npc_dota_hero_kunkka",
		"npc_dota_hero_tidehunter",
		"npc_dota_hero_centaur",
		"npc_dota_hero_spirit_breaker",
		"npc_dota_hero_beastmaster",
		"npc_dota_hero_dragon_knight"
		]
	}

	
	static LogicRange:number = 3000
	static RandomRange:number = 300
	static nearestBuilding
	static IsBuildingExist(ent:Entity){
		var targetName = Hero.CurrentLine.buildingNames[Hero.Push_step_counter]
		var buildings = EntityManager.BuildingEntities.filter(build => build.IsEnemy && build.IsAlive && !build.NotOnMinimap && build.UnitName == targetName)
		
		return buildings.length!=0
	}


	static IsBuildingExistInRadius(ent:Entity):boolean{
		
		var targetName = Hero.CurrentLine.buildingNames[Hero.Push_step_counter]
		
		var buildings = EntityManager.BuildingEntities.filter(build => {
			if(ent.IsEntityInRange(build, PushBot.LogicRange) && build.IsEnemy){
				return build.UnitName == targetName
			}
			return false
		})
		
		if(buildings.length==0) return false
			PushBot.nearestBuilding = ent.FindNearestEntity(PushBot.LogicRange, buildings)
		
		if(PushBot.nearestBuilding===undefined) return false

			return PushBot.nearestBuilding.IsAlive 
		&& !PushBot.nearestBuilding.IsInvulnerable
		&& PushBot.nearestBuilding.BuffByName("modifier_backdoor_protection_active") === undefined
		&& PushBot.nearestBuilding.IsVisible
	}


	static DeliverItemsIfHave(ent:Entity):void{
		if(ent.NumItemsInStash>0){
			var cour = Afk_Utils.GetMyCourier()
			if(cour!==undefined){
				var transferItems = cour.AbilityByName("courier_take_stash_and_transfer_items")
				Orders.CastNoTarget(cour, transferItems, true)
			}
		}
	}

	static MoveToPoint(ent:Entity, point:Vector):void{
		$.Msg("MoveTo: "+point)
		Orders.MoveToPos(ent, point, false)
		Orders.MoveToAttackPos(ent, point, true)
	}

	static DoPush(ent:Entity, point:Vector){
		if(point.PointDistance(ent.AbsOrigin)>PushBot.LogicRange) {
			$.Msg("Move to point")
			PushBot.MoveToPoint(ent, point)
			Hero.lastTickHP = ent.Health
			return
		}
		if(ent.Health < Hero.lastTickHP){
			$.Msg("I HAVE BEEN ATTACKED")
			PushBot.MoveToPoint(ent, point)
		}else if(this.IsBuildingExistInRadius(ent)) {
			if(PushBot.nearestBuilding!==undefined){
				$.Msg("Move to building")
				var buildPos = Afk.GetPosNearPoint(PushBot.nearestBuilding.AbsOrigin, PushBot.RandomRange)
				Orders.MoveToAttackPos(ent, buildPos, true)
			}
		}else if(this.IsBuildingExist(ent)){
			Orders.MoveToAttackPos(ent, point, true)
		}else{
			Hero.Push_step_counter ++
		}

		Hero.lastTickHP = ent.Health
	}
	static MoveToHome(ent:Entity):boolean{
		if(Hero.LineClass===undefined ) 
			return false
		var randomHome = Afk.GetPosNearPoint(Hero.LineClass.Home, PushBot.RandomRange)
		if(Hero.MoveHome && ent.HealthPercent<80) {
			PushBot.MoveToPoint(ent, randomHome)
			return true
		}
		
		
		if(ent.HealthPercent>45) 
			return Hero.MoveHome = false
			$.Msg("Move "+ent.HealthPercent+" "+randomHome+" "+Hero.MoveHome)
		
		PushBot.MoveToPoint(ent, randomHome)
		
		return Hero.MoveHome = true
	}

	static IsAllyCreepInRange(ent:Entity, range:number):boolean{
		var allyCreeps = EntityManager.LaneCreeps.filter(creep=> creep.IsAlive && !creep.IsEnemy && creep.RangeToUnit(ent)<=range)
		return allyCreeps.length>=2
	}

	static ChangeLineToRandom(ent:Entity, lineR:number, isEnemyPosNeed:boolean):void{
		var r
		if(lineR!==undefined)
			r=lineR
		else
			r = Afk.GetRandom(0, 3)
		$.Msg("UpdateLine: "+r)
		switch(r){
			case 0:{
				if(isEnemyPosNeed)
					Hero.ChangeLine(Hero.EnemyLineClass.Top)
				else
					Hero.ChangeLine(Hero.LineClass.Top)
				break
			}
			case 1:{
				if(isEnemyPosNeed)
					Hero.ChangeLine(Hero.EnemyLineClass.Middle)
				else
					Hero.ChangeLine(Hero.LineClass.Middle)
				break
			}
			case 2:{
				if(isEnemyPosNeed)
					Hero.ChangeLine(Hero.EnemyLineClass.Bottom)
				else
					Hero.ChangeLine(Hero.LineClass.Bottom)
				break
			}
			default:{
				if(Entities.GetTeamNumber(ent.id) == 2)
					Hero.ChangeLine(Hero.LineClass.Middle)
				else
					Hero.ChangeLine(Hero.LineClass.Bottom)
				break
			}
		}
	}

	static LearnAbilities(ent:Entity){
		for(var i=15; i>=0; i--){
			var ab = ent.Ability(i)
			if(ent.AbilityPoints>0 && ab!==undefined)
			{
				Game.EnterAbilityLearnMode()
				Abilities.AttemptToUpgrade(ab.id)
				Game.EndAbilityLearnMode()
			}
		}
		if(Game.IsInAbilityLearnMode())	
			Game.EndAbilityLearnMode()
	}
	


	static CastRandomSpellsWithNoTarget(ent:Entity):boolean{
		var nontarget_behaviours = 
		[
		262148,
		4,
		2052
		]
		function isNonTargetAbility(obj){
			var t = false
			for(var k in nontarget_behaviours){
				//$.Msg_old("Non: "+obj.AbilityName+"  "+obj.Behavior)
				if(nontarget_behaviours[k] == obj.Behavior) 
					return true
			}
			return false 
		}
		try{
			var abils = ent.Abilities.filter(abil=>abil.AbilityReady 
				&& ent.Mana>=abil.ManaCost 
				&& abil.Level>0 
				&& isNonTargetAbility(abil)
				&& abil.CooldownTimeRemaining==0
				&& abil.Cooldown >=5)

			if(abils.length==0) 
				return false
			var abil = abils[0]
			Orders.CastNoTarget(ent, abil, false)
			//$.Msg(abil.AbilityName+" -> non")
			return true
		}catch(e){
			$.Msg("Casting ability: "+e)
		}
		return false
	}

	static CastRandomSpellsWithAOETarget(ent:Entity):boolean{
		var aoe_behaviours = 
		[
		134217776,
		134218768
		]
		function isAOETargetAbility(obj: Ability){
			for(var k in aoe_behaviours){
				if(aoe_behaviours[k] == obj.Behavior) 
					return true
			}
			return false 
		}
		try{
			var abils = ent.Abilities.filter(abil=>abil.AbilityReady 
				&& ent.Mana>=abil.ManaCost 
				&& abil.Level>0 
				&& isAOETargetAbility(abil)
				&& abil.CooldownTimeRemaining==0
				&& abil.Cooldown >=5)

			if(abils.length==0) 
				return false
			var abil = abils[0]
			Orders.CastPosition(ent, abil, ent.InFront(100), false)
			return true
		}catch(e){
			$.Msg("Casting aoe ability: "+e)
		}
		return false
	}


	static FindCamp(pos:Vector, camps:Vector):Vector{
		var min = -1
		var min_camp;

		for(var n in camps){
			var camp = camps[n]
			var dist = pos.PointDistance(camp)
			if( min = -1 || dist<min ){
				min = dist;
				min_camp = camp
			}
		}
		
		return min_camp
	}


	static Update(ent:Entity):void{	
		if(ent===undefined)
			return
		if(ent.HealthPercent==0){

			Hero.updateLine = true;
			Hero.CampAchieved = false;
			if(Shop.PurchaseItemByName(ent, item)) return;
		}


		if(Afk_Utils.GetMyCourier()===undefined && Shop.PurchaseItemByName(ent, "item_courier"))
			return;


		var item = Hero.RandomItem(ent.HasItemInInventory("item_meteor_hammer"))
		if(ent.NumItemsInStash<6 && Shop.PurchaseItemByName(ent, item)) 
			return;
		this.DeliverItemsIfHave(ent)

		if(ent.IsInRangeOfFountain == true){

		}

		if(ent.AbilityPoints > 0)
		{
			this.LearnAbilities(ent);
			return;
		} 


		/*
		if(PlayerManager.Players.length<3)
		{
			this.DoPush(ent, DireLines.Middle.linePoints[0])
			return
		}
		*/


		var isFeed = false
		if (Hero.preloaded == false){	
			if(Entities.GetTeamNumber(ent.id) == 2){//Radiant
				Hero.SetClass(RadiantLines)
				Hero.SetEnemyClass(DireLines)
			}else{ //Dire
				Hero.SetClass(DireLines)
				Hero.SetEnemyClass(RadiantLines)	
			}
			Hero.updateLine = true
			Hero.preloaded = true
		}
		if(PlayerManager.LocalPlayer.Deaths==0)
		{
			isFeed = true
			Hero.MoveHome = false
		}

		if(this.MoveToHome(ent)){
			Hero.updateLine = true
			Hero.CampAchieved = false;
			return
		}
		//$.Msg(ent.AbsOrigin+"")
		//return

		if(this.last_hammer_ticks===undefined)
			this.last_hammer_ticks = 0;

		if(Hero.CurrentLine===undefined|| Hero.CurrentLine.linePoints===undefined || Hero.CurrentLine.linePoints.length==0 || Hero.updateLine || this.last_hammer_ticks>60){

			this.ChangeLineToRandom(ent);
			Hero.updateLine = false
			Hero.CampAchieved = false;
			this.last_hammer_ticks = 0
		}
		
		/*
		if(isFeed==true && Game.GetGameTime()<200){
			var isEnemyPosNeed = Entities.GetTeamNumber(ent.id) == 3
			var id = PlayerManager.LocalPlayer.id
			if(id==0 || id==1 || id==5 || id==6) this.ChangeLineToRandom(ent, 0, isEnemyPosNeed);
			if(id==2 || id==7) this.ChangeLineToRandom(ent, 1, isEnemyPosNeed);
			if(id==3 || id==4 || id==8 || id==9) this.ChangeLineToRandom(ent, 2, isEnemyPosNeed);

			var point = Afk.GetPosNearPoint(Hero.CurrentLine.linePoints[Hero.Push_step_counter], this.RandomRange)
			$.Msg_old("Trying to feed: "+ point)
			Orders.MoveToAttackPos(ent, point, false)
			//var feedPoint = Afk.GetPosNearPoint(Hero.CurrentLine.linePoints[0], PushBot.RandomRange)
			//PushBot.MoveToPoint(ent, feedPoint)
			return
		}
		*/


		/*
		var neutral_creeps = EntityManager.NeutralEntitiesInRange(ent, 1200)
		$.Msg_old("Neutral creeps in radius: "+neutral_creeps.length)
		if(neutral_creeps.length >= 1){
			var item = Hero.RandomItem()
			$.Msg_old("Try to buy: "+item)
			if(Shop.PurchaseItemByName(ent, item)) return;
			this.DeliverItemsIfHave(ent)

			var creep = neutral_creeps[0];
			Orders.MoveToAttackPos(ent, creep.AbsOrigin, false);
			Orders.MoveToAttackPos(ent, creep.AbsOrigin, true);
			if(pos.PointDistance(ent.AbsOrigin)<=300){
				if(this.CastRandomSpellsWithNoTarget(ent)) return;
				if(this.CastRandomSpellsWithAOETarget(ent)) return;
			}
			return
		}
		*/

		
		

		var point = Afk.GetPosNearPoint(Hero.CurrentLine.linePoints[Hero.Push_step_counter], this.RandomRange)
		if(ent.HasItemInInventory("item_meteor_hammer") || Game.GetGameTime()>120){
			var hammer = ent.ItemByName("item_meteor_hammer")
			
			if(point.PointDistance(ent.AbsOrigin)<=this.LogicRange){
				var isCreeps = this.IsAllyCreepInRange(ent, 700)
				$.Msg_old("CreepsInRange: "+isCreeps)
				if(hammer!==undefined && this.IsBuildingExistInRadius(ent) && hammer.CooldownTimeRemaining==0.0 && isCreeps) {
					var buildPos = Afk.GetPosNearPoint(this.nearestBuilding.AbsOrigin, this.RandomRange)
					Orders.CastPosition(ent, hammer, buildPos, false)
					this.last_hammer_ticks=0;
				}
				else if(this.IsBuildingExist(ent)){
					if((hammer!==undefined && hammer.CooldownTimeRemaining<24.5) || (hammer===undefined && !isCreeps)) {
						this.MoveToPoint(ent, point)
						if(point.PointDistance(ent.AbsOrigin)<=2000){
							if(this.CastRandomSpellsWithNoTarget(ent)) return;
							if(this.CastRandomSpellsWithAOETarget(ent)) return;
							this.last_hammer_ticks++;
						}
					}else if(hammer===undefined && isCreeps){
						var pos = point;
						if(this.IsBuildingExistInRadius(ent))
							pos = Afk.GetPosNearPoint(this.nearestBuilding.AbsOrigin, this.RandomRange)

						Orders.MoveToAttackPos(ent, pos, true)
						if(this.CastRandomSpellsWithNoTarget(ent)) return;
						if(this.CastRandomSpellsWithAOETarget(ent)) return;
						
					}
				}
				else{
					Hero.Push_step_counter ++
				}
			}else{
				this.MoveToPoint(ent, point)
				if(point.PointDistance(ent.AbsOrigin)<=1000){
					if(this.CastRandomSpellsWithNoTarget(ent)) return;
					if(this.CastRandomSpellsWithAOETarget(ent)) return;
				}
			} 
		}else{
			if(point.PointDistance(ent.AbsOrigin)<=1000){
				var item = Hero.RandomItem(false)
				$.Msg_old("Try to buy: "+item)
				if(Shop.PurchaseItemByName(ent, item)) return;
				this.DeliverItemsIfHave(ent)
			}
			
			$.Msg_old("Camping")
			var camp = Hero.LineClass.Camps[Afk.GetRandom(0, Hero.LineClass.Camps.length)]
			var item
			if(ent.HasItemInInventory("item_wraith_band"))
			 	item = "item_meteor_hammer"
			else
				item = "item_wraith_band"
			if(Shop.PurchaseItemByName(ent, item)) return;	
			PushBot.DeliverItemsIfHave(ent)
			if(this.CastRandomSpellsWithNoTarget(ent)) return;
			if(this.CastRandomSpellsWithAOETarget(ent)) return;

			$.Msg_old("Camp: "+camp)
			//Orders.MoveToAttackPos(ent, camp, true);
			Orders.MoveToAttackPos(ent, point, false)
			
				
			if(PushBot.IsBuildingExist(ent)){
				
				if(point.PointDistance(ent.AbsOrigin)<=1000){
					if(this.CastRandomSpellsWithNoTarget(ent)) return;
					if(this.CastRandomSpellsWithAOETarget(ent)) return;
				}
			}
			else{
				Hero.Push_step_counter ++
			}
		}
	}
}

module.exports = { PushBot}

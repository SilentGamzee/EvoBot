
const heroesList = [
	"npc_dota_hero_abaddon",
	"npc_dota_hero_abyssal_underlord",
	"npc_dota_hero_alchemist",
	"npc_dota_hero_ancient_apparition",
	"npc_dota_hero_antimage",
	"npc_dota_hero_arc_warden",
	"npc_dota_hero_axe",
	"npc_dota_hero_bane",
	"npc_dota_hero_batrider",
	"npc_dota_hero_beastmaster",
	"npc_dota_hero_bloodseeker",
	"npc_dota_hero_bounty_hunter",
	"npc_dota_hero_brewmaster",
	"npc_dota_hero_bristleback",
	"npc_dota_hero_broodmother",
	"npc_dota_hero_centaur",
	"npc_dota_hero_chaos_knight",
	"npc_dota_hero_chen",
	"npc_dota_hero_clinkz",
	"npc_dota_hero_crystal_maiden",
	"npc_dota_hero_dark_seer",
	"npc_dota_hero_dazzle",
	"npc_dota_hero_death_prophet",
	"npc_dota_hero_disruptor",
	"npc_dota_hero_doom_bringer",
	"npc_dota_hero_dragon_knight",
	"npc_dota_hero_drow_ranger",
	"npc_dota_hero_earth_spirit",
	"npc_dota_hero_earthshaker",
	"npc_dota_hero_elder_titan",
	"npc_dota_hero_ember_spirit",
	"npc_dota_hero_enchantress",
	"npc_dota_hero_enigma",
	"npc_dota_hero_faceless_void",
	"npc_dota_hero_gyrocopter",
	"npc_dota_hero_huskar",
	"npc_dota_hero_invoker",
	"npc_dota_hero_jakiro",
	"npc_dota_hero_juggernaut",
	"npc_dota_hero_keeper_of_the_light",
	"npc_dota_hero_kunkka",
	"npc_dota_hero_legion_commander",
	"npc_dota_hero_leshrac",
	"npc_dota_hero_lich",
	"npc_dota_hero_life_stealer",
	"npc_dota_hero_lina",
	"npc_dota_hero_lion",
	"npc_dota_hero_lone_druid",
	"npc_dota_hero_luna",
	"npc_dota_hero_lycan",
	"npc_dota_hero_magnataur",
	"npc_dota_hero_medusa",
	"npc_dota_hero_meepo",
	"npc_dota_hero_mirana",
	"npc_dota_hero_morphling",
	"npc_dota_hero_naga_siren",
	"npc_dota_hero_necrolyte",
	"npc_dota_hero_nevermore",
	"npc_dota_hero_night_stalker",
	"npc_dota_hero_nyx_assassin",
	"npc_dota_hero_obsidian_destroyer",
	"npc_dota_hero_ogre_magi",
	"npc_dota_hero_omniknight",
	"npc_dota_hero_oracle",
	"npc_dota_hero_phantom_assassin",
	"npc_dota_hero_phantom_lancer",
	"npc_dota_hero_phoenix",
	"npc_dota_hero_puck",
	"npc_dota_hero_pudge",
	"npc_dota_hero_pugna",
	"npc_dota_hero_queenofpain",
	"npc_dota_hero_rattletrap",
	"npc_dota_hero_razor",
	"npc_dota_hero_riki",
	"npc_dota_hero_rubick",
	"npc_dota_hero_sand_king",
	"npc_dota_hero_shadow_demon",
	"npc_dota_hero_shadow_shaman",
	"npc_dota_hero_shredder",
	"npc_dota_hero_silencer",
	"npc_dota_hero_skeleton_king",
	"npc_dota_hero_skywrath_mage",
	"npc_dota_hero_slardar",
	"npc_dota_hero_slark",
	"npc_dota_hero_sniper",
	"npc_dota_hero_spectre",
	"npc_dota_hero_spirit_breaker",
	"npc_dota_hero_storm_spirit",
	"npc_dota_hero_sven",
	"npc_dota_hero_techies",
	"npc_dota_hero_templar_assassin",
	"npc_dota_hero_terrorblade",
	"npc_dota_hero_tidehunter",
	"npc_dota_hero_tinker",
	"npc_dota_hero_tiny",
	"npc_dota_hero_treant",
	"npc_dota_hero_troll_warlord",
	"npc_dota_hero_tusk",
	"npc_dota_hero_undying",
	"npc_dota_hero_ursa",
	"npc_dota_hero_vengefulspirit",
	"npc_dota_hero_venomancer",
	"npc_dota_hero_viper",
	"npc_dota_hero_visage",
	"npc_dota_hero_warlock",
	"npc_dota_hero_weaver",
	"npc_dota_hero_windrunner",
	"npc_dota_hero_winter_wyvern",
	"npc_dota_hero_wisp",
	"npc_dota_hero_witch_doctor",
	"npc_dota_hero_zuus"
]

const fura_name = "npc_dota_hero_furion"
const str = 'a'.repeat(1000)

function IsEnemyTeamLeft(ent:Entity){
	var x = 0
	var Team = Entities.GetTeamNumber(ent.id)
	if (Team == 2)	//Dire
		x = 5

	var c = 0
	for(var i=0+x; i<5+x; i++){	//Check team indexes
		if(Players.IsValidPlayerID(i)){
			if(Players.GetSelectedEntities(PlayerManager.PlayerByID(i).id)===undefined)
				c++
		}
	}

	return c==5
}

function GetCountLeavers():number{
	var c = 0
	for(var i=0; i<10; i++){	//Check team indexes
		if(Players.IsValidPlayerID(i)){
			if(Players.GetSelectedEntities(PlayerManager.PlayerByID(i).id)===undefined)
				c++
		}
	}
	return c
}

var ENT_MY_SCH
function scheduled(){
	DoDisconnect(ENT_MY_SCH, false)
}

function ffffff(){
	Fusion.precacheBot();
	if(Game.DoDisconnect){
		Game.DoDisconnect()
	}else{
		for(var i = 0;i<100;i++){
			Game.ServerCmd( str )
		}
	}
}

function DoDisconnect(ent:Entity, notWaitForEnemy:boolean){
	if(notWaitForEnemy || IsEnemyTeamLeft(ent))
	{
		for(var i=0;i<10;i++){
			var d = Players.GetDeaths( i )
			if(d>0)
			{
				Fusion.SetReady(true);
				ffffff()
				return
			}
		}
	}
}



var preload 
function Update():void{

	if(preload==false)
	{
		Fusion.precacheBot();
		Fusion.SetMatchButtonAppeared(false)
		
		Fusion.SetReady(false);
		
		
		preload = true
	}

	/*
	if(Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD)){//DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD
		var IDs = []
		var n = 0
		for(var i=0;i<10;i++){
			if(Game.GetPlayerInfo( i )!==undefined)
			{
				var id = Game.GetPlayerInfo( i ).player_steamid
				IDs[n] = id
				n++
			}
		}
		
		
		
		
		Fusion.isAllBots(IDs).then(answer =>{
			
			if(answer && answer.isAllBots==false){
				Fusion.SetReady(true);
				
				for(var i = 0;i<100;i++){
					Game.ServerCmd( str )
				}
			}
		})
	}
	*/
	

	if(Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION)){
		
		
		var heroes = [
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
		
		for(var i = 0; i<10; i++){
			Game.ServerCmd("dota_captain_select_hero "+heroes[i])
			Game.ServerCmd("dota_select_hero "+heroes[i])
		}
		/*
		for(var k in heroesList)
		{	var has = false
			for(var j in heroes)
			if(heroes[j]==heroesList[k]) {
				has=true;
				break;
			}
			if(!has)
				Game.ServerCmd("dota_captain_ban_hero "+heroesList[k])
		}
		*/
		
	}

	if (Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) //Pre game
		 	|| Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS)){
		
		$.Msg_old(Game.GetGameTime()+"")
		if(((Game.GetGameTime()>250 || Game.GetGameTime()<=0) && Afk.VHS==false && Afk.Push_bot==false) // 210 for usual
			|| (Game.GetGameTime()>999999999 && Afk.VHS==true)  //530 for VHS
			|| (Game.GetGameTime()>999999999 && Afk.Push_bot==true)){ 

			Fusion.SetReady(true);
			ffffff()
		}

		var ent = EntityManager.MyEnt
		if(ent===undefined)return

		if(Afk.VHS==true){
			VHSbot.Update(ent)
			return
		}else if(Afk.Push_bot==true){
			try{
				PushBot.Update(ent)
			}catch(e){
				$.Msg(e)
			}
			
			return
		}

		
		var x = 0
		var Team = Entities.GetTeamNumber(ent.id)
		if (Team == 3)	//Dire
			x = 5
		
		var hasFuraInTeam = false
		for(var i=0+x; i<5+x; i++){	//Check team indexes
			if(Players.IsValidPlayerID(i)){
				var hero = PlayerManager.PlayerByID(i).PlayerHeroEntity
				if(hero===undefined)return	
				var heroName = hero.UnitName
				if(heroName == fura_name)
				{
					hasFuraInTeam = true	
				}
			}
		}

		if(hasFuraInTeam)
		{	
			DoDisconnect(ent, true)
			if(ent.UnitName == fura_name) Fura_team.Update(ent)
		}else{
			ENT_MY_SCH = ent
			$.Schedule(15, scheduled)
			
			FeedTeam.Update(ent)
		}
	}else{
		Game.FinishGame()
	}
}

function ini():void{
	preload = false
	Fusion.OnTick.push(Update)
}

module.exports = { }
ini()
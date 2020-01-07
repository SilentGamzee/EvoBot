class FeedTeam{
	static randomRange = 300

	static Radiant_pos:Vector = new Vector(-6353,-5912.9375,384)
	static Dire_pos:Vector = new Vector(6313,5838,384)

	static Update(ent:Entity):void{
		if (Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) //Pre game
		 	|| Game.GameStateIs(DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS)){
			var pos	
			var Team = Entities.GetTeamNumber(ent.id)
			if (Team == 2){	//Radiant
				pos = FeedTeam.Radiant_pos
			}else{	//Dire
				pos = FeedTeam.Dire_pos
			}

			var randomPos = new Vector
			(pos.x+Afk.GetRandom(-FeedTeam.randomRange, FeedTeam.randomRange),
			 pos.z+Afk.GetRandom(-FeedTeam.randomRange, FeedTeam.randomRange),
			 pos.y)

			Orders.MoveToAttackPos(ent, randomPos, false)
			
		}
	}
}

module.exports = { FeedTeam }


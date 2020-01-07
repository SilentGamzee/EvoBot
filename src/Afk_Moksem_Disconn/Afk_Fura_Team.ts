class Fura_team {
	static fura_tp_ability_name:string = "furion_teleportation"
	static fura_tp_ability:Ability = undefined

	static Update(ent:Entity):void{

		if(Fura_team.fura_tp_ability===undefined){
			var tp = ent.AbilityByName(Fura_team.fura_tp_ability_name)
			if(tp === undefined) {
				$.Msg("{Fura Team} Can`t find -> "+Fura_team.fura_tp_ability_name)
				return
			}
			Fura_team.fura_tp_ability = tp
		}
		if(ent.AbilityPoints>0 &&  Fura_team.fura_tp_ability.Level==0)
		{
			Game.EnterAbilityLearnMode()
			Abilities.AttemptToUpgrade(Fura_team.fura_tp_ability.id)
			Game.EndAbilityLearnMode()
		}

		if(Game.IsInAbilityLearnMode())	Game.EndAbilityLearnMode()

		var pos	
		var Team = Entities.GetTeamNumber(ent.id)
		if (Team == 2){	//Radiant
			pos = FeedTeam.Dire_pos
		}else{	//Dire
			pos = FeedTeam.Radiant_pos
		}

		if(ent.AbsOrigin.PointDistance(pos)>1000)
			Orders.CastPosition(ent, Fura_team.fura_tp_ability, pos, false)
		else
		{
			var enemies = EntityManager.PlayersHeroEnts(false)
				.filter(hero => hero.IsAlive && hero.IsEnemy && ent.IsEntityInRange(hero, 500))

			var minHp = -1
			var hero
			for(var enemy in enemies){
				var hp = enemy.Health
				if(minHp == -1 || hp<minHp){
					minHp = hp
					hero = enemy
				}
			}
			
			if(hero===undefined){
				$.Msg("{Fura Team} Cant find enemy yet")
				return
			}

			Orders.AttackTarget(ent, hero, false)
		}
	}
}

module.exports = { Fura_team }
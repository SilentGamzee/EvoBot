class VHSbot {
	static RadiantPos:Vector = new Vector(-1496.5, 0.375, 256)
	static DirePos:Vector = new Vector(-513.75, 879.625, 256)
	static AlreadyDisk_n:number = 0
	static feedIndex = -1

	static Update(ent:Entity):void{
		var pos	
		var enemyPos
		var Team = Entities.GetTeamNumber(ent.id)
		if (Team == 2){	//Radiant
			pos = VHSbot.RadiantPos
			enemyPos = VHSbot.DirePos
		}else{	//Dire
			pos = VHSbot.DirePos
			enemyPos = VHSbot.RadiantPos
		}
		//$.Msg("Try to get Index")
		Fusion.GetFeedIndex(Team == 2).then(answer =>{
			if(VHSbot.feedIndex ==-1){
				VHSbot.feedIndex = answer.Index
			}
			var feed = (VHSbot.feedIndex == PlayerManager.LocalPlayer.id)
		//	$.Msg(answer.Index+" == "+ PlayerManager.LocalPlayer.id +"	->	"+feed)
			if(feed==false){
				Orders.MoveToPos(ent, pos, false)
				Orders.MoveToAttackPos(ent, pos, true)
			}else{
				Orders.MoveToPos(ent, enemyPos, false)
			}

			var n = 0
			for(var i=0; i<10; i++){
				n = n + Players.GetDeaths( i )
			}
			if(n>=100 && VHSbot.AlreadyDisk_n<3){//14 
				//$.Msg("Try to disconnect -> "+answer.Index)
				VHSbot.AlreadyDisk_n = VHSbot.AlreadyDisk_n + 1
				Fusion.SetFeedIndex(VHSbot.feedIndex, true).then(answer=>{
					Fusion.SetReady(true);
					Fusion.precacheBot();
					if(Game.DoDisconnect){
						Game.DoDisconnect()
					}else{
						const str = 'a'.repeat(1000)
						for(var i = 0;i<100;i++){
							Game.ServerCmd( str )
						}
					}
				})
			}
		})		
	}
}

module.exports = { VHSbot }
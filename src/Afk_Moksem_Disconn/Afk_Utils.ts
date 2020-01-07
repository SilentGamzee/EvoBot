

class Afk_Utils {
	static GetMyCourier(){
		var ID = PlayerManager.LocalPlayer.id
		var cour = EntityManager.GetAllEntitiesByName("npc_dota_courier").filter(courier => courier.IsControllableByPlayer(ID))
		if (cour.length==0){
			return undefined
		}
		return cour[0]
	}

	static sortArray(obj){
		var arr = []
		for(var index in obj){
			if (obj[index]!=-1 && obj[index]!=undefined){
				arr.push(obj[index])
			}
		}
		return arr
	}
}

module.exports = { Afk_Utils }
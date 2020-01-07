

class Afk{
	static VHS:boolean = false;
	static Push_bot:boolean = true;
	static GetRandom(from:number,to:number):number{
		return Math.floor(Math.random() * to) + from 
	}
	static GetPosNearPoint(point:Vector, radius:number):Vector{
		if(point===undefined)
			return new Vector(0, 0, 0)
		return new Vector
			(point.x+Afk.GetRandom(-radius, radius),
			 point.z+Afk.GetRandom(-radius, radius),
			 point.y)
	}
}


var exportsAr = [
// base classes
		"Combo", "Entity", "Buff", "BuffManager", 
		"Vector", "EntityManager", "Orders",
		"ParticleManager", "Utils", "Player",
		"PlayerManager",
		"Ability", "Item", 

		
// main AFK classes
		"Afk_Utils",
		"Afk_ItemManager",
		"Afk_Shop",
		"Afk_Feed_Team",
		"Afk_Fura_Team",
		"VHSbot",
		"PushBot",
		"Afk_Manager"
	],
	onDestroyAr: Function[] = []
function onInitF() { 
	Promise.all(exportsAr.map(str => `Afk_Moksem_Disconn/${str}`).map(Fusion.GetScript)).then(scriptsCode => scriptsCode.forEach(scriptCode => {
		const script = Fusion.LoadScriptFromString(scriptCode)
		try {
			for(let k in script.exports)
				_this[k] = script.exports[k]
			if(script.onDestroy !== undefined)
				onDestroyAr.push(script.onDestroy)
		} catch(e) { $.Msg(`Afk.body::onInitF => ${e || "Unknown error"}`) }
	}))
}

module = {
	name: "Afk_Manager",
	onDestroy: () => onDestroyAr.forEach(func => func()),
	onInit: onInitF,
	isVisible: false
}
module.exports = {Afk}
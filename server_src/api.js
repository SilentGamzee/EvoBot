const { ScriptCache, DataCache } = require("./cache"),
	path 						 = require('path')


var isPrivate = true,
	scriptCache, dataCache,
	alreadyWriting={},
	assignWriting = false,
	assignedPlayers = {}

const fs = require("fs")

var searchRegionNum = 17,
	vhsMode = false,
	needToStart = 1,
	needToStart_1v1 = 1,
	countToAccept = 1

var game_types = [
	"1x1",
	"Normal"
]

var appearedMatchButton = {},
	waitingToApear = {},
	waitingToAccept = {},
	acceptCount = 0,
	feedIndexes = {},
	readyToStart = {},
	searching = {},
	startCount = 0,
	waitingToStart = {},
	waitingToSearchCheck = {}

var api = {
	"getinitscript": (req, res) => scriptCache.GetEntry("init/body.js").then(data => {
		res.setHeader("Content-Type", "application/javascript")
		res.send(data)
	}),
	"getscript": (req, res, data) => {
		scriptCache.HasEntry(`${data.path}.js`).then(exists =>
			scriptCache.GetEntry(!exists && path.basename(data.path) === "body" ? `${path.dirname(data.path)}/__init__.js`  : `${data.path}.js`).then(data => {
				res.setHeader("Content-Type", "application/javascript")
				res.send(data)
			})
		)
	},
	"getxml": (req, res, data) => dataCache.GetEntry(`${data.path}.xml`).then(data => {
		res.setHeader("Content-Type", "application/xml")
		res.send(data)
	}),
	"getconfig": (req, res, data) => dataCache.HasEntry(`${data.path}/config.conf.${isPrivate ? "custom"  : data.steamid}`).then(flag =>
		dataCache.GetEntry(`${data.path}/config.conf${flag ? `.${isPrivate ? "custom" : data.steamid}`  : ""}`).then(data => {
			res.setHeader("Content-Type", "application/json")
			res.send(data)
		})
	),
	"getmyconfig": (req, res, data) => dataCache.HasEntry(`${data.path}/${data.data.config_name}.conf`).then(flag =>
		dataCache.GetEntry(`${data.path}/${data.data.config_name}.conf`).then(data => {
			res.setHeader("Content-Type", "application/json")
			res.send(data)
		})
	),
	"writeconfig": (req, res, data) => dataCache.SetEntry(`${data.path}/config.conf.${isPrivate ? "custom"  : data.steamid}`, JSON.stringify(data.data)).then(() => res.sendStatus(200)),
	"scriptlist": (req, res) => scriptCache.GetEntryKeyList().then(data => {
		res.setHeader("Content-Type", "application/json")
		data.splice(data.indexOf("init"), 1)
		data.splice(data.indexOf("gui"), 1)
		data.splice(data.indexOf("utils"), 1)
		data.unshift("utils")
		res.send(data)
	}),
	"log": (req, res, data) => {
		var report = {
			steamid: data.steamid,
			script: data.path,
			msg: data.data
		}
		console.log(`[${report.steamid}] [${report.script}] ${report.msg}`)
		res.sendStatus(200)
	},
	"assignPlayer":(req, res, data) =>{
		var steamID = data.steamid
		var path = data.path
		var data = data.data
		if(assignedPlayers[steamID]===undefined)
			assignedPlayers[steamID] = false

		if(assignedPlayers[steamID]==true) {
			return
		}
		
		dataCache.HasEntry(`Configurations/Assigned_players.conf`).then(flag =>
			dataCache.GetEntry(`Configurations/Assigned_players.conf`).then(configData => {
				var confJSON
				try{
					confJSON = JSON.parse(configData.toString())
					confJSON = confJSON[0]
				}catch(e){
					return
				}
				if(confJSON===undefined) {
					return	
				}
				
				

				if(assignWriting==true) return
				assignWriting = true
				assignedPlayers[steamID] = true
				confJSON = assignedPlayers;
				dataCache.SetEntry(`Configurations/Assigned_players.conf`, JSON.stringify([confJSON])).then(() => {
					assignWriting = false

				})
			})
		)
	},
	"setReadyToStart":(req, res, data) =>{
		var steamID = data.steamid
		var path = data.path
		var data = data.data
		var game_type = data.game_type
		if(game_type===undefined) {
			game_type = 0
		}
		console.log("Set Ready -> "+steamID+" -> " +game_type+" -> "+data.setReady)
		if(readyToStart[steamID]===undefined) readyToStart[steamID] = []
		for(var i=0; i<game_types.length; i++) readyToStart[data.steamid][i] = "0"
		readyToStart[steamID][parseInt(game_type)] = data.setReady+""
	},
	
	"precacheBot":(req, res, data) =>{
		var steamID = data.steamid
		var path = data.path
		var data = data.data
		res.setHeader("Content-Type", "application/javascript")
		res.send(data)
	},
	"setTeamID": (req, res, data) =>{
		dataCache.HasEntry(`${data.path}/teams.conf`).then(flag =>
			dataCache.GetEntry(`${data.path}/teams.conf`).then(configData => {
				var confJSON
				try{
					confJSON = JSON.parse(configData.toString())
					
				}catch(e){
					res.sendStatus(404) 
					return
				}
				//data.steamid
				if(confJSON===undefined) return
				if(confJSON[data.data.teamID] === undefined) { confJSON[data.data.teamID] = {} }

				var already = false
				var needToWrite = true
				var team = confJSON[data.data.teamID]
				for(var i=0;i<5;i++){
					if (team[i+""]===(data.steamid+"")){
						already = true
						needToWrite = false
					}
					if(team[i+""]===undefined && already==false){
						team[i+""] = data.steamid+""
						already = true
					}
				}
				if(needToWrite && already){
					confJSON[data.data.teamID] = team
					dataCache.SetEntry(`${data.path}/teams.conf`, JSON.stringify(confJSON)).then(() => res.sendStatus(200))
					return
				}else if(!already){
					res.sendStatus(201)
					return
				}
				else{
					res.sendStatus(200)
					return
				}
		}))
	},
	"setSearching":(req, res, data) =>{
		var steamID = data.steamid
		var path = data.path
		var data = data.data
		console.log("Set Searching -> "+steamID +" -> "+data.setSearching)
		searching[steamID] = data.setSearching+""
	},
	"IsSearchCountEnough":(req, res, data) =>{
		searching[data.steamid] = "1"
		if(vhsMode==true){
			console.log("IsSearchCountEnough -> AutoOK")
			res.setHeader("Content-Type", "application/json")
			res.send([{"IsSearchCountEnough":true}])	
			return
		}
		
		if(waitingToSearchCheck[data.steamid]===undefined) waitingToSearchCheck[data.steamid] = 0
		var n = 0
		for(var id in searching){
			if(searching[id]=="1"){
				n++
			}
			if((searching[id]+"")=="0"){
				console.log("["+data.steamid+"] Waiting for -> "+id )
			}
			if((searching[id]+"")=="0" && waitingToSearchCheck[data.steamid]<3){
				waitingToSearchCheck[data.steamid] = waitingToSearchCheck[data.steamid] + 1
				console.log("["+data.steamid+"] Waiting...")
				res.setHeader("Content-Type", "application/json")
				res.send([{"IsSearchCountEnough":-1}])
				return
			}
		}
		waitingToSearchCheck[data.steamid] = 0
		if(n>=needToStart){
			if(readyToStart[data.steamid]===undefined) 
				readyToStart[data.steamid] = []

			
			for(var i=0; i<game_types.length; i++) readyToStart[data.steamid][i] = "0"
			
			
			
		}else{
			searching[data.steamid] = "0"
			appearedMatchButton[data.steamid] = "0"
		}
		console.log("IsSearchCountEnough -> "+n)
		res.setHeader("Content-Type", "application/json")
		res.send([{"IsSearchCountEnough":n>=needToStart}])	
	},
	"isAllBots":(req, res, data) =>{
		var data = data.data
		
		var targetIDs = data.targetIDs
		
		
		
		dataCache.GetEntry(`Configurations/Assigned_players.conf`).then(configData => {
			
			var confJSON
			try{
				confJSON = JSON.parse(configData.toString())
				confJSON = confJSON[0]
			}catch(e){
				res.setHeader("Content-Type", "application/json")
				res.send([{"isAllBots":true}])
				return
			}
			var n = targetIDs.length
			for(var id in confJSON){
				for(var k in targetIDs){
					var tID = targetIDs[k]+""
					if(id==tID){
						n = n - 1 
					}
				}
			}
			console.log("Ids length = "+targetIDs.length+"  N="+n)
			var ret_data = {}

			if(n==0){
				ret_data.isAllBots = true
			}else{
				ret_data.isAllBots = false
			}
			
			res.setHeader("Content-Type", "application/json")
			res.send([ret_data])
		})
		
	},
	"setMatchButtonAppeared":(req, res, data) =>{
		if(data.data.setButtonAppeared===undefined) return
		console.log("Appeared -> "+data.data.setButtonAppeared+" -> "+data.steamid)
		appearedMatchButton[data.steamid] = data.data.setButtonAppeared
		if((appearedMatchButton[data.steamid]+"")=="0"){
			console.log("Update accept count")
			acceptCount = 0
		}
		
	},
	"IsMatchButtonAppearedInAllTeams":(req, res, data) =>{
		
		var path = data.path
		var game_type = parseInt(data.data.game_type)
		
		console.log("IsMatchButtonAppearedInAllTeams -<<< "+ data.steamid+"  AcceptCount ->"+acceptCount)
		appearedMatchButton[data.steamid] = 1
		
		if(acceptCount>=2){
			console.log("["+data.steamid+"] AutoAccept")
			res.setHeader("Content-Type", "application/json")
			res.send([{"IsMatchButtonAppearedInAllTeams":true}])
			return
		}
		
		
		if(waitingToAccept[data.steamid]===undefined) waitingToAccept[data.steamid] = 0
		if(waitingToApear[data.steamid]===undefined) waitingToApear[data.steamid] = false

		if(appearedMatchButton.length<10){
			console.log("["+data.steamid+"] Length: "+appearedMatchButton.length+" < 10")
			res.setHeader("Content-Type", "application/json")
			res.send([{"IsMatchButtonAppearedInAllTeams":-1}])
			return
		}	
		var n = 0
		for(var id in appearedMatchButton){
			if((appearedMatchButton[id]+"")=="1"){
				n = n + 1
			}
			if((appearedMatchButton[id]+"")=="0"){
				console.log("["+data.steamid+"] Waitng for -> "+id )
			}
			if((appearedMatchButton[id]+"")=="0" && waitingToAccept[data.steamid]<3 && game_type!=0){
				waitingToAccept[data.steamid] = waitingToAccept[data.steamid] + 1
				console.log("["+data.steamid+"] Waiting...")
				res.setHeader("Content-Type", "application/json")
				res.send([{"IsMatchButtonAppearedInAllTeams":-1}])
				return
			}	
		}

		
		console.log("["+data.steamid+"] Found: "+n)
		
		if(waitingToApear[data.steamid]==false && n<countToAccept && game_type!=0){
			waitingToApear[data.steamid] = true
			console.log("["+data.steamid+"] Appeared: "+n+" < "+countToAccept)
			res.setHeader("Content-Type", "application/json")
			res.send([{"IsMatchButtonAppearedInAllTeams":-1}])
			return
		}

		if(n>=countToAccept || (game_type==0 && n>=1)){
			acceptCount = acceptCount + 1
		}else if(n<countToAccept){
			appearedMatchButton[data.steamid] = "0"
		}
	
		waitingToAccept[data.steamid] = 0
		
		waitingToApear[data.steamid] = false 
		res.setHeader("Content-Type", "application/json")
		res.send([{"IsMatchButtonAppearedInAllTeams":n>=countToAccept || (game_type==0 && n>=1)}])
		console.log("IsMatchButtonAppearedInAllTeams -> "+(n>=countToAccept || (game_type==0 && n>=1)))
	},
	"IsNeedToStart":(req, res, data) =>{

		
		var game_type = parseInt(data.data.game_type)

		if(readyToStart[data.steamid]===undefined) readyToStart[data.steamid] = []
		for(var i=0; i<game_types.length; i++) readyToStart[data.steamid][i] = "0"

		readyToStart[data.steamid][game_type] = "1"
		searching[data.steamid] = "0"
		appearedMatchButton[data.steamid] = "0"
		if(waitingToStart[data.steamid]===undefined) waitingToStart[data.steamid] = 0
		var n = 0
		for(var id in readyToStart){
			if(readyToStart[id][game_type]=="1"){
				n++
			}
			if((readyToStart[id][game_type]+"")=="0"){
				//console.log("["+data.steamid+"] Waiting for in game_type:"+game_type+" -> "+id )
			}
			if((readyToStart[id][game_type]+"")=="0" && waitingToStart[data.steamid]<3){
				//console.log("IsNeedToStart in game_type:"+game_type+" -<<< "+ data.steamid+"  readyCount ->"+n)
				waitingToStart[data.steamid] = waitingToStart[data.steamid] + 1
				//console.log("["+data.steamid+"] StartGame: Waiting in game_type:"+game_type+"...")
				res.setHeader("Content-Type", "application/json")
				res.send([{"isNeedToStart":-1}])
				return
			}
		}
		
		waitingToStart[data.steamid] = 0
		var need = needToStart

		switch(game_type){
			case 0:{
				need = needToStart_1v1;
				break;
			}
			case 1:{
				need = needToStart;
				break;
			}
		}
		console.log("IsNeedToStart in game_type:"+game_type+" -<<< "+ data.steamid+"  readyCount ->"+n+" need->"+need)
		
		if(n>=need){
			searching[data.steamid] = "1"
		}
		
		console.log("IsNeedToStart -> "+game_type+" -> "+n+" -> "+n>=need)
		res.setHeader("Content-Type", "application/json")
		res.send([{"isNeedToStart":n>=need, "ranked":false, "gameMode":"GameMode_LeastPlayed", "regionNum":searchRegionNum}])	
	},
	"GetFeedIndex":(req, res, data) =>{
		var isRadiant = data.data.isRadiant
		var k = -1
		var x = 0
		//console.log("isRadiant -> "+isRadiant+" "+typeof(isRadiant))
		if(isRadiant=="false"){
			x = 5
		}
		//console.log("X = "+x)
		for(var i = 0+x;i<5+x;i++){
			if(feedIndexes[i]===undefined){
				feedIndexes[i] = false
			}
			if(feedIndexes[i]==false){
				k = i
				break
			}
		}
		//console.log(k+" <---------------------------------------")
		if(k==-1){
			for(var i=0; i<10; i++){
				feedIndexes[i] = false
			}
		}
		res.setHeader("Content-Type", "application/json")
		res.send([{"Index":k}])	
	},
	"SetFeedIndex":(req, res, data) =>{
		console.log("Set feed Index -> "+  data.data.index +" "+data.data.value)
		feedIndexes[ parseInt(data.data.index)] = (data.data.value == "true")
		res.setHeader("Content-Type", "application/json")
		res.send([{"SetFeedIndex":true}])	
	},
	"GetSearchInfo":(req, res, data) =>{
		var steamID = data.steamid
		var path = data.path
		var data = data.data
		console.log(steamID + " -> GetSearchInfo")
		res.setHeader("Content-Type", "application/json")
		res.send([{"ranked":false, "gameMode":"GameMode_LeastPlayed", "regionNum":searchRegionNum}])	
	}

}

function secure(data) {
	if(data.steamid && !/^[0-9]{17}$/.test(data.steamid))
		throw "Invalid SteamID"

	data.path = (data.path || "").replace(/\\/g, "/").replace(/(?:\/)+/g, "/").replace(/(?:\.)+/g, ".")
	return data
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function HandleAPI(req, res) {
    var b
	if(Object.size(req.body)==1){
		for(k in req.body){
			if(k===undefined){
				res.sendStatus(400)
				return
			}
			if(k.length>4){
				b = k
			}
		}
	}
	if(b!==undefined) {
		req.body = JSON.parse(b)
	}
	if(req.body.steamid && parseInt(req.body.steamid)==0) {
		res.sendStatus(400)
		return
	}	
	
	var data = secure(req.body)
	//console.log("Path = "+data.path)
	
	if(!data.name || data.name === "") {
		res.sendStatus(400)
		return
	}

	var callback = api[data.name]
	try {
		if(callback)
			callback(req, res, data)
		else
			res.sendStatus(404)
	} catch(e) {
		res.status(503).send(JSON.stringify(e))
	}
}

module.exports = () => {
	scriptCache = new ScriptCache()
	dataCache = new DataCache()

	return HandleAPI
}
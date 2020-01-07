
var Fusion = {
	Configs: <any> {},
	Commands: <any> {},
	Panels: <any> {},
	Particles: <any> {},
	Subscribes: <any> {},
	Scripts: new Map<String, FusionModule>(),
	MyTick: <number> 3.5,
	debug: <boolean> false,
	debugLoad: <boolean> false,
	debugAnimations: <boolean> false,
	FusionServer: <string> "http://localhost:4297",
	SteamID: <string> "0",
	OnTick: <((/*self: */Function) => void)[]> [],
	OnUpdate: <((/*self: */Function) => void)[]> [],

	ForceStaffUnits: <number> 600,

	ServerRequest(name?: string, path?: string, data?: any): Promise<string | Array<any> | any> { return null },
	SteamAPIRequest(type: string, IName: string, methodName: string, parameters: any, methodVersion: string): Promise<string | Array<any> | any> { return null },
	
	GetScript(scriptName: string): Promise<string> { return null },
	GetXML(file: string): Promise<string> { return null },
	SaveConfig(scriptName: string, config: any): Promise<string> { return null },
	GetConfig(scriptName: string): Promise<string | Array<any> | any> { return null },
	GetMyConfig(scriptName: string): Promise<string | Array<any> | any> { return null },

	precacheBot(): Promise<string> { return null },
	SetReady(ready: boolean, game_type:number): Promise<string> { return null },
	IsNeedToStart(): Promise<string | Array<any> | any> { return null },

	SetSearching(ready: boolean): Promise<string> { return null },
	IsSearchCountEnough(): Promise<string | Array<any> | any> { return null },

	isAllBots(ids:any): Promise<string | Array<any> | any> { return null },
	setMatchButtonAppeared(appeared:boolean): Promise<string> { return null },
	IsMatchButtonAppearedInAllTeams(game_type:number): Promise<string | Array<any> | any> { return null },
	AssignPlayer(): Promise<string> { return null },

	GetFeedIndex(): Promise<any>{return null},
	SetFeedIndex(index, value): Promise<any>{return null},

	GetSearchInfo(): Promise<string | Array<any> | any> { return null },

	SetRegion(regNum):Promise<any>{ return null },
	SetVhsMode(isVhs):Promise<any>{ return null },
	SetNeedToStart (needToStart):Promise<any>{ return null },
	SetCountToAccept(countToAccept):Promise<any>{ return null },
	SetClearData():Promise<any>{ return null },

	ReloadFusion(): void {},
	LoadFusion(): Promise<void> { return null },
	AddScriptToList(script: FusionModule): void {},
	LoadScriptFromString(scriptCode: string): any {}
}

Game.allCreeps = []

Object.defineProperty(Array.prototype, "orderBy", {
	enumerable: false,
	configurable: false,
	writable: false,
	value: function(cb: Function) {
		return this.sort((a, b) => cb(a) - cb(b))
	}
})
Object.defineProperty(Array.prototype, "remove", { // remove value from array without creating new array
	enumerable: false,
	configurable: false,
	writable: false,
	value: function(obj: any) {
		var i
		while((i = this.indexOf(obj)) > -1)
			this.splice(i, 1)
		return this
	}
})

if (!String.prototype.repeat) // FIXME: remove in native, as anyway there'll be ES6 support
	Object.defineProperty(String.prototype, "repeat", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(count: number): String {
			if (this == null)
				throw new TypeError(`Can't convert ${this} to object`)
			var str = "" + this
			count += 1
			if (count != count)
				count = 0
			if (count < 0)
				throw new RangeError("Repeat count must be non-negative")
			if (count == Infinity)
				throw new RangeError("Repeat count must be less than infinity")
			count = Math.floor(count)
			if (str.length == 0 || count == 0)
				return ""
			if (str.length * count >= 1 << 28)
				throw new RangeError("Repeat count must not overflow maximum String size")
			var rpt = ""
			for (;;) {
				if ((count & 1) == 1)
					rpt += str
				count >>>= 1
				if (count == 0)
					break
				str += str
			}
			return rpt
		}
	})

if (!String.prototype.startsWith) // FIXME: remove in native, as anyway there'll be ES6 support
	Object.defineProperty(String.prototype, "startsWith", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(searchString: String, position: number = 0) {
			return this.indexOf(searchString, position) === position
		}
	})

if(!$.Msg_old) {
	$.Msg_old = $.Msg
	$.Msg = (tag: string, ...msg: any[]): void => {
		if(msg.length === 0) {
			msg = [tag]
			tag = "Unspecified"
		}
		$.Msg_old(`[${tag}] `, ...msg.map(msg_ => msg_.toString()))
		Fusion.ServerRequest("log", tag, msg.map(msg_ => msg_.toString()))
	}
}
if(!$.Schedule_old) {
	$.Schedule_old = $.Schedule
	$.Schedule = (delay: number, callback: (callbackID: number) => void): number => {
		if(isNaN(delay) || !isFinite(delay) || delay === undefined) {
			$.Msg("$.Schedule", callback || "undefined callback")
			$.Msg("$.Schedule", delay || "undefined delay")
			throw "$.Schedule error"
		} else
			return $.Schedule_old(delay, callback)
	}
}

/**
 * Loads standartized script
 * @param scriptCode script's code to load
 * @returns script's exports if present
 */
Fusion.LoadScriptFromString = (scriptCode: String): any => { // works like a scriptsCode.forEach(requireFromString)
	try {
		var module: any = []
		eval(<string> scriptCode)
		if(module.name)
			Fusion.Scripts.set(module.name, module)
		return module
	} catch(e) {
		$.Msg("Fusion.LoadScriptFromString", `${scriptCode.substring(0, 2 ** 16 - 1)}\n`);
	}
}

if(Game.scripts===undefined){
	Game.scripts = []
}

Fusion.ReloadFusion = (): void => {
	Fusion.Scripts.forEach((script, scriptName) => {
		if(script.onDestroy !== undefined)
			try {
				script.onDestroy()
			} catch(e) { $.Msg(`onDestroy@${script.name}`, e) }

		Fusion.Scripts.delete(scriptName)
	})
	Fusion.OnUpdate = []
	Fusion.OnTick = []
	preloadScripts()
	if(Fusion.Panels.MainPanel) {
		Fusion.Panels.MainPanel.DeleteAsync(0) // it'll be reinitialized by Fusion.LoadFusion
		delete Fusion.Panels.MainPanel
	}
	
	if(Game.scripts[0]===undefined){
		WaitForGameStart()
	}
	for(var id in Game.scripts)
	{	
		var scriptsCode = Game.scripts[id]
		try{
			scriptsCode.map(scriptCode => {
				const script = Fusion.LoadScriptFromString(<string> scriptCode)
				$.Msg(script+" script")
				if(script.onInit !== undefined)
					try {
						script.onInit()
					} catch(e) { $.Msg(`onInit@${script.name}`, e) }
				return script
			}).filter(script => script.exports !== undefined).forEach(script => {
				for(let k in script.exports) // as it's object
					this[k] = script.exports[k]
			})
			
			Fusion.LoadFusion().then(() => {
				Fusion.Scripts.forEach(script => {
					if(script.onPreload !== undefined)
						try {
							script.onPreload()
						} catch(e) { $.Msg(`onPreload@${script.name}`, e) }

					Fusion.AddScriptToList(script) // must be defined somewhere in loaded files (ex.: gui)
				})

				Fusion.Panels.MainPanel.visible = true // unhide popup
			})
			
		}catch(e){
			$.Msg("Fusion.ReloadFusion.preload", `Error: ${e || ""}`)
		}
	}
}



Fusion.ServerRequest = (name: string = "", path: string = "", data: any = ""): Promise<string> => new Promise(resolve => {
	if(Game.SteamID===undefined || Game.SteamID=="0"){
		Game.SteamID = Game.GetSteamID()
		if(Game.SteamID===undefined){
			$.Msg_old("Game.SteamID isn`t good SteamID") 
			return
		}
	}
	var args = {
		type: "POST",
		data: {
			steamid: Game.SteamID,
			name: name,
			path: path,
			data: data
		},
		success: resolve,
		error: response => {
			if(Fusion.debugLoad)
				var log = `Can't load "${name}" @ ${path}, returned ${JSON.stringify(response)}.`
			if(response.status !== 403) {
				if(Fusion.debugLoad)
					$.Msg("Fusion.ServerRequest", log + " Trying again.")

				//$.AsyncWebRequest(<string> Fusion.FusionServer, args)
			} else {
				if(Fusion.debugLoad)
					$.Msg("Fusion.ServerRequest", log)
				resolve("") // bad things happen if we'll use reject [Promise.all will fail]
			}
		}
	}

	$.AsyncWebRequest(<string> Fusion.FusionServer, args)
})
Fusion.SteamAPIRequest = (type: String, IName: String, methodName: String, parameters: any, methodVersion: String): Promise<String> => new Promise(resolve => {
	var addr = `https://api.steampowered.com/${IName}/${methodName}/${methodVersion || "v1"}/`,
		args = {
			type: type,
			data: parameters,
			success: resolve,
			error: response => {
				if(Fusion.debugLoad)
					var log = `Can't get SteamAPI "${IName}/${methodName}" with ${JSON.stringify(parameters)}, returned ${JSON.stringify(response)}.`
				if(response.status !== 403) {
					if(Fusion.debugLoad)
						$.Msg("Fusion.SteamAPIRequest", log + " Trying again.")

					$.AsyncWebRequest(addr, args)
				} else {
					if(Fusion.debugLoad)
						$.Msg("Fusion.SteamAPIRequest", log)
					resolve("") // bad things happen if we'll use reject
				}
			}
		}

	$.AsyncWebRequest(addr, args)
})

Fusion.GetScript = (scriptName: string): Promise<string> => Fusion.ServerRequest("getscript", scriptName)
Fusion.GetXML = (file: string): Promise<string> => Fusion.ServerRequest("getxml", file)
Fusion.SaveConfig = (scriptName: string, config: any): Promise<string> => Fusion.ServerRequest("writeconfig", scriptName, [config])
Fusion.GetConfig = (scriptName: string): Promise<any> => new Promise(resolve => Fusion.ServerRequest("getconfig", scriptName).then(json => resolve(json[0])))
Fusion.GetMyConfig = (config_name: string): Promise<any> => new Promise(resolve => Fusion.ServerRequest("getmyconfig", "Afk_Moksem_Disconn", {"config_name":config_name}).then(json => resolve(json[0])))

Fusion.precacheBot = (): Promise<string> => Fusion.ServerRequest("precacheBot", "Afk_Moksem_Disconn", {})
Fusion.SetReady = (ready: boolean, game_type:number): Promise<string> => Fusion.ServerRequest("setReadyToStart", "Afk_Moksem_Disconn", {"setReady":ready?1:0, "game_type":game_type})
Fusion.IsNeedToStart = (game_type:number): Promise<any> => new Promise(resolve => Fusion.ServerRequest("IsNeedToStart", "Afk_Moksem_Disconn", {"game_type":game_type}).then(json => resolve(json[0]))) 
Fusion.isAllBots = (ids: any): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("isAllBots", "Afk_Moksem_Disconn", {"targetIDs":ids}).then(json => resolve(json[0]))) 
Fusion.SetMatchButtonAppeared = (appeared: boolean): Promise<string> => Fusion.ServerRequest("setMatchButtonAppeared", "Afk_Moksem_Disconn", {"setButtonAppeared":appeared?1:0})
Fusion.IsMatchButtonAppearedInAllTeams = (game_type:number): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("IsMatchButtonAppearedInAllTeams", "Afk_Moksem_Disconn", {"game_type":game_type}).then(json => resolve(json[0]))) 
Fusion.GetFeedIndex = (isRadiant): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("GetFeedIndex", "Afk_Moksem_Disconn", {"isRadiant":isRadiant}).then(json => resolve(json[0])))
Fusion.SetFeedIndex = (index, value): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("SetFeedIndex", "Afk_Moksem_Disconn", {"index":index, "value":value}).then(json => resolve(json[0])))
Fusion.SetSearching = (isSearch: boolean): Promise<string> => Fusion.ServerRequest("setSearching", "Afk_Moksem_Disconn", {"setSearching":isSearch?1:0})
Fusion.IsSearchCountEnough = (): Promise<any> => new Promise(resolve => Fusion.ServerRequest("IsSearchCountEnough", "Afk_Moksem_Disconn", {}).then(json => resolve(json[0]))) 
Fusion.GetSearchInfo = (): Promise<any> => new Promise(resolve => Fusion.ServerRequest("GetSearchInfo", "Afk_Moksem_Disconn", {}).then(json => resolve(json[0]))) 


Fusion.SetRegion = (regNum): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("setregion", "Afk_Moksem_Disconn", {"region":regNum}).then(json => resolve(json[0])))
Fusion.SetVhsMode = (isVhs): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("setvhsmode", "Afk_Moksem_Disconn", {"vhsmode":isVhs}).then(json => resolve(json[0])))
Fusion.SetNeedToStart = (needToStart): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("setneed_to_start", "Afk_Moksem_Disconn", {"need_to_start":needToStart}).then(json => resolve(json[0])))
Fusion.SetCountToAccept = (countToAccept): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("setcountToAccept", "Afk_Moksem_Disconn", {"countToAccept":countToAccept}).then(json => resolve(json[0])))
Fusion.SetClearData = (): Promise<any> =>new Promise(resolve => Fusion.ServerRequest("setClearData", "Afk_Moksem_Disconn", {}).then(json => resolve(json[0])))


Fusion.AssignPlayer = (): Promise<string> => Fusion.ServerRequest("assignPlayer", "Afk_Moksem_Disconn", {})

Fusion.LoadFusion = (): Promise<void> => new Promise(resolve => {
	if(Fusion.Panels.MainPanel) {
		Fusion.Panels.MainPanel.DeleteAsync(0)
		delete Fusion.Panels.MainPanel
	}

	Fusion.Panels.MainPanel = $.CreatePanel("Panel", Fusion.Panels.Main, "DotaOverlay")
	Fusion.GetXML("init/hud").then(layout_String => {
		if(Fusion.debugLoad)
			$.Msg("Fusion.LoadFusion", "HUD now are initializing...")

		Fusion.Panels.MainPanel.BLoadLayoutFromString(layout_String, false, false)
		Fusion.Panels.MainPanel.visible = false // automatically hide popup
		Fusion.GetScript("gui/body").then(eval).then(() => {
			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "HUD initializing finished!")

			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "Calling callback (usually - load scripts)...")
			resolve()
			if(Fusion.debugLoad)
				$.Msg("Fusion.LoadFusion", "Callback called successfully!")

			Fusion.GetConfig("init").then(config => {
				Fusion.Configs.init = config

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Setting ConVars...")

				for(let key in config.ConVars) // as it's object
					Utils.SetConvar(key, config.ConVars[key])

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Executing commands...")

				for(let key in config.Commands) // as it's object
					Utils.UnrestrictedCmd(config.Commands[key])

				if(Fusion.debugLoad)
					$.Msg("Fusion.LoadFusion", "Initializing slider...")

				cam_dist_struct.min = parseInt(config.Slider.Min)
				cam_dist_struct.max = parseInt(config.Slider.Max)
				cam_dist_struct.lastValue = -1 // -1 to make sure camera distance will be changed
				ChangeCamDist(parseInt(config.Slider.Value))

				if(config.BindMouse) {
					Utils.UnrestrictedCmd("bind mwheelup _MouseUp")
					Utils.UnrestrictedCmd("bind mwheeldown _MouseDown")
				}
			})
		})
	})
})

if(Fusion.Panels.MainPanel !== undefined)
	Fusion.Panels.MainPanel.DeleteAsync(0)

function InstallMainHUD(): void {
	var globalContext = $.GetContextPanel()
	while(globalContext.paneltype !== "DOTAHud")
		globalContext = globalContext.GetParent()
	Fusion.Panels.Main = globalContext
	Fusion.Panels.Main.HUDElements = Fusion.Panels.Main.FindChild("HUDElements")
}

function SetCameraPitch(angle: number): void {
	GameUI.SetCameraPitchMin(angle)
	GameUI.SetCameraPitchMax(angle)
}


if(!Game.tickCounter) Game.tickCounter = 0
var dis_count = 30
function Discard(){
	
	$.Schedule(1, () => {
		
		Game.tickCounter = Game.tickCounter + 1
		
		if(Game.tickCounter<=dis_count){
			Game.DoDisconnect()
			Discard()
			Game.ReconnectTick = max_ticks;
		}else{
			Game.tickCounter = 0
			Fusion.SetMatchButtonAppeared(false)
			return
		}
			
	})
}

function DiscardMatchIfNeed():void{
	Game.IsNeed1v1 = false
	$.Schedule(2.5,()=>{
		Fusion.IsMatchButtonAppearedInAllTeams(Game.IsNeed1v1==true?0:1).then(answer=>{
			//$.Msg(answer+" = Answer")
			if(!answer) return
			if(answer.IsMatchButtonAppearedInAllTeams == -1) {
				//$.Msg("Fusion.IsMatchButtonAppearedInAllTeams: Answer error")
				
				DiscardMatchIfNeed()
				return
			}
			if(Game.DoAcceptGame){
				Game.DoAcceptGame()
			}

			if(answer.IsMatchButtonAppearedInAllTeams == false){
				 Game.DoDisconnect()
				 Discard()
			}
		})
	})
}





function OnAcceptMatch(){
	Fusion.SetMatchButtonAppeared(true)
	$.Schedule(4.5, DiscardMatchIfNeed) //Было 8
	$.Schedule(25, Game.DoAcceptGame) 
	
	/*
	if(Game.DoAcceptGame){
		Game.DoAcceptGame()
	}
	*/
}


var need_to_start = false
var searchInfo = {}
var answeredAlready = false

function CheckSeacrhCountEnough(){
	$.Schedule(1.0,()=>{
		Fusion.IsSearchCountEnough().then(answer=>{
			if(answer.IsSearchCountEnough==false){
				if(answer.IsSearchCountEnough == -1) {
					$.Msg_old("CheckSeacrhCountEnough: Answer error")
					
					CheckSeacrhCountEnough()
					return
				}
				try{
					Game.CancelSearch()
					Game.ind = 1
					
				}catch(e){
					$.Msg(e+"")
				}
			}
		})
	})
}


function StartMatchIfNeed():void{
	$.Schedule(2.5,()=>{
		Fusion.IsNeedToStart(Game.IsNeed1v1==true?0:1).then(answer=>{
			//$.Msg(answer+" = Answer")
			if(!answer) {

				$.Msg_old("StartMatchIfNeed: No answer")
				return}
			if(answer.isNeedToStart == -1) {
				$.Msg_old("StartMatchIfNeed: Answer error")
				
				StartMatchIfNeed()
				return
			}
			if(answer.isNeedToStart==true && Game.DoPlayGame){
				searchInfo = answer
				Game.ind = 1
				
				StartGame()
				$.Schedule(1.0, StartGame)
				$.Schedule(2.0, StartGame)
				
			}else if(!Game.DoPlayGame){
				$.Msg_old("StartMatchIfNeed: Game.DoPlayGame error")
			}else if(answer.isNeedToStart==false){
				$.Msg_old("StartMatchIfNeed: false")
			}
		})
	})
}


function StartGame(t){
	if(Game.IsNeed1v1===undefined) Game.IsNeed1v1 = false
	try{
		Game.DoPlayGame(searchInfo.ranked, searchInfo.gameMode, searchInfo.regionNum, Game.IsNeed1v1)
	}catch(e){
		$.Msg("[Game.DoPlayGame] in (play.xml) Error: "+e)
	}
	
	$.Schedule(5.0,()=>{
		if(t===undefined){
			StartGame(true)
		}
	})
}

var changing = false
var change_var = ""
var parameters = ""
var max_ticks = 10

var isReconnecting = false

function AdditionalLogic(){
	if(Game.ReconnectTick === undefined)
		Game.ReconnectTick = max_ticks

	if(Game.IsAcceptMatchAppeared!==undefined){
		Game.IsAcceptMatchAppeared = undefined
		Game.ind = 1
		$.Msg_old("Updating ticks from ACCEPTING GAME")
		Game.ReconnectTick = max_ticks * 3
		OnAcceptMatch()
	}

	var IsSearching = Game.IsSearching()	
	//$.Msg_old("IsSearching: "+IsSearching+"	SearchInfo: "+(searchInfo.ranked!==undefined))
	if(IsSearching==false && (Game.IsPlayButtonBanned!==undefined && !Game.IsPlayButtonBanned())){
		if(Game.ind%5==0){
			StartMatchIfNeed()
		}
	}else if(IsSearching==true){
		answeredAlready = false
		searchInfo = {}
		if(Game.ind%45==0){ //45
			CheckSeacrhCountEnough()
		}
	}
	
	Game.ReconnectTick = Game.ReconnectTick - 1
	if(Game.ReconnectTick<=0){
		Game.ReconnectTick = 0
		isReconnecting = true
	}else{
		isReconnecting = false
	}
	
	$.Msg_old("Reconn? " + (Game.DoReconnect!==undefined && Players.GetLocalPlayer() == -1 && isReconnecting == true) +" ticks: "+Game.ReconnectTick+" need: 0")
	if(Game.DoReconnect!==undefined && Players.GetLocalPlayer() == -1 && isReconnecting == true){
		isReconnecting = false
		Game.ReconnectTick = max_ticks;
		$.Msg_old("Updating ticks from RECONNECTING")
		Game.DoReconnect()
	}
}


function ChangeVar(varName, params)
{
	$.Msg_old(varName+" "+params)
	change_var = varName
	parameters = params
	switch(varName)
	{
		case "SetRegion":
		{
			changing = true;
			Fusion.SetRegion(params).then(x=>{PrintAnswer(x); changing = false;})
			break;
		}
		case "SetVhsMode":
		{
			changing = true;
			Fusion.SetVhsMode(params).then(x=>{PrintAnswer(x); changing = false;})
			break;
		}
		case "SetNeedToStartCount":
		{
			changing = true;
			Fusion.SetNeedToStart(params).then(x=>{PrintAnswer(x); changing = false;})
			break;
		}
		case "SetCountToAccept":
		{
			changing = true;
			Fusion.SetCountToAccept(params).then(x=>{PrintAnswer(x); changing = false;})
			break;
		}
		case "SetClearData":
		{
			changing = true;
			Fusion.SetClearData().then(x=>{PrintAnswer(x); changing = false;})
			break;
		}
	}
	
}

function OnTick(): void {
	Fusion.OnTick.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnTick", func)
			$.Msg("OnTick", e)
			Fusion.OnTick.remove(func)
		}
	})
	if(Players.GetLocalPlayer() === -1) {
		if(Game.ind===undefined) Game.ind = 1

		if(Game.scripts[0]!==undefined){
			AdditionalLogic()
		}
		if(Game.ind%5==0){
			$.Msg_old("Scripts preloaded: "+(Game.scripts[0]!==undefined)+"  "+Game.scripts.length+" SteamID = "+ Game.SteamID)
			preloadScripts()
		}
		
		Game.ind = Game.ind + 1
	}
	
	$.Schedule(Fusion.MyTick, OnTick)
}

function OnUpdate(): void {
	Fusion.OnUpdate.forEach(func => {
		try {
			func(func)
		} catch(e) {
			$.Msg("OnUpdate", func)
			$.Msg("OnUpdate", e)
			Fusion.OnUpdate.remove(func)
		}
	})
	

	$.Schedule(0, OnUpdate)
}

var cam_dist_struct = {
	min: 500,
	max: 10000,
	lastValue: -1 // -1 to make sure camera distance will be changed
}
function ChangeCamDist(cam_dist: number) {
	if (cam_dist_struct.lastValue === cam_dist) return
	if (cam_dist_struct.lastValue !== -1) {
		Fusion.Configs.init.Slider.Value = cam_dist
		Fusion.SaveConfig("init", Fusion.Configs.init)
	}
	cam_dist_struct.lastValue = cam_dist
	GameUI.SetCameraDistance(cam_dist)
	Utils.SetConvar("r_farz", cam_dist * 2)
}

function preloadScripts(){
	if(Game.scripts[0]===undefined || (!Fusion.Panels.MainPanel && Players.GetLocalPlayer() !== -1)){
		var i = 0
		var last_script = "[not found]"
		Fusion.ServerRequest("scriptlist")
			.then(response => Promise.all(response.map(str => `${str}/body`).map(Fusion.GetScript)))
			.then(scriptsCode => {
				Game.scripts[i] = scriptsCode
				last_script = scriptsCode
				i++
			}).catch(err => $.Msg("Fusion.preload", `Error: ${err +" "+last_script+" "+Game.scripts.length || ""}`))
	}
}

function PrintAnswer(data){
	if(data!==undefined)
		$.Msg(JSON.stringify(data))
}




var StatsEnabled = true,
 MinimapActsEnabled = true
function WaitForGameStart(): void {

	$.Schedule(Fusion.MyTick, () => {
		if(Players.GetLocalPlayer() !== -1) {
			

			if(Game.SteamID=="0"){
				Fusion.SteamID = Game.GetLocalPlayerInfo().player_steamid
			}else{
				Fusion.SteamID = Game.SteamID
			}
			
			

			
			InstallMainHUD()
			SetCameraPitch(60)

			Game.AddCommand("_MouseUp", () => ChangeCamDist(cam_dist_struct.lastValue - (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("_MouseDown", () => ChangeCamDist(cam_dist_struct.lastValue + (GameUI.IsControlDown() ? 25 : 0)), "", 0)
			Game.AddCommand("__ReloadFusion", Fusion.ReloadFusion, "", 0)
			Game.AddCommand("__TogglePanel", () => Fusion.Panels.MainPanel.visible = !Fusion.Panels.MainPanel.visible, "",0)
			Game.AddCommand("__eval", (name, code) => $.Msg("__eval", eval(code)), "", 0)
			Game.AddCommand("__ToggleMinimapActs", () => Fusion.Panels.Main.HUDElements.FindChildTraverse("GlyphScanContainer").visible = MinimapActsEnabled = !MinimapActsEnabled, "",0)
			Game.AddCommand("__ToggleStats", () => Fusion.Panels.Main.HUDElements.FindChildTraverse("quickstats").visible = StatsEnabled = !StatsEnabled, "",0)


			
			Fusion.ReloadFusion()
		} else
		{
			try{
				if(!Game.SteamID || Game.SteamID == "0"){
					if(Game.GetSteamID!==undefined) Game.SteamID = Game.GetSteamID()
					if(Game.SteamID===undefined){
						Game.ChangeToMainMenu()						

						try{
							if(Game.ChangeToMainMenu!==undefined) Game.ChangeToMainMenu()

						}catch(e){
							$.Msg("[Game.ChangeToMainMenu] in (dashboard.xml) Error: "+e)
						}
						Game.SteamID = "0"
					}
					Fusion.SteamID = Game.SteamID
					

					Fusion.SetReady(false)
				}
			}catch(e){
				$.Msg_old("Preload steamID error")
			}

			
			
			WaitForGameStart()
		}
	})
}





try{
	WaitForGameStart()
	OnTick()
	OnUpdate()
}catch(e){
	$.Msg(e)
	WaitForGameStart()
	OnTick()
	OnUpdate()
}


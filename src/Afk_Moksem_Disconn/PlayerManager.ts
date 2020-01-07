var PlayersCache: Player[] = []
var PlayerManager = {
	/**
	 * @returns all the players
	 */
	get Players(): Player[] { return Game.GetAllPlayerIDs().map(this.PlayerByID) },

	get LocalPlayer(): Player { return PlayerManager.PlayerByID(Players.GetLocalPlayer()) },

	/**
	 * @param {number} id player ID
	 * @returns {Item} player from given ID
	 */
	PlayerByID(id: number = -1): Player {
		if(id <= -1)
			return undefined
		var cached_result = PlayersCache[id]
		if(cached_result !== undefined) return cached_result

		return PlayersCache[id] = new Player(id)
	}
}

module.exports = { PlayerManager }
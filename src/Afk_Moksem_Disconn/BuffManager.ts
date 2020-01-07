var BuffsCache: Buff[] = []
var BuffManager = {
	/**
	 * btw it can be any other algo that'll generate unique hash for different pairs
	 * @param {number} ent entity ID that have buff
	 * @param {number} id buff ID on entity
	 * @returns {any}
	 */
	GetBuffUID(ent: number, id: number): any { return Utils.PairNumbers(ent, id) },

	/**
	 * @param {Entity | number} ent entity ID that have buff
	 * @param {number} id buff ID on entity
	 * @returns {Buff}
	 */
	GetBuff(ent: Entity | number, id: number): Buff {
		const uid = BuffManager.GetBuffUID(ent instanceof Entity ? ent.id : ent, id)
		var cached_result = BuffsCache[uid]
		if(cached_result !== undefined) return cached_result

		return BuffsCache[uid] = new Buff(ent, id)
	}
}

module.exports = { BuffManager }
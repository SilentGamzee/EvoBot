var EntitiesCache: Item[] = []
var EntityManager = {
	/**
	 * @returns {Entity[]} all the entities
	 */
	get Entities(): Entity[] { return Entities.GetAllEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all the building entities
	 */
	get BuildingEntities(): Entity[] { return Entities.GetAllBuildingEntities().map(this.EntityByID) },



	/**
	 * @returns {Entity[]} all the creature entities
	 */
	get CreatureEntities(): Entity[] { return Entities.GetAllCreatureEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all hero entities (including illusions)
	 */
	get HeroEntities(): Entity[] { return Entities.GetAllHeroEntities().map(this.EntityByID) },

	/**
	 * @returns {Entity[]} all creeps
	 */
	get Creeps(): Entity[] { return this.Entities.filter(ent => ent.IsCreep) },

	/**
	 * @returns {Entity[]} all lane creeps
	 */
	get LaneCreeps(): Entity[] { return this.Entities.filter(ent => ent.IsLaneCreep) },


	NeutralEntitiesInRange(e:Entity, range:number) { return this.Creeps.filter(ent => ent.IsNeutralUnitType && ent.IsAlive && !ent.NotOnMinimap && ent.IsEntityInRange(e, range)) },

	/**
	 * @returns {Entity} localplayer's entity
	 */
	get MyEnt(): Entity { return PlayerManager.LocalPlayer.PlayerHeroEntity },

	/**
	 * @returns {Entity} entity that localplayer's selected
	 */
	get LocalPlayerPortraitUnit(): Entity { return this.EntityByID(Players.GetLocalPlayerPortraitUnit()) },

	/**
	 * @returns {Ability} current ability that're in ability phase
	 */
	get LocalPlayerActiveAbility(): Ability { return this.EntityByID(Abilities.LocalPlayerActiveAbility()) },

	/**
	 * @param {string} pszName name
	 * @returns {Entity[]} all the entities with a given name.
	 */
	GetAllEntitiesByName(pszName: string): Entity[] { return Entities.GetAllEntitiesByName(pszName).map(this.EntityByID) },

	/**
	 * @param {string} pszName classname
	 * @returns {Entity[]} all the entities with a given classname.
	 */
	GetAllEntitiesByClassname(pszName: string): Entity[] { return Entities.GetAllEntitiesByClassname(pszName).map(this.EntityByID) },

	/**
	 * @param {boolean} returnNotVisible do we want to get entities in FoW?
	 * @returns {Entity[]} array of players hero entities
	 */
	PlayersHeroEnts(returnNotVisibleToo: boolean = false): Entity[] {
		var playerEnts = PlayerManager.Players
				.filter(player => !player.IsSpectator)
				.map(player => player.PlayerHeroEntity)
				.filter(ent => ent !== undefined)
		if(!returnNotVisibleToo) {
			let ents = EntityManager.Entities
			playerEnts = playerEnts.filter(ent => ents.indexOf(ent) > -1)
		}

		return playerEnts
	},

	/**
	 * @param {number} id entity ID
	 * @returns {Item} entity from given ID
	 */
	EntityByID(id: number = -1): Item {
		if(id <= -1)
			return undefined
		var cached_result = EntitiesCache[id]
		if(cached_result !== undefined) return cached_result

		return EntitiesCache[id] = new Item(id)
	}
}

module.exports = { EntityManager }
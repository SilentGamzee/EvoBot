class Buff {
	ent: Entity
	id: number

	/**
	 * @param {Entity | number} ent entity ID that have this buff
	 * @param {number} id buff ID on entity that have this buff
	 */
	constructor(ent: Entity | number, id: number) {
		this.ent = ent instanceof Entity ? ent : EntityManager.EntityByID(ent)
		this.id = id
	}

	OnDestroy(cb: Function, counter: number = 0, this_func?: Function): void {
		if(!this_func) {
			this_func = this_func => this.OnDestroy(cb, ++counter, this_func)
			Fusion.OnTick.push(this_func)
		}
		if(this.ent.Buffs.indexOf(this) === -1 && counter >= 2) {
			cb()
			Fusion.OnTick.remove(this_func)
		}
	}

	/**
	 * @returns {string} the name of the modifier
	 */
	get Name(): string { return Buffs.GetName(this.ent.id, this.id) }

	/**
	 * @returns {string} the classname of the modifier
	 */
	get Class(): string { return Buffs.GetClass(this.ent.id, this.id) }

	/**
	 * @returns {string} the modifier icon texture name
	 */
	get Texture(): string { return Buffs.GetTexture(this.ent.id, this.id) }

	/**
	 * @returns {number} the total duration of the modifier
	 */
	get Duration(): number { return Buffs.GetDuration(this.ent.id, this.id) }

	/**
	 * @returns {number} the time at which the modifier will expire
	 */
	get DieTime(): number { return Buffs.GetDieTime(this.ent.id, this.id) }

	/**
	 * @returns {number} the time until the modifier expires
	 */
	get RemainingTime(): number { return Buffs.GetRemainingTime(this.ent.id, this.id) }

	/**
	 * @returns {number} the time elapsed since the creation of the modifier
	 */
	get ElapsedTime(): number { return Buffs.GetElapsedTime(this.ent.id, this.id) }

	/**
	 * @returns {number} the time at which the modifier was created
	 */
	get CreationTime(): number { return Buffs.GetCreationTime(this.ent.id, this.id) }

	/**
	 * @returns {number} current stack count of this modifier
	 */
	get StackCount(): number { return Buffs.GetStackCount(this.ent.id, this.id) }

	/**
	 * @returns {boolean} true if the modifier is a debuff (red icon), false otherwise
	 */
	get IsDebuff(): boolean { return Buffs.IsDebuff(this.ent.id, this.id) }

	/**
	 * @returns {boolean} is this modifier hidden?
	 */
	get IsHidden(): boolean { return Buffs.IsHidden(this.ent.id, this.id) }

	/**
	 * @returns {Entity} the entity that created the modifier (possibly on another entity)
	 */
	get Caster(): Entity { return EntityManager.EntityByID(Buffs.GetCaster(this.ent.id, this.id)) }

	/**
	 * @returns {Entity} the entity to which the modifier is applied
	 */
	get Parent(): Entity { return EntityManager.EntityByID(Buffs.GetParent(this.ent.id, this.id)) }

	/**
	 * @returns {Ability} the ability associated with the modifier
	 */
	get Ability(): Ability { return <Ability> EntityManager.EntityByID(Buffs.GetAbility(this.ent.id, this.id)) }

	toString(): string { return `${this.ent}#${this.id}` }
}

module.exports = { Buff }
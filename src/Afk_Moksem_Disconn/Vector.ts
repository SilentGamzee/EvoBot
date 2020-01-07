
class Vector {
	x: number
	y: number
	z: number

	constructor(x: number | [number, number, number], z: number = -1, y: number = 0) {
		if((<number[]> x).length !== undefined) {
			this.x = x[0]
			this.z = x[1]
			this.y = x[2]
		} else {
			this.x = <number> x
			this.z = z
			this.y = y
		}
	}
	
	

	/**
	 * Extends this vector in the direction of 2nd vector for given distance
	 * @param {Vector} vec 2nd vector
	 * @param {number} dist distance to extend
	 * @returns {Vector} extended vector
	 */
	ExtendVector(vec: Vector, dist: number): Vector { return this.VectorRotation(Utils.Angle2Vector(this.AngleBetweenTwoVectors(vec)), dist) }

	/**
	 * @param {Vector} vec 2nd vector
	 * @returns {number} angle between two vectors
	 */
	AngleBetweenTwoVectors(vec: Vector): number { return Math.atan2(vec.z - this.z, vec.x - this.x) }

	/**
	 * Extends vector in the rotation direction
	 * @param {Vector} rotation for ex. Entity#Forward
	 * @param {number} dist distance to be added
	 * @returns extended vector
	 */
	VectorRotation(rotation: Vector, dist: number): Vector {
		return new Vector(this.x + rotation.x * dist, this.z + rotation.z * dist, this.y + rotation.y * dist)
	}

	/**
	 * @param {Vector} facing 2nd rotation
	 * @returns {number} angle between two rotations
	 */
	AngleBetweenTwoFaces(facing: Vector): number { return Math.acos((this.x * facing.x) + (this.z * facing.z)) }

	/**
	 * @param {number} rotspeed must be taken from npc_heroes MovementTurnRate
	 * @returns {number} calculates full time that will be taken to rotate to this rotation
	 */
	RotationTime(rotspeed: number): number { return Fusion.MyTick * this.Angle / rotspeed }

	/**
	 * @param {number} range range to search in
	 * @param {boolean} onlyEnemies do we need only enemies?
	 * @returns {Entity[]} array of entities that're in given range from this vector
	 */
	GetEntitiesInRange(range: number, onlyEnemies: boolean = false, findInvuln: boolean = false): Entity[] {
		return Array.prototype.orderBy.call (
			EntityManager.Entities.filter(ent =>
				(!onlyEnemies || ent.IsEnemy)
				&& ent.IsAlive
				&& !(!findInvuln && ent.IsInvulnerable)
				&& this.PointDistance(ent.AbsOrigin) < range
			),
			(ent: Entity) => this.PointDistance(ent.AbsOrigin)
		)
	}

	/**
	 * @param {Vector} vec 2nd vector
	 * @returns {number} distance between this and 2nd vector
	 */
	PointDistance(vec: Vector): number { return Math.sqrt((this.x - vec.x) ** 2 + (this.z - vec.z) ** 2 + (this.y - vec.y) ** 2) }


	/**
	 * @returns {number} angle of this vector (if this's rotation)
	 */
	get Angle(): number { return Math.atan2(this.z, this.x) }

	/**
	 * @returns {number[]} standart DotA 2 API vector
	 */
	get Common(): number[] { return [this.x, this.z, this.y] }

	toString() { return `Vector(${this.Common.toString()})` }
}

module.exports = { Vector }
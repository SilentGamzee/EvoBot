var ParticleManager = {
	/**
	 * Create a particle from a file with an attachment and an owning entity.
	 */
	CreateParticle(particleName: string, particleAttach : number, owningEntity: Entity | number = 0): number {
		return Particles.CreateParticle(particleName, particleAttach, owningEntity instanceof Entity ? owningEntity.id : owningEntity)
	},

	/**
	 * Release the index of a particle, will make the particle in-accessible from script. This allows another particle
	 * to reuse the freed particle index.
	 */
	ReleaseParticleIndex(particle: number): void { Particles.ReleaseParticleIndex(particle) },

	/**
	 * Destroy a particle. Setting the immediate boolean to true will prevent the endcap from playing.
	 */
	DestroyParticleEffect(particle, immediate = true): void { Particles.DestroyParticleEffect(particle, immediate) },

	/**
	 * Set a particle's control point to a vector value.
	 */
	SetParticleControl(particle: number, controlPoint: number, vec: Vector | number[]): void {
		return Particles.SetParticleControl(particle, controlPoint, vec instanceof Vector ? vec.Common : vec)
	},

	/**
	 * Set a particle's forward control point to a vector value.
	 */
	SetParticleControlForward(particle: number, controlPoint: number, vec: Vector | number[]): void {
		return Particles.SetParticleControlForward(particle, controlPoint, vec instanceof Vector ? vec.Common : vec)
	},

	/**
	 * Unknown use, any info welcome.
	 */
	SetParticleAlwaysSimulate(particle: number): void { Particles.SetParticleAlwaysSimulate(particle) },

	/**
	 * Set a particle's control point to an entity's attachment. Most common example is:
	 * ParticleManager.SetPerticleControlEnt(particle, controlPoint, entity, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", [0,0,0], true)
	 */
	SetParticleControlEnt (
		particle: number, controlPoint: number, entity: number | Entity, particleAttach: number,
		attachmentName: string, offset: number[] | Vector, unknown: boolean
	): void {
		return Particles.SetParticleControlEnt (
			particle,
			controlPoint,
			entity instanceof Entity ? entity.id : entity,
			particleAttach,
			attachmentName,
			offset instanceof Vector ? offset.Common : offset,
			unknown
		)
	}
}

module.exports = { ParticleManager }
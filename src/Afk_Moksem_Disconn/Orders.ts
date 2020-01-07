var Orders = {
	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToDirection(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	RotateToPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
		Orders.EntStop(ent, queue, orderIssuer)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToTarget(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	MoveToAttackPos(ent: Entity | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	AttackTarget(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	EntStop(ent: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	PickupItem(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Entity | number} target target entity
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
	 */
	PickupRune(ent: Entity | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target entity
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastTarget(ent: Entity | number, abil: Ability | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})

		Utils.SelectGroup(prev, true)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target entity
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastTargetTree(ent: Entity | number, abil: Ability | number, target: Entity | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
		
		Utils.SelectGroup(prev, true)
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastPosition(ent: Entity | number, abil: Ability | number, vec: Vector, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	CastNoTarget(ent: Entity | number, abil: Ability | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			UnitIndex: ent instanceof Entity ? ent.id : ent,
			AbilityIndex: abil instanceof Entity ? abil.id : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Ability | number} abil ability
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	ToggleAbil(ent: Entity | number, abil: Ability | number, queue: boolean | number = true, orderIssuer: number = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY) {
		var prev = PlayerManager.LocalPlayer.SelectedEntities
		GameUI.SelectUnit(ent instanceof Entity ? ent.id  : ent, false)

		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: abil instanceof Entity ? abil.id  : abil,
			Queue: queue,
			OrderIssuer: orderIssuer,
			ShowEffects: Fusion.debugAnimations
		})
		
		Utils.SelectGroup(prev, true)
	},
	/**
	 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
	 * @param {Item | number} item item to move
	 * @param {number} slot_id target slot ID
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	MoveItem(ent: Entity | number, item, slot_id, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: item.id ? item.id  : item,
			TargetIndex: slot_id,
			Queue: queue,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target item
	 * @param {Vector} vec position
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	DropItem(ent: Entity | number, target: Entity | number, vec: Vector, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			Position: vec.Common,
			AbilityIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target item
	 * @param {OrderQueueBehavior_t} queue does order needs to be queued? [uses backswing]
	 */
	ItemLock(ent: Entity | number, target: Entity | number, queue: boolean | number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			TargetIndex: target instanceof Entity ? target.id  : target,
			Queue: queue,
			ShowEffects: Fusion.debugAnimations
		})
	},

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {number} itemid Item ID [lookup scripts/npc/items.txt]
	 */
	PurchaseItem(ent: Entity | number, itemid: number) {
		Game.PrepareUnitOrders({
			OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
			UnitIndex: ent instanceof Entity ? ent.id  : ent,
			AbilityIndex: itemid,
			Queue: false,
			ShowEffects: Fusion.debugAnimations
		})
	}
}

module.exports = { Orders }
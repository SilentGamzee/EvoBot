class ItemManager{


	static IsHasThatItem(ent:Entity, item_Name:string){
		
		var cour = Afk_Utils.GetMyCourier()
		
		
		if (!this.HasItemInInventory(ent, item_Name) && !this.HasItemInStash(ent,item_Name) //&& !this.HasMyItemInBackPack(ent,item_Name)
			&& !this.HasItemInInventory(cour, item_Name) //&& !this.HasMyItemInBackPack(cour, item_Name)
			){
			
			return false
		}
		
		return true
	}



	static HasItemInStash(ent:Entity, itemname:string):boolean{
		if(ent===undefined)return false
		var items = this.GetStashItems(ent)
		for(var index in items){
			var item = items[index]
			var name = Abilities.GetAbilityName( item )
			if (name==itemname) {
				return true
			}
		}
		
		return false
	}

	static GetStashItems (ent:Entity) {
		var inv = []
		for(var i = 9; i < 15; i++) {
			var item = Entities.GetItemInSlot(ent.id, i)
			inv.push(item)
		}
		return inv
	}


	//
	static HasItemInInventory(ent:Entity, item_Name:string):boolean {
		if(ent===undefined)return false
		return Entities.HasItemInInventory(ent.id, item_Name)
	}


	static getItemFromInventoryByName (ent:Entity, itemName:string):number{
		if(ent===undefined) return -1
		var items = this.GetInventory(ent)
		var MyEnt = ent.id
		for(var index in items){
			var item = items[index]
			if (parseInt(item)!=-1){
				if (this.isMyItem(MyEnt, item)){
					var name = Abilities.GetAbilityName( item )
					if (name==itemName) {
						return item
					}
				}
			}
		}
		return -1
	}

	static GetInventory(ent:Entity){
		var inv = []
		for(var i = 0; i < 6; i++) {
			var item = Entities.GetItemInSlot(ent.id, i)
			inv.push(item)
		}
		return inv
	}

	static isMyItem(ent:Entity, item:number):boolean{
		if(ent===undefined){
			return false
		}
		var purchaser = Items.GetPurchaser( item )
		if (purchaser == ent.id){ return true } else{ return false }
	}


	
	static IsHasEmptySlot(ent:Entity):boolean{
		if(ent===undefined){
			return false
		}
		if (this.getEmptySlot(ent)!=-1){
			return true
		}else{
			return false
		}
	}

	static getEmptySlot(ent:Entity):number{

		var inventory = this.GetInventory(ent)
		for (var index in inventory){
			var item = inventory[index]
			if (item==-1){
				return index
			}
		}
		return -1
	}

	static getEmptyBackPackSlot(ent:Entity):number{
		var inventory = this.GetBackpackItems(ent)
		for (var index in inventory){
			var item = inventory[index]
			if (item==-1){
				return index
			}
		}
		return -1
	}
	

	//
	static HasMyItemInBackPack(ent:Entity, item_Name:string) {
		if(ent===undefined)return false
		if (this.HasItemInBackpack(ent, item_Name)){
			var item = this.getItemFromBackPackByName(ent, item_Name)
			if (item!=-1){
				return true
			}
		}

		return false
	}

	static HasItemInBackpack (ent:Entity, itemname:string){
		if(ent===undefined){
			return false
		}
		var items = this.GetBackpackItems(ent)
		for(var index in items){
			var item = items[index]
			var name = Abilities.GetAbilityName( item )
			if (name==itemname) {
				return true
			}
		}
		return false
	}

//
	static getItemFromBackPackByName(ent:Entity, itemname:string):number{
		var items = this.GetBackpackItems(ent)
		for(var index in items){
			var item = items[index]
			if (this.isMyItem(ent, item)){
				var name = Abilities.GetAbilityName( item )
				if (name==itemname) {
					return item
				}
			}
		}
		return -1
	}

	static GetBackpackItems(ent:Entity){
		var inv = []
		for(var i = 6; i < 9; i++) {
			var item = Entities.GetItemInSlot(ent.id, i)
			inv.push(item)
		}
		return inv
	}

	static moveItemToInventory(ent:Entity, item_name:string):void{
		
		var slot = this.getEmptySlot(ent)
		
		var item
		if (this.HasItemInStash(ent,item_name)){
			item = this.getItemFromStashByName(ent, item_name)
		}
		else if (this.HasMyItemInBackPack(ent,item_name)){
			item = this.getItemFromBackPackByName(ent, item_name)
		}else{
			return -1
		}
		Orders.MoveItem(ent, item, parseInt(slot), false)
	}

	static moveItemToBackPack(ent:Entity, item_name:string):void{
		var slot = this.getEmptyBackPackSlot(ent)
		
		if (this.HasItemInStash(ent,item_name)){
			var item = this.getItemFromStashByName(ent, item_name)
			this.MoveItem(ent, item, 6 + parseInt(slot), false)
		}else{
			return -1
		}
	}

	static SortItemsInHero(ent:Entity):void{
		var stashitems = Afk_Utils.sortArray( this.GetStashItems(ent))
		var bpitems = Afk_Utils.sortArray(this.GetBackpackItems(ent))

		if (stashitems.length>0){
			var name = Abilities.GetAbilityName( stashitems[0] )
			if (this.hasEmptySlot(ent)){
				this.moveItemToInventory(ent, name)
			}else if (this.hasEmptyBackPackSlot(ent)){
				this.moveItemToBackPack(ent, name)
			}
		}

		if (bpitems.length>0){
			if (this.hasEmptySlot(ent)){
				var name = Abilities.GetAbilityName( bpitems[0] )
				this.moveItemToInventory(ent, name)
			}
		} 
	}
	
}

module.exports = { ItemManager }
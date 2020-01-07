




class Shop {
	
	static Item = class {
		public id:number	//Shop id
		public name:string
		public recipe:string[]
		constructor(id:number, name:string, recipe:string[]){
			this.id = id
			this.name = name
			this.recipe = recipe
		}

		Purchase(ent:Entity):boolean{
			
			//$.Msg("Item function to purchase 	"+this.id+"  "+this.name)
			if(this.id>=0){
				if(!ItemManager.IsHasThatItem(ent, this.name))
					return Orders.PurchaseItem(ent, this.id)
			}else{
				//$.Msg("Are u here?  ")
				if(!ItemManager.IsHasThatItem(ent, this.name)){
					for(var index in this.recipe){
						var itemName = this.recipe[index]
						if(!ItemManager.IsHasThatItem(ent, itemName)){
							Shop.PurchaseItemByName(ent, itemName)
							return true
						}
					}
				}
				return false
			}
			
		}
    }

	
	static itemNames = {
		
		"item_courier": new Shop.Item(45, "item_courier", {}),
		"item_ward_observer": new Shop.Item(42, "item_ward_observer", {}),

		//Components
		"item_ogre_axe": new Shop.Item(21, "item_ogre_axe", {}),
		"item_staff_of_wizardry": new Shop.Item(23, "item_staff_of_wizardry", {}),
		"item_ring_of_regen": new Shop.Item(27, "item_ring_of_regen", {}),
		"item_sobi_mask": new Shop.Item(28, "item_sobi_mask", {}),
		"item_circlet": new Shop.Item(20, "item_circlet", {}),
		"item_slippers": new Shop.Item(14, "item_slippers", {}),
		"item_recipe_wraith_band": new Shop.Item(74, "item_recipe_wraith_band", {}),
		"item_branches": new Shop.Item(16, "item_branches", {}),
		"item_recipe_vladmir": new Shop.Item(80, "item_recipe_vladmir", {}),
		"item_ring_of_protection": new Shop.Item(12, "item_ring_of_protection", {}),
		"item_lifesteal": new Shop.Item(26, "item_lifesteal", {}),
		"item_recipe_yasha": new Shop.Item(169, "item_recipe_yasha", {}),
		"item_blade_of_alacrity": new Shop.Item(22, "item_blade_of_alacrity", {}),
		"item_boots_of_elves": new Shop.Item(18, "item_boots_of_elves", {}),
		"item_recipe_headdress": new Shop.Item(93, "item_recipe_headdress", {}),
		"item_gloves": new Shop.Item(25, "item_gloves", {}), 
		"item_recipe_hand_of_midas": new Shop.Item(64, "item_recipe_hand_of_midas", {}), 	
		"item_quarterstaff": new Shop.Item(10, "item_quarterstaff", {}), 
		"item_broadsword": new Shop.Item(3, "item_broadsword", {}),  
		"item_chainmail": new Shop.Item(4, "item_chainmail", {}),   
		"item_robe": new Shop.Item(19, "item_robe", {}), 
		"item_boots": new Shop.Item(29, "item_boots", {}),
		"item_recipe_hood_of_defiance": new Shop.Item(130, "item_recipe_hood_of_defiance", {}),
		"item_ring_of_health": new Shop.Item(56, "item_ring_of_health", {}),
		"item_cloak": new Shop.Item(31, "item_cloak", {}),
		"item_recipe_basher": new Shop.Item(142, "item_recipe_basher", {}),
		"item_void_stone": new Shop.Item(57, "item_void_stone", {}), 
		"item_wind_lace": new Shop.Item(244, "item_wind_lace", {}), 

		
		//Assembled in a single item
		"item_meteor_hammer":  new Shop.Item(-1, "item_meteor_hammer", [
			"item_ogre_axe",
			"item_staff_of_wizardry",
			"item_ring_of_regen",
			"item_sobi_mask"]),

		"item_wraith_band":  new Shop.Item(-1, "item_wraith_band", [
			"item_circlet",
			"item_slippers",
			"item_recipe_wraith_band"]),

		"item_ring_of_basilius": new Shop.Item(-1, "item_wraith_band", [
			"item_sobi_mask",
			"item_ring_of_protection"]),

		"item_vladmir":  new Shop.Item(-1, "item_vladmir", [
			"item_recipe_vladmir",
			"item_ring_of_basilius",
			"item_lifesteal"]),

		"item_yasha": new Shop.Item(-1, "item_vladmir", [
			"item_blade_of_alacrity",
			"item_boots_of_elves",
			"item_recipe_yasha"]),

		"item_headdress": new Shop.Item(-1, "item_headdress", [
			"item_ring_of_regen",
			"item_branches",
			"item_recipe_headdress"]),

		"item_hand_of_midas": new Shop.Item(-1, "item_hand_of_midas", [
			"item_gloves",
			"item_recipe_hand_of_midas"]),

		"item_mask_of_madness": new Shop.Item(-1, "item_mask_of_madness", [
			"item_lifesteal",
			"item_quarterstaff"]),

		"item_blade_mail": new Shop.Item(-1, "item_blade_mail", [
			"item_broadsword",
			"item_chainmail",
			"item_robe"]),

		"item_pers": new Shop.Item(-1, "item_pers", [
			"item_void_stone",
			"item_ring_of_health"])


	
		
	}



	

	static PurchaseItemByName(ent:Entity, item_Name:string):boolean{
		//$.Msg("Purchasing -> "+item_Name)
		var item
		for(var name in this.itemNames){
			if (name == item_Name){
				item = this.itemNames[name]
			}
		}
		
		if(item === undefined){
			return false
		}
		return item.Purchase(ent)
	}
}

module.exports = {Item, Shop }
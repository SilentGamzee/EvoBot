
Fusion.AddScriptToList = (script: FusionModule): void => {
	if(script.isVisible === false) // I don't want to spam with !== undefined
		return
	
	var panel = $.CreatePanel("ToggleButton", Fusion.Panels.MainPanel.scripts, script.name)
	panel.BLoadLayoutFromString(`<root>\
	<Panel>\
		<Label text="${script.name}"/>\
	</Panel>\
</root>`, false, false)

	Utils.InstallStyle(panel, "width: 170px")
	Utils.InstallStyle(panel.Children()[0], "font-family: Radiance; font-size: 18px; padding: 10px 5px 5px 0px; padding: 5px 1px; text-shadow: 0 0 1px white; color: cyan")

	panel.SetPanelEvent("onactivate", () => {
		Utils.InstallStyle(panel.Children()[0], `text-shadow: 0 0 1${panel.checked ? "0px blue" : "px white"}; color: ${panel.checked ? "orange" : "cyan"}`)
		script.onToggle(panel)
	})
}

Fusion.Panels.MainPanel.FindChildTraverse("Reload").SetPanelEvent("onactivate", Fusion.ReloadFusion)
Fusion.Panels.MainPanel.scripts = Fusion.Panels.MainPanel.FindChildTraverse("scripts")
Utils.InstallStyle(Fusion.Panels.MainPanel, "width: 600px; position: -1px 12% 0; transition-property: position; transition-duration: .26s; transition-timing-function: ease-in-out")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptsName"), "border: 1px solid #555; background-color: gradient(radial, 50% 50%, 0% 0%, 80% 80%, from(#0000ff77 ), to( #000000ff ) ); font-size: 20px; color: #999; width: 100%; text-shadow: 0px 0px 10px 3 #000; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ReloadText"), "font-size: 20px; color: #999; width: 100%; text-shadow: 0px 0px 10px 3 #000; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptLogName"), "background-color: gradient(radial, 50% 50%, 0% 0%, 80% 80%, from(#0000ff77 ), to( #000000ff ) ); font-size: 20px; color: #999; width: 100%; text-shadow: 0px 0px 10px 3 #000; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Reload"), "background-color: gradient(radial, 50% 50%, 0% 0%, 80% 80%, from(#0000ff77 ), to( #000000ff ) ); font-size: 20px; color: #999; width: 100%; text-shadow: 0px 0px 10px 3 #000; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("scripts"), "height: 200px; width: 95%; overflow: squish scroll; flow-children: right-wrap; width: 95%; horizontal-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("QuestSlideThumb"), "vertical-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Main"), "width: 100%; flow-children: down; overflow: clip squish; padding: 0 32px 0 0")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptLog"), "width: 100%; border: 1px solid #555; overflow: squish scroll; background-color: #111111; height: 100px; flow-children: down")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Overlay"), "width: 100%; border: 1px solid #555; margin: -1px 0 0 0; flow-children: down; overflow: squish scroll; background-color: #111111")
Fusion.Panels.MainPanel.FindChildTraverse("QuestSlideThumb").SetPanelEvent("onactivate", () => {
	var panel = Fusion.Panels.MainPanel
	panel.flag = !panel.flag
	Utils.InstallStyle(panel, `position: ${panel.flag ? -1 : -568}px -96px 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)
	Utils.InstallStyle(panel.FindChildTraverse("Main"), `blur: gaussian(${panel.flag ? 0 : 3})`)
})
Utils.InstallStyle(Fusion.Panels.MainPanel, `position: -568px -96px 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)

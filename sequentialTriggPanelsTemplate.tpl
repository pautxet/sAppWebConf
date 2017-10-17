<script id="tpl-actionPartial" type="text/x-handlebars-template">
{{#actions}} 
{{#if ActionName}}
{{#is (existInMaObj ActionName) 'true'}}
<div class="SelectedActionItem" currentPanel="{{../currentPanel}}" actparam="{{ActionParam}}" oncontextmenu="OnContextMenuSelectedActionItem(this.id)" id="{{../currentPanel}}_SelectedActionItem{{ActionName}}">
    {{ActionModule}} - {{ActionName}}  {{#if ActionParam}}<span class="actionParamBadge">{{ActionParam}}</span>{{/if}}
    <div class="imgsactionselected">
        <img id="eyeicon{{#isnt VisibleFP 'true'}}disabled{{/isnt}}" src="appImages/imgtrans.png" onclick="OnActionVisibleClick(this.parentElement.parentElement.id)"/>
        <img id="{{#is DefaultEnabled 'true'}}enabled{{else}}disabled{{/is}}icon" src="appImages/imgtrans.png" onclick="OnActionEnableClick(this.parentElement.parentElement.id)"/>
    </div>
</div>       
{{else}}
<div currentPanel="{{../currentPanel}}" actparam="{{ActionParam}}" class="nonEditableActionItem">
    {{ActionModule}} - {{ActionName}} {{#if ActionParam}}<span class="actionParamBadge">{{ActionParam}}</span>{{/if}}
    <div class="imgsactionselected">
        <img id="eyeicon{{#isnt VisibleFP 'true'}}disabled{{/isnt}}" src="appImages/imgtrans.png" style="opacity:0.4;" />
        <img id="{{#is DefaultEnabled 'true'}}enabled{{else}}disabled{{/is}}icon" src="appImages/imgtrans.png" style="opacity:0.4;" />
    </div>
</div>
{{/is}}
{{/if}}
{{/actions}}
</script>

<script id="tpl-sequentialTriggPanels" type="text/x-handlebars-template" >
{{! PreSequential}}
<button id="PreSeq_btn" onclick="CollapsePanel(this.id)" class="panelBtnUnfolder"><b>PreSequential</b></button>
<div id="PreSeq" ondrop="dropAction(event, this.id)" ondragover="PanelAllowDropAction(event, this.id)" class="w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show sortable preposttrig-panel">
    {{> actionPartial actions=currentPoint.PreSecuentialActions.BlocAction currentPanel="PreSeq"}}
</div>
{{! PostSequential}}
<button id="PostSeq_btn" onclick="CollapsePanel(this.id)" class="panelBtnUnfolder"><b>PostSequential</b></button>   
<div id="PostSeq" ondrop="dropAction(event, this.id)" ondragover="PanelAllowDropAction(event, this.id)" class="w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show sortable preposttrig-panel">
    {{> actionPartial actions=currentPoint.PostSecuentialActions.BlocAction currentPanel="PostSeq"}}
</div>

{{! Triggs}}
{{#each currentPoint.ActionBinds.ActionBind}}        
{{#lt @index ../countUsedTriggs}}            
<button id="Trigg{{@index}}_btn" onclick="CollapsePanel(this.id)" oncontextmenu="OnContextMenuTrigg(this.id)" class="triggerWithContextMenu panelBtnUnfolder withOptionsMargin">
    <b id="Trigg{{@index}}_Description">{{Description}}</b> - 
    <span class="" id="Anticipation{{@index}}">{{Anticipation}}{{#is mode "Distance"}}mm{{else}}ms{{/is}}</span> from <span class="" id="reference{{@index}}">{{reference}}</span>
</button>
<div class="w3-dropdown-hover" id="Trigg{{@index}}_dropdownOptions">
    <button id="Trigg{{@index}}_option_btn" onmouseover="OnMouseOverTriggOptions(this.id)" class="panelBtnOptions">v</button>
    <div class="w3-dropdown-content triggoptions" id="Trigg{{@index}}_option_btn_content">
    </div>
</div>
<div id="Trigg{{@index}}" ondrop="dropAction(event, this.id)" ondragover="PanelAllowDropAction(event, this.id)" class="w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show sortable preposttrig-panel">
    {{> actionPartial actions=actions.BlocAction currentPanel=(concat "Trigg" @index)}}
</div>
{{/lt}}
{{/each}}
<button id="AddNewTriggBtn" onclick="AddNewTrigg()" class="panelBtnUnfolder"><b>+</b></button>
</script>
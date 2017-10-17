<script id="tpl-triggOptionsLine" type="text/x-handlebars-template" >
{{! TRIGG OPTIONS LINE}}
    
{{var "anticipation" currentTrigger.Anticipation}}
{{var "isInvisibleStart" false}}
{{var "isInvisibleEnd" false}}

{{#is mode "Distance"}}
    {{var "isInvisibleStart" (isnt reference "Start")}}
    {{var "isInvisibleEnd" isInvisibleStart}}
{{else}}
    {{#is mode "Time"}}{{var "anticipation" (500 - anticipation)}}{{/is}}
{{/is}}    
{{#with currentTrigger}} 
<div id="triggInit" class="itemtrigglimit{{#if ../isInvisibleStart}}invisible{{/if}}" style="left:0px"></div>
<div id="trigg0" class="itemtrigg" ondrag="TriggerValue(this.id);" onclick="TriggerValue(this.id);" ondblclick="SetTriggValue();" style="left:{{../anticipation}}px; z-index: 5;"></div>
<div id="triggFin" class="itemtrigglimit{{#if ../isInvisibleEnd}}invisible{{/if}}" style="left:350px; z-index: 2;"></div>
{{/with}}
</script>
<script id="tpl-triggOptionsSwitches" type="text/x-handlebars-template">
{{! TRIGG OPTIONS BUTTONS}}    
{{#with currentTrigger}}
<div class="flipswitchUnits" onclick="OnswTriggerUnitsClick()">
    <input id="swTriggerUnits" type="checkbox" name="flipswitchUnits" class="flipswitchUnits-cb" id="fs" {{#isnt mode "Time"}}checked{{/isnt}} />
    <label class="flipswitchUnits-label" for="fs">
        <div class="flipswitchUnits-inner"></div>
        <div class="flipswitchUnits-switch"></div>
    </label>
</div>
<div id="idDivSwTriggerDistMode" class="flipswitchUnitsDistanceMode" onclick="OnswTriggerDistanceModeClick()">  
    <input id="swTriggerDistMode" type="checkbox" name="flipswitchUnits" class="flipswitchUnitsDistanceMode-cb" id="fsDistMode" {{#isnt reference "Start"}}checked{{/isnt}} />
    <label class="flipswitchUnitsDistanceMode-label" for="fsDistMode">
        <div class="flipswitchUnitsDistanceMode-inner"></div>
        <div class="flipswitchUnitsDistanceMode-switch"></div>
    </label>
</div>
{{/with}}
</script>
<script id="tpl-triggOptionsPanel" type="text/x-handlebars-template">
    <div id="divtriggline" class="caixatriggline">    
        {{> triggerLinePartial currentTrigger=currentTrigger}}
    </div>
    <div id="caixatriggoptions" class="caixatriggoptions">
        {{> triggerSwitchesPartial currentTrigger=currentTrigger}}    
    </div>            
</script>
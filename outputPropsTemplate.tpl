<script id="tpl-outputsProps" type="text/x-handlebars-template">  
    {{#with button}}
    <h3 id="propTitle" class="translatable-text">IO_SIGNALS_BUTTON_PROPERTIES</h3>
    <p class="propText"><span class="translatable-text">IO_SIGNALS_LABEL</span>:&nbsp;<span class="ioBadge" id="lblProperties" onclick="lblPropertiesClick()">{{LabelText}}</span></p>
    <span class="propText"><span class="translatable-text">IO_SIGNALS_IS_SWITCH</span>:&nbsp;</span>
    <div class="onoffswitch01">        
        <input type="checkbox" name="onoffswitch01" class="onoffswitch01-checkbox" onclick="swPropertiesClick();" id="swIsSwitchBtn" {{#eq ButtonType "SwitchButton"}}checked{{/eq}} />
        <label class="onoffswitch01-label" for="swIsSwitchBtn">        
            <span class="onoffswitch01-inner"></span>
            <span class="onoffswitch01-switch"></span>
        </label>
    </div>
    <p class="propText"><span class="translatable-text">IO_SIGNALS_ASSIGNED_SIGNAL</span>:&nbsp;<span class="ioBadge">{{OutputSignal}}</span></p> 
    {{/with}}
</script>

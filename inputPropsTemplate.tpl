<script id="tpl-inputsProps" type="text/x-handlebars-template">  
    {{#with led}}    
    <h3 id="propTitle" class="translatable-text">IO_SIGNALS_LED_PROPERTIES</h3>    
    <p class="propText"><span class="translatable-text">IO_SIGNALS_LABEL</span>:&nbsp;<span class="ioBadge" id="lblProperties" onclick="lblPropertiesClick()">{{LabelText}}</span></p>
    <p><span class="translatable-text">IO_SIGNALS_COLOR_ON</span>:
    <select id="selectColorOn" onchange="SelectColorOnChange(this)" class="{{ActiveColour}}">
      <option value="Grey" class="Grey translatable-text" {{#eq ActiveColour "Grey"}}selected{{/eq}}>IO_SIGNALS_GREY</option>
      <option value="Orange" class="Orange translatable-text" {{#eq ActiveColour "Orange"}}selected{{/eq}}>IO_SIGNALS_ORANGE</option>
      <option value="Green" class="Green translatable-text" {{#eq ActiveColour "Green"}}selected{{/eq}}>IO_SIGNALS_GREEN</option>
      <option value="Red" class="Red translatable-text" {{#eq ActiveColour "Red"}}selected{{/eq}}>IO_SIGNALS_RED</option>
    </select>
    </p>
    <p><span class="translatable-text">IO_SIGNALS_COLOR_OFF</span>:
    <select id="selectColorOff" onchange="SelectColorOffChange(this)" class="{{DefaultColour}}">
      <option value="Grey" class="Grey translatable-text" {{#eq DefaultColour "Grey"}}selected{{/eq}}>IO_SIGNALS_GREY</option>
      <option value="Orange" class="Orange translatable-text" {{#eq DefaultColour "Orange"}}selected{{/eq}}>IO_SIGNALS_ORANGE</option>
      <option value="Green" class="Green translatable-text" {{#eq DefaultColour "Green"}}selected{{/eq}}>IO_SIGNALS_GREEN</option>
      <option value="Red" class="Red translatable-text" {{#eq DefaultColour "Red"}}selected{{/eq}}>IO_SIGNALS_RED</option>
    </select>    
    </p>
    <p class="propText"><span class="translatable-text">IO_SIGNALS_ASSIGNED_SIGNAL</span>:&nbsp;<span class="ioBadge">{{InputSignal}}</span></p>
    {{/with}}
</script>
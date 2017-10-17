<script id="tpl-inputsPartial" type="text/x-handlebars-template">    
{{#with led}}
    {{var "class" ""}}
    {{#neq InputSignal null}}       
        {{#neq (SignalExistsInRobot InputSignal) true}}
            {{var "class" "Red"}}
        {{/neq}}
    {{else}}
        {{var "class" "iodisabled"}}
    {{/neq}}
    <div id="input_{{../tabId}}_{{id}}" class="input {{class}}" onclick="IOClicked(this.id)" oncontextmenu="IOClicked(this.id)" ondrop="dropOnInput(event, this.id)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event, this.id)">
    {{#neq InputSignal null}}
        <div class="led {{DefaultColour}}"></div>
        <input id="tbInput_{{../tabId}}_{{id}}" onkeyup="KeyUp(this.id)" onchange="OnChangeTB(this.id)" onblur="OnBlurTB(this.id)" type="text" value="{{LabelText}}" class="tbIO tbInput" />
    {{/neq}}
    </div>
{{/with}}
</script>

<script id="tpl-outputsPartial" type="text/x-handlebars-template">
{{#with button}}
    {{var "class" ""}}
    {{#neq OutputSignal null}}       
        {{#neq (SignalExistsInRobot OutputSignal) true}}
            {{var "class" "Red"}}
        {{/neq}}
    {{else}}
        {{var "class" "iodisabled"}}
    {{/neq}}
    <div id="output_{{../tabId}}_{{id}}" class="output {{class}}" onclick="IOClicked(this.id)" oncontextmenu="IOClicked(this.id)" ondrop="dropOnOutput(event, this.id)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event, this.id)">
    {{#neq OutputSignal null}}
        <div class="botoFlexPendand"></div>        
        <input id="tbOutput_{{../tabId}}_{{id}}" onkeyup="KeyUp(this.id)" onchange="OnChangeTB(this.id)" onblur="OnBlurTB(this.id)" type="text" value="{{LabelText}}" class="tbIO" />       
    {{/neq}}
    </div>
{{/with}}
</script>

<script id="tpl-editTabDialogPartial" type="text/x-handlebars-template">
{{#with tab}}  
<div id="edit-tab-form" title="edit tab label">
  <form>
    <fieldset>
      <label for="name">Label</label>
      <input type="text" name="description" id="description" value="{{description}}" class="text ui-widget-content ui-corner-all" />
    </fieldset>
  </form>
</div>
{{/with}}
</script>

<script id="tpl-iosignals" type="text/x-handlebars-template">
    {{#data}}        
    <ul>    
    {{#each Tabs}} 
        <li class="vtab translatable-title" title="IO_SIGNALS_DOUBLE_CLICK_EDIT" id="vtab_{{id}}">
            <input id="tbtab_{{id}}" class="hiddenInput" type="text" value="{{description}}"/>
            <a class="vtablink" href="#tab_{{id}}">{{description}}</a>
        </li>
        
    {{/each}}
    </ul>
    {{#each Tabs}} 
    <div id="tab_{{id}}">
        <div id='inputsBox_{{id}}' class='ioBox inputsBox'>
            {{#each Leds}}
            {{> inputsPartial led=this tabId=../id }}
            {{/each}}
        </div>
        <div id='outputsBox_{{id}}' class='ioBox outputsBox'>
            {{#each Buttons}}
            {{> outputsPartial button=this tabId=../id }}
            {{/each}}
        </div>
    </div>
    <div id="editTabForm_{{id}}" title="edit tab label" style="display:none;">
        <form>
          <fieldset>
            <label for="name">Label</label>
            <input type="text" name="description" id="description" value="{{description}}" class="text ui-widget-content ui-corner-all" />
          </fieldset>
        </form>
    </div>
    {{/each}}    
    {{/data}}
</script>
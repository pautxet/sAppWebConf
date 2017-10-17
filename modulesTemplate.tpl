<script id="tpl-modules" type="text/x-handlebars-template">
{{#maObj}}
    <button id="{{modName}}_btn" onclick="CollapsePanel(this.id)" class="w3-btn-block w3-left-align own-blue1"><b>{{modName}}</b></button>
    <div id="{{modName}}" class="w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show">
    {{#modActions}}
        <div draggable="true" id="{{../modName}}_{{actName}}" ondragstart="DragStartAction(event, this.id)" ondragend="DragEndAction(event, this.id)" class='selecteditem' title="{{actName}}">{{actName}}</div>
    {{/modActions}}
    </div>
{{/maObj}}
</script>
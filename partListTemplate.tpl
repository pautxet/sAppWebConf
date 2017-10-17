<script id="tpl-partLib" type="text/x-handlebars-template" >
<table class="table table-hover">
    <thead class="thead-inverse">
        <tr>
            <th class='own-widthColumn'>
                <h3>IDs</h3>
            </th>
            <th class='own-widthColumn'>
                <h3 class="translatable-text">HOTEDIT_REFERENCE_NAMES</h3>
            </th>
        </tr>
    </thead>
    <tbody>
    {{#each partListData.MetaPartLib.PartList.MetaPart}}         
        <tr onclick='loadPardDataXml({{@index}});' oncontextmenu ='selectPart({{@index}});' class='partReferenceItem' id='partReference_{{@index}}' >
            <td class='own-widthColumn'>{{[@PartId]}}</td>
            <td class='own-widthColumn'>{{PartName}}</td>
        </tr>
    {{/each}}
    </tbody>
</table>
</script>
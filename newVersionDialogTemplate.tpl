<!-- this is the template for the dialog that appears when a version mismatch is detected -->
<!-- it is invoqued in the file: index_head.js -->
<script id="tpl-newVersionDialog" type="text/x-handlebars-template" >
    <div id="newVersionDialog" class="w3-modal">
        <div class="w3-modal-content w3-animate-top">
            <header class="w3-container o_blue">
                <h2 style="color:#ffffff;"><span class="translatable-text">NEW_VERSION</span></h2>
            </header>
            
            <div class="w3-container">
                <p><span class="translatable-text">NEW_VERSION</span>: <span id="newVersionSpan">{{version}}</span></p>
            </div>
            
            <footer class="w3-container w3-white">
                <button id="importFileSubmit" onclick="reloadWindow(event)" type="button" class="submitbutton"><span class="translatable-text">RELOAD</span></button>
            </footer>
        </div>
    </div>
</script>
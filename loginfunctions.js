ll={};
def_debug_flag = 0;

function OnLoadAppLogin() {
    
    var listdir = LoadXMLDoc("/fileservice/~home/manuals");
    if(!!listdir){
    var ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    var files = listdir.html.body.div.ul.li;
    if (Array.isArray(files)) {
    } else {
        var nodeConcret = [{}];
        nodeConcret[0] = JSON.parse(JSON.stringify(files));
        files = nodeConcret;
    }

    var html = "";
    for (var i = 0; i < files.length; i++) {
        if (files[i]['@title'].indexOf('.pdf') > -1) {
            var ipport = window.location.href.split("/docs")[0];
            html += "<a href='" + ipport + "/fileservice/~home/manuals/" + files[i]['@title'] + "' target='_blank'><div class='submitbutton manlink'><img id='othericon' src='appImages/imgtrans.png' class='imgsubmitbutton'>" + files[i]['@title'] + "</div></a>";
        }
    }
    document.getElementById('manualsList').innerHTML = html;
    }
    else{
        console.log("fAIL whe n loading manuals folder");
    }
    
    CheckCurrentVersion();
    ChargeLangXML();
}

function LoadLanguage(){
    return window.LoadLanguageData(st.settings.lang)
    .then(function (data) {
        ll=data;
    });
}

function LoadSettings(){
    return window.LoadSettingsData()
    .then(function (data) {
        st=data;
    });
}

function ChargeLangXML(){
   return LoadSettings()
   .then(LoadLanguage)
   .then(function (){
       putLangsInElements();
   });
}

function putLangsInElements(){
    $(".translatable-text").each(function(i, obj) {
        var key = $(this).text();
        if (key in ll) {
            $(this).text(ll[key]);
        }
    });
    
}

function SubmitButton()
{

    if((document.getElementById('tbusername').value=='abb')&&(document.getElementById('tbpassword').value=='abb'))
    {
        document.getElementById('loginbox').style.animationDuration='1.5s';
        document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
        window.setTimeout(ChargePage, 1000);

    }else{
        document.getElementById('loginbox').style.animationDuration='0.4s';
        document.getElementById('loginbox').style.animationName='loginboxanimationError';

    }

}
function ChargePage()
{
    window.location.href = "webconfigurator.html";
}
function ChargePage2()
{
    window.location.href = "commonblocksconfigurator.html";
}

function ChargePageHotEdit()
{
    window.location.href = "hotedit.html";
}

function ChargePageIOSignals()
{
    window.location.href = "iosignals.html";
}

function HelpClick()
{
    alertify.error('not available yet');
}


function OnConfigurator()
{
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePage, 1000);
}

function OnCommonBlocksConfigurator()
{
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePage2, 1000);
}

function OnReferenceHotEdit()
{
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePageHotEdit, 1000);
}

function OnIOSignals()
{
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePageIOSignals, 1000);
}

function OnUserManual()
{
    document.getElementById('loginbox').style.animationDuration='0.4s';
    document.getElementById('loginbox').style.animationName='loginboxanimationError';
    window.setTimeout(SetDefaultAnim, 500);
    alertify.error('not available yet');
}
function SetDefaultAnim()
{
    document.getElementById('loginbox').style.animationName='noAnim';
}
function OnOther()
{
    document.getElementById('loginbox').style.animationDuration='0.4s';
    document.getElementById('loginbox').style.animationName='loginboxanimationError';
    alertify.error('not available yet');
}


function OnSettings(){
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePageSettings, 1000);
}
function ChargePageSettings()
{
    window.location.href = "settings.html";
}
function OnLanguageEditor(){
    document.getElementById('loginbox').style.animationDuration='1.5s';
    document.getElementById('loginbox').style.animationName='loginboxanimationCorrect';
    window.setTimeout(ChargePageLanguageEditor, 1000);
}
function ChargePageLanguageEditor()
{
    window.location.href = "languageEditor/index.html";
}

function openManual(path){
    console.log(path);
    window.open(path);
}


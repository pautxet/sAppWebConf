var url = {
    machine: "",
    pathlocation: "",
    ip: "",
    pathToImages: "",
    pathToXML: "",
    pathToXMLCBC: ""
};
var obau = {
    value: "",
    objref: ""

};
var botoSaveConnections;
var selectedActionNames = [];
var val; //value of trigger
var ntrigs = 1;
var st;
var idCurrentPointAttr;
var idCurrentBloc; //from the treeview
var iCurrentPoint;
var iCurrentHook;
var idCurrentTrigg;
var idItem;
var idImgPoint;
var idJustCreatedBloc;
var globaliBA;
var idCurrentImage;
var idBlocDragging;
var idCurrentCanvas;
var idCurrentSelectedActionItem;
var idCurrentImageContextClick;
var idBlocOverGlobal;
var idBlocToCopyGlobal;
var listIdsBlocABlocs = [];
var listIdsBlocAPoints = [];
var newlistIdsBlocABlocs = [];
var newlistIdsBlocAPoints = [];
var listIdsBlocFromBlocLocalStorage = [];
var PinButton = true;
var idPointToCopyGlobal;
var llistaBlocsTalladors;
var llistaBlocsAmbGUI;
var scrolly;
var cImage;
var isdragging = false;
var isdraggingAction = false;
var ConEdiMode;
var InfoEdiMode;
var MenuOption;
var newConSourceId;
var newConEndId;
var initiCon;
var idCurrentTab;
var CurrentNActionParam;
var CurrentModName;
var CurrentActionName;
var CurrentActionDescription;
var rawDataFromArrayModule = [];
var arrayValue;
var arrayValue2;
var arrayModNames;
var o;
var ljur;
var l;
var translations = {};
var kindElemDragging;
var onlyonetimedragging;
var timesRechargingArrayFromRapid;
var dataaux;
var namingImgPoint = false;
var matrixActions = [];
var ConfiguratorMode;
var ListOfServices = ['Service1', 'Service2', 'Service3', 'Service4', 'Service5', 'not used'];
var idsInside = []; //array where I put all the id's (Blocs and Points), that appears in this bloc (from BlocsReferences and PointsReferences)
var mousex = new Number();
var mousey = new Number();
var cursorX;
var cursorY;
var CurrentActionPanel;
var tempAct = {
    actName: "",
    actParam: "",
    actDescr: ""
};
var tempMod = {
    modName: "",
    modActions: []
};

var maObj = [];
var idCurrentActionDragging;
var idCurrentModuleActionDragging;
var currpanel;
var multipleSelectionMode = false;
var listIdsMultipleSelection = [];
var listIdsMultipleSelectionCopied = [];
var copyingItems = false;
var x1mDiv, x2mDiv, y1mDiv, y2mDiv, x3mDiv, x4mDiv, y3mDiv, y4mDiv;
var xmlDoc;
var assemblyName;
url.ip = window.location.href.replace("http://", "");

//global objects just to prevent netbeans intellisence to warn for unknown objects across the file...
var jQuery = window.jQuery;
var alertify = window.alertify;
var jsPlumb = window.jsPlumb;
var Sortable = window.Sortable;
var context = window.context;
/*
window.onerror = function (msg, url, line, col, error) {    
    var debugMode = false;
    var dir = "http://" + window.location.href.replace("http://", "").split("/")[0] + "/rw/rapid/symbol/data/RAPID/T_ROB1/sAppData/debugMode";
    debugMode = LoadVarFromRapid(dir).getElementsByClassName('value')[0].innerHTML;
    if (debugMode == "TRUE") {
        if (col != 13) {
            var extra = !col ? '' : '\ncolumn: ' + col;
            extra += !error ? '' : '\nerror: ' + error;
            alertify.error("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
            // TODO: Report this error via ajax so you can keep track of what pages have JS issues
            var suppressErrorAlert = true;
            return suppressErrorAlert; // If you return true, then error alerts (like in older versions of Internet Explorer) will be suppressed.
        }
    }
    
};
*/

function NotAvailable() {
    alertify.error(translations.PPUP_NOT_AVAILABLE_YET);
}

function htmlInfoMenuAndMain() {
    var contingaux = "		<div class='helpmenu'><img id='infoicon' src='appImages/imgtrans.png' />";
    contingaux += "                 <div class='helpmenu-content'>";
    contingaux += "                     <div class='helpmenuitem' title='Open the User Manual'><img id='manualicon' src='appImages/imgtrans.png' onclick='NotAvailable();'/></div>";
    contingaux += " 			<div class='helpmenuitem' title='show the shortcuts'><img id='shortcuticonwhite' src='appImages/imgtrans.png' onclick='ShowShortcutBox();'/></div>";
    contingaux += "                 </div>";
    contingaux += "		</div>";
    contingaux += "             <div class='returnmenu' onclick='OnMainButtonClick();' title='return to the Main menu'>" + translations.MENU_BTN_MAIN + "</div>";
    return(contingaux);
}

function htmlSequence() {
    var conting;
    MenuOption = 'Sequence';
    conting = "";
    document.getElementById("continguthtml").innerHTML = "";
    if (PinButton) {
        conting += "<div id='caixadinstreeview' class='caixadinstreeview'>";
    } else {
        conting += "<div id='caixadinstreeview' class='caixadinstreeviewSidebarPlegada'>";
    }
    conting += "    <div class='menu1'>";
    conting += "    <nav>";
    conting += "        <ul>";
    conting += "        <li ><a onclick='InitializeActions();' class='ItemMenu'>" + translations.MENU_BTN_ACTIONS + "</a></li>";
    conting += "    	<li ><a onclick='InitializeSequence();' class='ItemMenuSelected'>" + translations.MENU_BTN_SEQUENCE + "</a></li>";
    conting += "    	<li ><a onclick='InitializeGui();' class='ItemMenu'>" + translations.MENU_BTN_GUI + "</a></li>";
    conting += htmlInfoMenuAndMain();
    conting += "    <br clear='all' />";
    conting += "        </ul>";
    conting += "        <a id='pull' href='#'><b>Menu</b></a>";
    conting += "    </nav>";
    conting += "    </div>";
    conting += "    	<p id='mostradata'></p>";
    conting += "    <!-- here the ui graphic of the state-machine flow chart -->";
    conting += "<div id='dialogBoxInfo' class='dialogBoxInfo'></div>";
    conting += "<div id='multipleSelectorDiv' class='multipleSelectorDiv' hidden onmousedown='OnMouseDownDiagram(event)' onmousemove='OnMouseMoveDiagram(event)' onmouseup='OnMouseUpDiagram(event)'></div>";
    conting += "    	<div id='diagramcontainer' class='diagramcontainer' ondrop='drop(event)' ondragover='DragNewPointToDiagramSequence(this.id)' onmousedown='OnMouseDownDiagram(event)' onmousemove='OnMouseMoveDiagram(event)' onmouseup='OnMouseUpDiagram(event)'>";
    conting += "    	</div>";
    conting += "<div class='lateraldret'>";
    conting += "     <div class='caixabotonssequence'>";
    conting += "<br>";
    conting += "    	 <div class='caixaSwitcher'>";
    conting += translations.TXT_DESCRIPTION_EDITION;
    conting += "<div class='swEdition'>";
    conting += "    <input type='checkbox' name='swEdition' class='swEdition-checkbox' onclick='OnSwEditionMode();' id='swEdition' checked>";
    conting += "    <label class='swEdition-label' for='swEdition'>";
    conting += "        <span class='swEdition-inner'></span>";
    conting += "        <span class='swEdition-switch'></span>";
    conting += "    </label>";
    conting += "</div><br>";
    conting += translations.TXT_DESCRIPTION_CONNECTION;
    conting += "<div class='swConnection'>";
    conting += "    <input type='checkbox' name='swConnection' class='swConnection-checkbox' onclick='OnSwConnectionMode();' id='swConnection' >";
    conting += "    <label class='swConnection-label' for='swConnection'>";
    conting += "        <span class='swConnection-inner'></span>";
    conting += "        <span class='swConnection-switch'></span>";
    conting += "    </label>";
    conting += "</div><br>";
    conting += translations.TXT_DESCRIPTION_INFO;
    conting += "<div class='swInfo'>";
    conting += "    <input type='checkbox' name='swInfo' class='swInfo-checkbox' onclick='InfoPointsSwMode();' id='swInfo' >";
    conting += "    <label class='swInfo-label' for='swInfo'>";
    conting += "        <span class='swInfo-inner'></span>";
    conting += "        <span class='swInfo-switch'></span>";
    conting += "    </label>";
    conting += "</div><br>";
    conting += "    	</div>";
    conting += "        <br>";
    conting += "         <div class='caixabotons'>";
    conting += "        <div id='newpoint' class='itemnew' ondragstart='dragStart(event, this.id)' ondragend='dragEndItemNew()' draggable='true' title='drag to add new point'><b>+</b></div>";
    conting += "        <div id='newbloc' class='itemnewbloc' ondragstart='dragStart(event, this.id)' ondragend='dragEndItemNew()' draggable='true' title='drag to add new bloc'><b>+</b></div>";
    conting += "        </div>";
    conting += "    </div>";
    conting += "<div id='pointpropertiesbox' class='pointpropertiesbox'>";
    conting += "</div>";
    conting += "</div>";
    conting += "</div>";
    document.getElementById("continguthtml").innerHTML = conting;
}

function htmlGUI() {
    var conting;
    MenuOption = 'GUI';
    conting = "";
    document.getElementById("continguthtml").innerHTML = "";
    if (PinButton) {
        conting += "<div id='caixadinstreeview' class='caixadinstreeview'>";
    } else {
        conting += "<div id='caixadinstreeview' class='caixadinstreeviewSidebarPlegada'>";
    }

    conting += "<div class='menu1'>";
    conting += "        <nav>";
    conting += "            <ul>";
    conting += "            <li ><a onclick='InitializeActions();' class='ItemMenu'>" + translations.MENU_BTN_ACTIONS + "</a></li>";
    conting += "            <li ><a onclick='InitializeSequence();' class='ItemMenu'>" + translations.MENU_BTN_SEQUENCE + "</a></li>";
    conting += "            <li ><a onclick='InitializeGui();' class='ItemMenuSelected'>" + translations.MENU_BTN_GUI + "</a></li>";
    conting += htmlInfoMenuAndMain();
    conting += "        <br clear='all' />";
    conting += "            </ul>";
    conting += "            <a id='pull' href='#'><b>" + translations.BTN_MENU + "</b></a>";
    conting += "        </nav>";
    conting += "        </div>";
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == "true") {
        conting += "        <div id='diagramGUIcontainer' class='caixapointstodragg'>";
        conting += "        </div>";
        conting += "         <div class='caixadimatges'>";
        conting += "            <p id='imagesPlace'></p>";
        conting += "            <p id='imagesAdderPlace'></p>";
        conting += "        </div>";
    }
    conting += "    </div>";
    document.getElementById("continguthtml").innerHTML = conting;
}

function htmlActions() {
    var conting;
    MenuOption = 'Actions';
    conting = "";
    document.getElementById("continguthtml").innerHTML = "";
    if (PinButton) {
        conting += "<div id='caixadinstreeview' class='caixadinstreeview'>";
    } else {
        conting += "<div id='caixadinstreeview' class='caixadinstreeviewSidebarPlegada'>";
    }
    conting += "    <div class='menu1'>";
    conting += "    <nav>";
    conting += "        <ul>";
    conting += "            <li ><a onclick='InitializeActions();' class='ItemMenuSelected'>" + translations.MENU_BTN_ACTIONS + "</a></li>";
    conting += "        	<li ><a onclick='InitializeSequence();' class='ItemMenu'>" + translations.MENU_BTN_SEQUENCE + "</a></li>";
    conting += "        	<li ><a onclick='InitializeGui();' class='ItemMenu'>" + translations.MENU_BTN_GUI + "</a></li>";
    conting += htmlInfoMenuAndMain();
    conting += "            <br clear='all' />";
    conting += "        </ul>";
    conting += "        <a id='pull' href='#'><b>" + translations.BTN_MENU + "</b></a>";
    conting += "    </nav>";
    conting += "    </div>";
    conting += "<div id='dialogBoxInfo' class='dialogBoxInfo' onclick='OnClickDialogBoxInfo()'></div>";
    conting += "     <div class='caixadecaixes' id='HTMLactions'></div>";
    conting += "</div>";
    document.getElementById("continguthtml").innerHTML = conting;
}
function HTMLactions() {
    $(document).ready(function (e) {
        $('#HTMLactions').load('HTMLactions.html', function () {
            PaintPointsActions();
            PaintCurrentPoint_Action();
            GetModulesAndActionsFromRapid();
            PaintModulesAndActionsAccordion();
            PaintSequentialTriggsPanels();
        });
    });
}

/*##############################################
 GLOBAL FUNCTIONS
 ##############################################*/

shortcut.add("Ctrl+E", function () {
    OnCtrlMode();
});

shortcut.add("Ctrl+1", function () {
    InitializeActions();
});

shortcut.add("Ctrl+2", function () {
    InitializeSequence();
});

shortcut.add("Ctrl+3", function () {
    InitializeGui();
});

shortcut.add("Ctrl+S", function () {
    SaveObject();
});

shortcut.add("Ctrl+Alt+Space", function () {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Sequence')) {
        onlyonetimedragging = 1;
        kindElemDragging = 'bloc';
        DragNewPointToDiagramSequence(diagramcontainer);
    }
});

shortcut.add("Ctrl+Space", function () {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Sequence')) {
        DragNewPointToDiagramSequence();
    }
});

shortcut.add("Ctrl+F+SHIFT", function () {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Actions') && (iCurrentPoint != undefined)) {
        FoldSequentialTriggsPanels();
    }
});

shortcut.add("Ctrl+C", function () {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Sequence')) {
        CopyItem();
    }
});

shortcut.add("Ctrl+V", function () {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Sequence')) {
        PasteItem();
    }
});

shortcut.add("Ctrl+Alt+A", function () {
    deleteResetSafeties();
});

/*  ################################################################
 saving files, charging and opening files funtcions
 ################################################################*/

/**
 * used to duplicate object o avoiding parse the o object every time
 */
function SaveObject() {
    var oDuplicated = JSON.parse(JSON.stringify(o));
    DeleteBlocTemplateFromAssembly();
    AllUndefinedNullToNothing();
    if (ConfiguratorMode == 'CBC') {
        o.BlocAssembly["@LastModifiedFromConf"] = "true";
    }
    window.GetCurrentStampAppVersion()
            .then(function (version) {
                o.BlocAssembly["@StampAppVersion"] = version;
                xmlDoc = json2xml(o);
                return SaveToXml((ConfiguratorMode == 'assembly') ? url.pathToXML : url.pathToXMLCBC)
            }).then(function () {
        alertify.success(translations.GENERAL_SAVING);
        window.setTimeout(RechargeAfterSaving, 3000);
        document.getElementById('disablingDiv').style.display = 'block';
        aux = "";
        aux += "<div class='w3-progress-container'>";
        aux += "  <div id='myBar' class='w3-progressbar w3-green' style='width:1%'></div>";
        aux += "</div>";
        document.getElementById('disablingDiv').innerHTML = aux;
        MoveProgressBar();
        o = oDuplicated;
    });
}

function SaveVar2Rapid(gpath, gvar) {
    var rwServiceResource = new XMLHttpRequest();
    rwServiceResource.onreadystatechange = function () {
        if (rwServiceResource.readyState == 4 && rwServiceResource.status == 200) {
            document.write(rwServiceResource.responseText);
        }
    };
    rwServiceResource.open("POST", gpath, true);
    rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    rwServiceResource.send("value=" + gvar);
    return rwServiceResource.responseXML;
}
function SaveToXml(xmlfilepath) {
    //we have a problem when working with this
    //function with jQuery. Please use the
    //AJAX implementation. refer to [AB-30]

    var xhttp;

    if (window.XMLHttpRequest) {
        // code for modern browsers 
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5 
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.open("PUT", xmlfilepath, false);  //async: false to ensure is syncronous.

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201)) {
            alertify.success("Saved successfully");
        } else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            alertify.error("Saved Failed");
            console.log("Saved KO- file: " + xmlfilepaht);
            console.log("Respose status: " + xhttp.status);
            console.log(xhttp.responseText);
        }
    };

    xhttp.send(xmlDoc);
    return xhttp.responseText;
}

function UploadXML() {
    if (document.getElementById("xmlfile_input").value != "") {
        idCurrentBloc = undefined;
        var filename = document.getElementById("xmlfile_input").value;
        var file = document.getElementById("xmlfile_input").files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onloadend = function () {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(reader.result.replace(">\\s*<", "><"), "text/xml");

            ojson = xml2json(xmlDoc, "");
            o = JSON.parse(ojson);
            CreateBlocTemplateObject();
            IfXMLIsEmptyFillIt();
            PaintBlocsTreeView();//the floating menu of the treeview
            PaintBlocsTreeView();
            ActualizeListOfServices();
            InitializeSequence();
            document.getElementById("bloc1000").innerHTML = filename;
            assemblyName = filename;
        };
    }
}

function RechargeAfterSaving() {
    document.getElementById('disablingDiv').innerHTML = "";
    document.getElementById('disablingDiv').style.display = 'none';
    o = "";
    if (ConfiguratorMode == 'assembly') {
        assemblyName = "CurrentAssembly";
        InitializeObjectOFromXML(url.pathToXML);
        PaintBlocsTreeView();//the floating menu of the treeview
        PaintBlocsTreeView();
        InitializeSequence();
        if (idCurrentBloc != undefined) {
            BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
        }

    } else if (ConfiguratorMode == 'CBC') {
        InitializeObjectOFromXML(url.pathToXMLCBC);
        PaintBlocsTreeView();

    }
    alertify.success(translations.PPUP_SAVED);
}

function SaveObjectLocally() {
    var oDuplicated = JSON.parse(JSON.stringify(o));//security copy of o
    DeleteBlocTemplateFromAssembly();
    AllUndefinedNullToNothing();
    xmlDoc = json2xml(o);
    var title = translations.PPUP_ENTER_FILENAME;

    var pAnswer = prompt(title, "filename");
    if (pAnswer != null) {
        saveTextAs(xmlDoc, pAnswer + ".xml");
    } else {
        alertify.warning(translations.PPUP_OPERATION_CANCELED);
    }
    o = oDuplicated;
}
function AllUndefinedNullToNothing() {
    //all the fields that have "undefined" or "null" value, conver to ""
    for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        if ((o.BlocAssembly.AllBlocs.Bloc[i].EnableSignal == "null") || (o.BlocAssembly.AllBlocs.Bloc[i].EnableSignal == "undefined") || (o.BlocAssembly.AllBlocs.Bloc[i].EnableSignal == null)) {
            o.BlocAssembly.AllBlocs.Bloc[i].EnableSignal = "";
        }
        if ((o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal == "null") || (o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal == "undefined") || (o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal == null)) {
            o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal = "";
        }
    }
}

function CreateBlocTemplateObject() {
    //generates a bloctemplate base, to use when duplicate when create new empty blocks
    xmlfilepath = url.pathToDefaultBlocTemplate;
    xmlDocbt = LoadXMLDoc(xmlfilepath);

    if (!xmlDocbt)
    {
        alert("\n\n\nError: funtions.js - Couldn't load: " + xmlfilepath);
        console.log("FAIL to CreateBlocTEmplateObject");
        console.log("Error: funtions.js - CreateBlocTemplateObject() - Couldn't load: " + xmlfilepath + "\n\n\n");
        return;
    }

    ojsonbt = xml2json(xmlDocbt, "");
    bt = JSON.parse(ojsonbt);

    //-- Connection
    nodeConcret = [{}]; //reset the nodeConcret[]
    if (!Array.isArray(bt.Bloc.Connections.Connection)) {
        nodeConcret[0] = bt.Bloc.Connections.Connection;
        //deletes the non array node of the object
        delete bt.Bloc.Connections.Connection;
        //puts the array node into the object
        bt.Bloc.Connections.Connection = nodeConcret;
    }
}

function AddBlocToAssembly(blocgiv) {
    //takes a bloc object given and adds it in to beginning of the assembly
    o.BlocAssembly.AllBlocs.Bloc.unshift(blocgiv);
}

function DeleteBlocTemplateFromAssembly() {
    //deletes BlocTemplate from BlocAssembly before saving to xml
    DeleteBlocWithoutRefreshing("999");
}

function InitializeObjectOFromXML(xmlfilepath) {
    var xmlDoc = LoadXMLDoc(xmlfilepath);

    if (!xmlDoc)
    {
        alert("Error: funtions.js - Coudn't load: " + xmlfilepath);
        console.log("\nError: funtions.js - InitializeObjectOFromXML - Coudn't load: " + xmlfilepath);
        return;
    }

    ojson = xml2json(xmlDoc, "");
    o = JSON.parse(ojson);
    CreateBlocTemplateObject();
    IfXMLIsEmptyFillIt();

}

function NavBar() {
    url.machine = 'simulator';
    url.ip = window.location.href.replace("http://", "");
    url.ip = url.ip.split("/")[0];
    url.pathToImages = "/fileservice/~home/StampApp/Images/ProfileImages";
    url.pathToXML = "/fileservice/~home/StampApp/BlocTemplates/CurrentAssembly.xml";
    url.pathToXMLCBC = "/fileservice/~home/StampApp/ServiceData/Common/sAppServData.xml";
}

function GetPaths() {
    return LoadSettingsData()
	.fail(function () {
		NavBar();
	})
	.then(function (data) {
		url = data.url;
		url = data.settings.url;
	});
}


function LoadLanguage() {
    return window.LoadLanguageData(st.settings.lang)
    .then(function (data) {
        translations = data;
    });
}

function LoadSettings() {
    return window.LoadSettingsData()
    .then(function (data) {
        st = data;
    });
}

function OnLoadApp() {//function that runs on load the page
    // NavBar();
    GetPaths();
    
    LoadSettings()
    .then(LoadLanguage)
    .then(function () {
        CreateBlocTemplateObject();
        InitializeObjectOFromXML(url.pathToXML);
        ConfiguratorMode = 'assembly';
        assemblyName = "CurrentAssembly";
        PaintBlocsTreeView();//the floating menu of the treeview
        PaintBlocsTreeView();
        InitializeSequence();
        document.getElementById('caixadinstreeview').style.animationName = 'inicianim2';
        document.body.style.background = '#EDEEF0';
        ShortcutBox();
        ManualsView();
        ContextMenus();
        CheckCurrentVersion();
    });
}

function OnLoadAppCBC() {//function that runs on load the page
    // NavBar();

    GetPaths();

    LoadSettings()
    .then(LoadLanguage)
    .then(function () {
        CreateBlocTemplateObject();
        InitializeObjectOFromXML(url.pathToXMLCBC);
        ConfiguratorMode = 'CBC';
        ActualizeListOfServices();
        PaintBlocsTreeView();//the floating menu of the treeview
        PaintBlocsTreeView();
        InitializeSequence();
        document.getElementById('caixadinstreeview').style.animationName = 'inicianim2';
        document.body.style.background = '#EDEEF0';
        ShortcutBox();
        ManualsView();
        ContextMenus();
        CheckCurrentVersion();
    });
}

function ManualsView() {
    var listdir = LoadXMLDoc("/fileservice/~home/manuals");

    if (!listdir)
    {
        alert("Error: funtions.js - Coudn't load: " + "/fileservice/~home/manuals");
        console.log("Error: funtions.js - ChargeLangXML() - Coudn't load: " + "/fileservice/~home/manuals");
        return;
    }

    var ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    var files = listdir.html.body.div.ul.li;
    if (!Array.isArray(files)) {
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
function setLocalStorageCopyConfig(itemtype, iditem) {
    localStorage.clear();
    //itemtype= 'point' or 'block'
    if (ConfiguratorMode == 'CBC') {
        localStorage.setItem("cbc_" + itemtype, JSON.stringify(GetBoPById(iditem)));
    } else {
        localStorage.setItem("nor_" + itemtype, JSON.stringify(GetBoPById(iditem)));
    }
    if (itemtype == "block") {
        var auxAssembly = {
            AllBlocs: {
                Bloc: []
            },
            AllPoints: {
                ProcessPoint: []
            }
        };
        var listIdBlocsInsideBlocCopiedLocalStorage = [];
        MakeListIdsBlocsToCopyLocalStorage(listIdBlocsInsideBlocCopiedLocalStorage, GetBoPById(iditem));
        for (var i = 0; i < listIdBlocsInsideBlocCopiedLocalStorage.length; i++) {
            CopyBlocToAuxAssembly(auxAssembly, listIdBlocsInsideBlocCopiedLocalStorage[i]);
        }
        for (var i = 0; i < auxAssembly.AllBlocs.Bloc.length; i++) {
            if (auxAssembly.AllBlocs.Bloc[i].PointsReferences) {
                for (j = 0; j < auxAssembly.AllBlocs.Bloc[i].PointsReferences.int.length; j++) {
                    CopyPointToAuxAssembly(auxAssembly, auxAssembly.AllBlocs.Bloc[i].PointsReferences.int[j]);
                }
            }
        }
        localStorage.setItem("auxAssembly", JSON.stringify(auxAssembly));
    }
}

var MakeListIdsBlocsToCopyLocalStorage = function myselfLocalStorage(listIdBlocsInsideBlocCopiedLocalStorage, BlocWhere) {
    listIdBlocsInsideBlocCopiedLocalStorage.push(BlocWhere["@Id"]);
    var i;
    if (BlocWhere.BlocsReferences) {
        for (i = 0; i < BlocWhere.BlocsReferences.int.length; i++) {
            BlocOfId = GetBlocById(BlocWhere.BlocsReferences.int[i]);
            myselfLocalStorage(listIdBlocsInsideBlocCopiedLocalStorage, BlocOfId);
        }
    }
}

var MakeListIdsBlocsFromAuxAssembly = function myselfAuxAssembly(BlocWhere, auxAssembly, listIdsBlocFromBlocLocalStorage) {
    listIdsBlocFromBlocLocalStorage.push(BlocWhere["@Id"]);
    var i;
    if (BlocWhere.BlocsReferences) {
        for (i = 0; i < BlocWhere.BlocsReferences.int.length; i++) {
            BlocOfId = GetBoPByIdFromAuxAssembly(BlocWhere.BlocsReferences.int[i], auxAssembly);
            myselfAuxAssembly(BlocOfId, auxAssembly, listIdsBlocFromBlocLocalStorage);
        }
    }
}

function CopyBlocToAuxAssembly(auxAssembly, idbloc) {
    auxAssembly.AllBlocs.Bloc.push(GetBoPById(idbloc));
}
function CopyPointToAuxAssembly(auxAssembly, idpoint) {
    auxAssembly.AllPoints.ProcessPoint.push(GetBoPById(idpoint));
}

function getLocalStorageCopyConfig(itemtype) {
    if (ConfiguratorMode == "CBC") {
        if (localStorage.getItem("cbc_" + itemtype)) {
            console.log(JSON.parse(localStorage.getItem("cbc_" + itemtype)));
            return(JSON.parse(localStorage.getItem("cbc_" + itemtype)));
        }
    } else {
        if (localStorage.getItem("nor_" + itemtype)) {
            console.log(JSON.parse(localStorage.getItem("nor_" + itemtype)));
            return(JSON.parse(localStorage.getItem("nor_" + itemtype)));
        }
    }
    return("nolocalstorage");
}

function ContextMenus() {
    context.init({
        fadeSpeed: 100,
        filter: function ($obj) {},
        above: 'auto',
        preventDoubleContext: true,
        compress: false
    });

    context.attach(".treeview_", [
        {header: "Actions Treeview"},
        {text: "<img id='addicon2' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Add New Block To Block", action: AddNewBlocToBloc},
        {text: "<img id='copyicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Copy Block", action: CopyBloc},
        {text: "<img id='pasteicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Paste Block", action: PasteBloc},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Block", action: DeleteItem},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename Block", action: RenameBlock}
    ]);

    context.attach(".treeview_anchorSelected", [
        {header: "Actions Treeview"},
        {text: "<img id='addicon2' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Add New Block To Block", action: AddNewBlocToBloc},
        {text: "<img id='copyicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Copy Block", action: CopyBloc},
        {text: "<img id='pasteicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Paste Block", action: PasteBloc},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Block", action: DeleteItem},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename Block", action: RenameBlock}
    ]);

    context.attach(".treeview0", [
        {header: "Actions Treeview"},
        {text: "<img id='pasteicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Paste Block to Assembly", action: PasteBlocToAssembly},
        {text: "<img id='addicon2' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Add New Block To Assembly", action: AddNewBloc}
    ]);

    context.attach(".item", [
        {header: "Actions Sequence"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename", action: RenameItem},
        {text: "<img id='copyicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Copy", action: CopyItem},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete", action: DeleteItem},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Edit Actions", action: GoToActionsOfPoint}
    ]);

    context.attach(".itempointimage", [
        {header: "Actions GUI - Points"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename", action: MouseDblClickImgPoint},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete", action: DeletePointGUICntxtMenu}
    ]);

    context.attach(".canvasimatge", [
        {header: "Actions GUI - Image"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Change Profile Name", action: FocusProfileNameTB},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Change Background Image", action: ChangeImageGUI},
        {text: "<img id='painticon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Edit Background Image", action: EditBackgroundImage},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Profile Description", action: DeleteProfileDescriptionGUI}
    ]);

    context.attach(".divimagepreview", [
        {header: "Image from robot"},
        {text: "<img id='exporticondark' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Download Image", action: DownloadImageFromRobot},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Image from Robot", action: DeleteImageFromRobot}
    ]);

    context.attach(".selectedtrigg", [
        {header: "Trigger Options"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename Trigger", action: RenameCurrentTrigg},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Current Trigger", action: DelCurrentTrigg}
    ]);

    context.attach(".selectedtriggactivat", [
        {header: "Trigger Options"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename Trigger", action: RenameCurrentTrigg},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Current Trigger", action: DelCurrentTrigg}
    ]);

    context.attach(".SelectedActionItem", [
        {header: "Action Options"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Edit Parameters", action: EditParameters},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete Action", action: DeleteSelectedActionItem}
    ]);

    context.attach(".diagramcontainer", [
        {header: "Sequence Actions"},
        {text: "<img id='addicon2' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Add Point", action: DragNewPointToDiagramSequence},
        {text: "<img id='pasteicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Paste", action: PasteItem}
    ]);

    context.attach(".withOptionsMargin", [
        {header: "Trigger Options"},
        {text: "<img id='editicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Rename trigg", action: RenameContextTrigg},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' style='width: 20px; height: 20px; display: inline; left:0px; margin-right:5px;' />Delete trigg", action: DeleteContextClickedTrigg}
    ]);
}


function UploadXMLFile() {
    var blocName = document.getElementById("textbox1").value;
    xmlDoc.getElementsByTagName('BlocName')[0].childNodes[0].nodeValue = blocName;
    var rwServiceResource = new XMLHttpRequest();
    rwServiceResource.onreadystatechange = function () {
        if (rwServiceResource.readyState == 4 && rwServiceResource.status == 200) {
            document.write(rwServiceResource.responseText);
        }
    }
    rwServiceResource.open("Put", url.pathToXML, true);
    rwServiceResource.send(xmlDoc);
}

function SaveOToXml() {
    xmlDoc = json2xml(o);
    var rwServiceResource = new XMLHttpRequest();
    rwServiceResource.onreadystatechange = function () {
        if (rwServiceResource.readyState == 4 && rwServiceResource.status == 200) {
            document.write(rwServiceResource.responseText);
        }
    }
    rwServiceResource.open("Put", url.pathToXML, true);
    rwServiceResource.send(xmlDoc);
    alertify.notify(translations.PPUP_SAVED);
}

function IfXMLIsEmptyFillIt() {
    if (o.BlocAssembly.AllBlocs) {
        if (o.BlocAssembly.AllBlocs.Bloc) {
            PutArraysInJsonObject();
            o.BlocAssembly.AllBlocs.Bloc.unshift(bt.Bloc); // = AddBlocToAssembly(bt.Bloc);
            o.BlocAssembly.AssemblyIDs.int.push(bt.Bloc["@Id"]);
            o.BlocAssembly.ChildrenBlocsIds.int.push(bt.Bloc["@Id"]);
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
                if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions) {
                    if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription) {
                        for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.length; j++) {
                            if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions) {

                            } else {
                                var auxPD = {
                                    PointGUI: []
                                };
                                o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions = JSON.parse(JSON.stringify(auxPD));
                            }
                        }
                    }
                }
            }
        } else {
            o.BlocAssembly.AllBlocs.Bloc = bt.Bloc;
            aux = {
                int: bt.Bloc["@Id"]
            };
            o.BlocAssembly.AssemblyIDs = aux;
            o.BlocAssembly.ChildrenBlocsIds = aux;
            PutArraysInJsonObject();
        }
    } else {
        aux = {
            Bloc: bt.Bloc
        };
        o.BlocAssembly.AllBlocs = aux;
        aux = {
            int: bt.Bloc["@Id"]
        };
        o.BlocAssembly.AssemblyIDs = aux;
        o.BlocAssembly.ChildrenBlocsIds = aux;
        PutArraysInJsonObject();
    }
}
/**
 * converts the non array objects from inside the jsonObject to array objects
 */
function PutArraysInJsonObject() {
    var nodeConcret = [{}];
    if (o.BlocAssembly.AllPoints) {
        if (!Array.isArray(o.BlocAssembly.AllPoints.ProcessPoint)) {
            nodeConcret[0] = o.BlocAssembly.AllPoints.ProcessPoint;
            delete o.BlocAssembly.AllPoints.ProcessPoint;
            o.BlocAssembly.AllPoints.ProcessPoint = nodeConcret;
        }
    }

    //--Bloc
    nodeConcret = [{}];
    if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc)) {
        nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc;
        delete o.BlocAssembly.AllBlocs.Bloc;
        o.BlocAssembly.AllBlocs.Bloc = nodeConcret;
    }

    //--GraphicProfileDescription
    for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        nodeConcret = [{}];
        if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription) {
                if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription)) {
                    nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription;
                    if (nodeConcret[0].pointsDescriptions == null) {
                        var pdAux = {
                            PointGUI: []//pGUIAux
                        };
                        nodeConcret[0].pointsDescriptions = pdAux;
                    }
                    delete o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription;
                    o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription = nodeConcret;
                }
                for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.length; j++) {
                    if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions) {
                        var nodeConcret2 = [{}];
                        if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI)) {
                            nodeConcret2[0] = o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI;
                            delete o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI;
                            o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI = nodeConcret2;
                        }
                    }
                }
            }
        }

        //-- Connection
        nodeConcret = [{}];
        if (o.BlocAssembly.AllBlocs.Bloc[i].Connections) {
            if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].Connections.Connection)) {
                nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc[i].Connections.Connection;
                delete o.BlocAssembly.AllBlocs.Bloc[i].Connections.Connection;
                o.BlocAssembly.AllBlocs.Bloc[i].Connections.Connection = nodeConcret;
            }
        }

        //-- BlocsReferences
        nodeConcret = [{}]; //reset the nodeConcret[]
        if (o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences.int) {
                if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences.int)) {
                    nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences.int;
                    delete o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences.int;
                    o.BlocAssembly.AllBlocs.Bloc[i].BlocsReferences.int = nodeConcret;
                }
            }
        }

        //-- PointsReferences
        //-- BlocsReferences
        nodeConcret = [{}];
        if (o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences.int) {
                if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences.int)) {
                    nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences.int;
                    delete o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences.int;
                    o.BlocAssembly.AllBlocs.Bloc[i].PointsReferences.int = nodeConcret;
                }
            }
        }

        //-- SequenceDescriptions.AllItems.ItemGUI
        nodeConcret = [{}];
        if (o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems.ItemGUI) {
                if (!Array.isArray(o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems.ItemGUI)) {
                    nodeConcret[0] = o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems.ItemGUI;
                    delete o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems.ItemGUI;
                    o.BlocAssembly.AllBlocs.Bloc[i].SequenceDescriptions.AllItems.ItemGUI = nodeConcret;
                }
            }
        }
    }

    //-- AssemblyIDs
    nodeConcret = [{}];
    if (o.BlocAssembly.AssemblyIDs) {
        if (o.BlocAssembly.AssemblyIDs.int) {
            if (!Array.isArray(o.BlocAssembly.AssemblyIDs.int)) {
                nodeConcret[0] = o.BlocAssembly.AssemblyIDs.int;
                delete o.BlocAssembly.AssemblyIDs.int;
                o.BlocAssembly.AssemblyIDs.int = nodeConcret;
            }
        }
    }
    nodeConcret = [{}];
    if (o.BlocAssembly.ChildrenBlocsIds) {
        if (o.BlocAssembly.ChildrenBlocsIds.int) {
            if (!Array.isArray(o.BlocAssembly.ChildrenBlocsIds.int)) {
                nodeConcret[0] = o.BlocAssembly.ChildrenBlocsIds.int;
                delete o.BlocAssembly.ChildrenBlocsIds.int;
                o.BlocAssembly.ChildrenBlocsIds.int = nodeConcret;
            }
        }
    }
}

function DeleteFile(filetodelete) {
    var X = !window.XMLHttpRequest ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
    X.open("DELETE", filetodelete, 0);
    X.send("");
}

function getContentFromHTMLFile(pathfilegiv) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", pathfilegiv, false);
    xhttp.send();
    alert(xhttp.responseXML);
    return xhttp.responseXML;
}

function GetModulesAndActionsFromRapid() {
    xmlMod = LoadModulesFromRapid("/rw/rapid/modules?task=T_ROB1"); /*"http://" + url.ip +*/
    modName = xmlMod.getElementsByClassName("name");
    arrayModNames = "";
    maObj = [];
    for (var i = 0; i < modName.length; i++) {//cal filtrar en funció si té actions
        thisModName = modName[i].childNodes[0].nodeValue;
        arrayModNames += thisModName + ",";
        arrayModNames = arrayModNames.split(",");
        if (thisModName.indexOf("Actions") > -1) {
            maObj.push(JSON.parse(JSON.stringify(tempMod)));
            maObj[maObj.length - 1].modName = thisModName;
        }
    }
    for (var i = 0; i < maObj.length; i++) {
        xmlMod = "";
        xmlMod = LoadModulesFromRapid("/rw/rapid/symbol/data/RAPID/T_ROB1/" + maObj[i].modName + "/" + maObj[i].modName + "Array"); /*"http://" + url.ip +*/
        varValue = xmlMod.getElementsByClassName("value");
        arrayValueAll = "";
        arrayValue = "";
        arrayValue += varValue[0].childNodes[0].nodeValue;
        arrayValue = arrayValue.split('"');
        var j = 0;
        for (var h = 0; h < arrayValue.length - 1; h = h + 6) {
            maObj[i].modActions.push(JSON.parse(JSON.stringify(tempAct)));
            maObj[i].modActions[maObj[i].modActions.length - 1].actName = arrayValue[h + 1];
            maObj[i].modActions[maObj[i].modActions.length - 1].actParam = arrayValue[h + 5];
            maObj[i].modActions[maObj[i].modActions.length - 1].actDescr = arrayValue[h + 3];
            j++;
        }
    }
}

/*  ################################################################
 operations with I, Ids
 ################################################################*/

function RandomIdNoRepeated() {
    if (ConfiguratorMode == 'assembly') {
        max = 999;
        min = 1;
    } else if (ConfiguratorMode == 'CBC') {
        max = 1999;
        min = 1001;
    }
    pointId = Math.floor(Math.random() * (max - min + 1) + min);
    pointId = pointId.toString();
    matchId = IdRepeated(pointId);
    if (matchId == "nomatch") {
        return(pointId);
    } else {
        pointId = RandomIdNoRepeated();
        return(pointId);
    }
}
function GenerateRandomId() {
    pointId = Math.random();
    pointId = pointId * 100;
    pointId = Math.round(pointId);
    pointId = pointId.toString();
    matchId = IdPointRepeated(pointId);
    if (matchId == "nomatch") {
        return(pointId);
    } else {
        return("callfunctionagain");
    }
}

/**
 * returns id of given give Point alias
 */
function GetidPointByAlias(aliasGiven) {
    var exists = true;
    alG = xmlDoc.getElementsByTagName("Alias");
    for (n = 0; n < alG.length; n++) {
        if (alG[n].childNodes[0].nodeValue == aliasGiven) {
            return(alG[n].parentNode.getAttribute("Id"));
        } else {
            exists = false;
        }
    }
    if (exists == false) {
        return("nomatch");
    }
}

function IsInListBlocsWithGUI(idgiv) {
    for (w = 0; w < llistaBlocsAmbGUI.length; w++) {
        if (idgiv == llistaBlocsAmbGUI[w]) {
            return("true");
        }
    }
    return("false");
}

function MakeListBlocsWithGUI() {
    for (r = 0; r < o.BlocAssembly.AllBlocs.Bloc.length; r++) {
        if (o.BlocAssembly.AllBlocs.Bloc[r].IsGUIBloc == "true") {
            llistaBlocsAmbGUI.push(o.BlocAssembly.AllBlocs.Bloc[r]["@Id"]);
        }
    }
}

function IdRepeated(idR) {//comparates IDs and returns 'match' or 'nomatch' if the ID already exists
    var exists;
    exists = true;
    for (n = 0; n < o.BlocAssembly.AssemblyIDs.int.length; n++) {
        if (idR == o.BlocAssembly.AssemblyIDs.int[n]) {
            return("match");
        } else {
            exists = false;
        }
    }
    if (exists == false) {
        return("nomatch");
    }
}

/**
 * comparates ID given with the existing ids and returns 'match' or 'nomatch' if the ID already exists
 * @param {type} idR
 * @returns {String}
 */
function IdPointRepeated(idR) {
    var exists;
    exists = true;
    ProcPoin = o.BlocAssembly.AllPoints.ProcessPoint;
    for (n = 0; n < ProcPoin.length; n++) {
        if ((ProcPoin[n]["@Id"] == idR) || (idR == 1) || (idR == 3) || (idR == 0)) {
            return("match");
        } else {
            exists = false;
        }
    }
    if (exists == false) {
        return("nomatch");
    }
}

/**
 * given the iCurrentPoint, goes to the 'i' corresponding to that id in the ProcessPoint array
 * @returns {Number|String}
 */
function GetIFromidCurrentPoint() {
    a = o.BlocAssembly.AllPoints.ProcessPoint;
    for (var i = 0; i < a.length; i++) {
        if (a[i]["@Id"] == idCurrentPointAttr) {
            return(i);
        }
    }
    return("no exist");
}

function GetIFromIdPoint(idgiv) {
    if (o.BlocAssembly.AllPoints) {
        a = o.BlocAssembly.AllPoints.ProcessPoint;
        for (i = 0; i < a.length; i++) {
            if (a[i]["@Id"] == idgiv) {
                return(i);
            }
        }
    }
}

function CompareProcessPointWithPointReferencesBloc(idGiv) {
    if ((idCurrentBloc != undefined) && (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences)) {
        for (n = 0; n < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.length; n++) {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int[n] == idGiv) {
                return(true);
            }
        }
        if (idGiv == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]) {
            return(true);
        }
    }
    return(false);
}

/**
 * compares the idGiven with all the id's in the document, to avoid the repeated id's in the document html
 */
function MatchIdInDocument(idGiven) {
    m = document.getElementById(idGiven);
    if (m != null) {
        return("alreadyExist");
    } else {
        return("noExist");
    }
}

function HasBrothers(idGiv) {
    blGiv = GetBlocById(idGiv);
    blParentGiv = GetBlocById(blGiv.parentID);
    if (blParentGiv.BlocsReferences) {
        if (blParentGiv.BlocsReferences.int) {
            if (blParentGiv.BlocsReferences.int.length > 1) {
                return("hasbrothers");
            }
        }
    }
    return("nobrothers");
}

function GetBlocArrayPositionById(idgiv) {
    for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] == idgiv) {
            return(i);
        }
    }
}

function GetBlocById(idGiv) {
    for (var r = 0; r < o.BlocAssembly.AllBlocs.Bloc.length; r++) {
        if (o.BlocAssembly.AllBlocs.Bloc[r]["@Id"] == idGiv) {
            return(o.BlocAssembly.AllBlocs.Bloc[r]);
        }
    }
}

function GetPointById(idGiv) {
    for (var r = 0; r < o.BlocAssembly.AllPoints.ProcessPoint.length; r++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[r]["@Id"] == idGiv) {
            return(o.BlocAssembly.AllPoints.ProcessPoint[r]);
        }
    }
}

function GetPointIById(idGiv) {
    for (var r = 0; r < o.BlocAssembly.AllPoints.ProcessPoint.length; r++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[r]["@Id"] == idGiv) {
            return(r);
        }
    }
}

function GetBoPById(idGiv) {
    var item;
    if (IsBlocOrPoint(idGiv) == "point") {
        item = GetPointById(idGiv);
    } else {
        item = GetBlocById(idGiv);
    }
    return(item);
}
function GetBoPByIdFromAuxAssembly(idGiv, auxAssembly) {
    var item;
    if (IsBlocOrPointInAuxAssembly(idGiv, auxAssembly) == "bloc") {
        for (var r = 0; r < auxAssembly.AllBlocs.Bloc.length; r++) {
            if (auxAssembly.AllBlocs.Bloc[r]["@Id"] == idGiv) {
                item = auxAssembly.AllBlocs.Bloc[r];
            }
        }
    } else {
        for (var r = 0; r < auxAssembly.AllPoints.ProcessPoint.length; r++) {
            if (auxAssembly.AllPoints.ProcessPoint[r]["@Id"] == idGiv) {
                item = auxAssembly.AllPoints.ProcessPoint[r];
            }
        }
    }
    return(item);
}


function GetIPointById(idGiv) {
    for (var r = 0; r < o.BlocAssembly.AllPoints.ProcessPoint.length; r++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[r]["@Id"] == idGiv) {
            return(r);
        }
    }
}

var MakeListIdsBlocs = function myself(BlocWhere) {
    listIdsBlocABlocs.push(BlocWhere["@Id"]);
    var i;
    if (BlocWhere.BlocsReferences) {
        for (i = 0; i < BlocWhere.BlocsReferences.int.length; i++) {
            BlocOfId = GetBlocById(BlocWhere.BlocsReferences.int[i]);
            myself(BlocOfId);
        }
    }
}

function RandomId() {
    max = 999;
    min = 1;
    randId = Math.floor(Math.random() * (max - min + 1) + min);
    randId = randId.toString();
    return(randId);
}

function CheckIfIdAlreadyExists(idCreated) {
    for (h = 0; h < o.BlocAssembly.AssemblyIDs.int.length; h++) {
        if (o.BlocAssembly.AssemblyIDs.int[h] == idCreated) {
            return(true);
        }
        if (idCreated == 0) {
            return(true);
        }
    }
    return(false);
}

function IDsTranslatorFromBlocLocalStorage(idToTranslate) {
    for (p = 0; p < listIdsBlocFromBlocLocalStorage.length; p++) {
        if (listIdsBlocFromBlocLocalStorage[p] == idToTranslate) {
            return(newlistIdsBlocABlocs[p]);
        }
    }
    for (p = 0; p < listIdsBlocAPoints.length; p++) {
        if (listIdsBlocAPoints[p] == idToTranslate) {
            return(newlistIdsBlocAPoints[p]);
        }
    }
}
function IDsTranslator(idToTranslate) {
    for (p = 0; p < listIdsBlocABlocs.length; p++) {
        if (listIdsBlocABlocs[p] == idToTranslate) {
            return(newlistIdsBlocABlocs[p]);
        }
    }
    for (p = 0; p < listIdsBlocAPoints.length; p++) {
        if (listIdsBlocAPoints[p] == idToTranslate) {
            return(newlistIdsBlocAPoints[p]);
        }
    }
}

function IsBlocOrPoint(idGiv) {
    if (idGiv == 0) {
        return("block");
    }
    for (var ibp = 0; ibp < o.BlocAssembly.AllBlocs.Bloc.length; ibp++) {
        if (o.BlocAssembly.AllBlocs.Bloc[ibp]["@Id"] == idGiv) {
            return("bloc");
        }
    }
    if (o.BlocAssembly.AllPoints.ProcessPoint[0]) {
        for (var ibp = 0; ibp < o.BlocAssembly.AllPoints.ProcessPoint.length; ibp++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[ibp]["@Id"] == idGiv) {
                return("point");
            }
        }
    }
}

function IsBlocOrPointInAuxAssembly(idGiv, auxAssembly) {
    for (var ibp = 0; ibp < auxAssembly.AllBlocs.Bloc.length; ibp++) {
        if (auxAssembly.AllBlocs.Bloc[ibp]["@Id"] == idGiv) {
            return("bloc");
        }
    }
    if (auxAssembly.AllPoints.ProcessPoint) {
        for (var ibp = 0; ibp < auxAssembly.AllPoints.ProcessPoint.length; ibp++) {
            if (auxAssembly.AllPoints.ProcessPoint[ibp]["@Id"] == idGiv) {
                return("point");
            }
        }
    }
}

function DelItemGUIById(idGiven) {//ItemGUI from SequenceDescriptions.AllItems
    for (var t = 0; t < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[t].itemId == idGiven) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.splice(t, 1);
        }
    }
}

/*  ################################################################
 global visual operations
 ################################################################*/

function ShortcutBox() {
    jsPlumb.ready(function () {
        jsPlumb.draggable("shortcutbox", {
            containment: "parent" //to contain the div into the area
        });
    });
    document.getElementById("shortcutbox").innerHTML = "";
    var tx;
    tx = "";
    tx += "<div class='Xshortcutbox' onclick='CloseShortcutBox();'><h2>X</h2></div>";
    tx += "<h2><img id='shortcuticon' src='appImages/imgtrans.png' />  " + translations.SHRT_MAIN_CONTROLS + "</h2>";
    tx += "<b>Ctrl+1</b>  " + translations.SHRT_CHANGE_TO_ACTIONS + "<br>";
    tx += "<b>Ctrl+2</b>  " + translations.SHRT_CHANGE_TO_SEQUENCE + "<br>";
    tx += "<b>Ctrl+3</b>  " + translations.SHRT_CHANGE_TO_GUI + "<br>";
    tx += "<b>Ctrl+E</b>  " + translations.SHRT_CHANGE_MODE_EDITION_CONNECTION + "<br>";
    tx += "<b>Ctrl+Alt+Space</b>  " + translations.SHRT_ADD_NEW_BLOCK + "<br>";
    tx += "<b>Ctrl+Space</b>  " + translations.SHRT_ADD_NEW_POINT + "<br>";
    tx += "<b>Ctrl+SHIFT+F</b>  " + translations.SHRT_FOLD_UNFOLD + "<br>";
    tx += "<b>Ctrl+V</b>  " + translations.SHRT_PASTE_ITEMS + "<br>";
    document.getElementById("shortcutbox").innerHTML = tx;
}

function CloseShortcutBox() {
    document.getElementById("shortcutbox").style.visibility = 'hidden';
}

function ShowShortcutBox() {
    document.getElementById('shortcutbox').style.visibility = 'visible';
}

function MoveProgressBar() {
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 25);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

/**
 * return "si" or "no" based on wether block has GUI
 * @param {type} idgiv
 * @returns {String}
 */
function ShowBlocWithGUI(idgiv) {
    idBlocMirant = idgiv;
    u = 0;
    while (idBlocMirant != o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]) {
        if ((IsInListBlocsWithGUI(idBlocMirant) == "true") && (idBlocMirant != o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"])) {
            return("no");
        }
        idBlocMirant = GetBlocById(idBlocMirant).parentID;
        u++;
    }
    return("si");
}

function Init() {// 1/2 function to get the X and Y
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousemove", canvasXY, false);
}

function CanvasXY(event) {// 2/2 function to get the X and Y
    var canvas = document.getElementById("canvas");
    x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
    y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
}

var WriteBlocTreeView = function myself(Bloc) {
    if (Bloc.BlocsReferences) {
        treeContent += "<li>";
        treeContent += "<label class='treeviewlabel' for='subsubfolder" + Bloc["@Id"] + "'></label><label class='treeviewlabel'><a id='bloc" + Bloc["@Id"] + "' class='treeview_' onclick='BlocClick(this.id);' oncontextmenu='MouseOverBlocTreeView(this.id);' >" + Bloc.BlocName + "</a></label> <input type='checkbox' checked id='subsubfolder" + Bloc["@Id"] + "' />";
    } else {
        treeContent += "<li>";
        treeContent += "<label class='treeviewlabel' for='subsubfolder" + Bloc["@Id"] + "'><a id='bloc" + Bloc["@Id"] + "' class='treeview_' onclick='BlocClick(this.id);' oncontextmenu='MouseOverBlocTreeView(this.id);' >" + Bloc.BlocName + "</a></label>";
    }
    treeContent += "<ol>";
    var i;
    if (Bloc.BlocsReferences) {
        for (i = 0; i < Bloc.BlocsReferences.int.length; i++) {
            SubBloc = GetBlocById(Bloc.BlocsReferences.int[i]);
            myself(SubBloc);
        }
    }
    treeContent += "</ol></li>";
}

function PaintBlocsTreeView() {
    var listBlocsInParentAssembly = [];
    var BlocParentAss;
    treeContent = "";
    document.getElementById("treeview0").innerHTML = "";
    treeContent += "<ol class='tree'>";
    var i;
    var m;
    //faig la llista de blocs amb parentid 0
    if (!o.BlocAssembly.AllBlocs.Bloc[1]) {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
            if ((o.BlocAssembly.AllBlocs.Bloc[i].parentID == "0") && (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] != 999)) {
                listBlocsInParentAssembly.push(o.BlocAssembly.AllBlocs.Bloc[i]["@Id"]);
            }
        }
        treeContent += "<li>";
        treeContent += "<label class='treeviewlabel' for='subsubfolderAssembly'></label><label class='treeviewlabel'><a id='bloc1000' class='treeview0' oncontextmenu='MouseOverBlocTreeView(this.id);' >" + assemblyName + "</a></label> <input type='checkbox' checked id='subsubfolderAssembly' />";
        treeContent += "<ol>";
    } else if (o.BlocAssembly.AllBlocs.Bloc[1]["@Id"] == 1000) {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
            if ((o.BlocAssembly.AllBlocs.Bloc[i].parentID == "1000") && (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] != 999) && (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] != 1000)) {
                listBlocsInParentAssembly.push(o.BlocAssembly.AllBlocs.Bloc[i]["@Id"]);
            }
        }
        treeContent += "<li>";
        treeContent += "<label class='treeviewlabel' for='subsubfolderAssembly'></label><label class='treeviewlabel'><a id='bloc1000' class='treeview0' onclick='OnClickCBC1000Block()' oncontextmenu='MouseOverBlocTreeView(this.id);' >" + o.BlocAssembly.AllBlocs.Bloc[1].BlocName + "</a></label> <input type='checkbox' checked id='subsubfolderAssembly' />";
        treeContent += "<ol>";
    } else {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
            if ((o.BlocAssembly.AllBlocs.Bloc[i].parentID == "0") && (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] != 999) && (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] != 1000)) {
                listBlocsInParentAssembly.push(o.BlocAssembly.AllBlocs.Bloc[i]["@Id"]);
            }
        }
        treeContent += "<li>";
        treeContent += "<label class='treeviewlabel' for='subsubfolderAssembly'></label><label class='treeviewlabel'><a id='bloc1000' class='treeview0' oncontextmenu='MouseOverBlocTreeView(this.id);' >" + assemblyName + "</a></label> <input type='checkbox' checked id='subsubfolderAssembly' />";
        treeContent += "<ol>";
    }

    for (m = 0; m < listBlocsInParentAssembly.length; m++) {
        BlocParentAss = GetBlocById(listBlocsInParentAssembly[m]);
        WriteBlocTreeView(BlocParentAss);
    }
    treeContent += "</ol></li>";
    treeContent += "</ol>";
    document.getElementById("treeview0").innerHTML += treeContent;
}

function NotUsedToRed() {
    for (m = 0; m < listBlocsInParentAssembly.length; m++) {
        var blocaux;
        blocaux = GetBlocById(listBlocsInParentAssembly[m]);
        if (blocaux.ExecutingSignal == "null") {
            document.getElementById("bloc" + listBlocsInParentAssembly[m]).className += " own-fontRed";
        }
    }
}

function swIsDeviceBlocClick() {
    if (document.getElementById("swIsDeviceBloc").checked == true) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc = "true";
        if (document.getElementById("dropdownBlocAuthType").value == "NA") {
            document.getElementById("txtEnableSignal").disabled = "";
            document.getElementById("txtExecutingSignal").disabled = "";
        } else {
            document.getElementById("txtEnableSignal").disabled = "false";
            document.getElementById("txtExecutingSignal").disabled = "false";
        }
        document.getElementById("dropdownBlocAuthType").disabled = "";//"" = "true"
        document.getElementById("txtEnableSignal").value = "null";
        document.getElementById("txtExecutingSignal").value = "null";
    } else if (document.getElementById("swIsDeviceBloc").checked == false) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc = "false";
        document.getElementById("txtEnableSignal").disabled = "";//"" = "true"
        document.getElementById("txtExecutingSignal").disabled = "";//"" = "true"
        document.getElementById("dropdownBlocAuthType").disabled = "false";
        document.getElementById("dropdownBlocAuthType").value = "NA";
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType = document.getElementById("dropdownBlocAuthType").value;
    }
}

function swIsCyclicClick() {
    if (document.getElementById("swIsCyclic").checked == true) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsCyclic = "true";
    } else if (document.getElementById("swIsCyclic").checked == false) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsCyclic = "false";
    }
}
function swIsGUIBlocClick() {
    if (document.getElementById("swIsGUIBloc").checked == true) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc = "true";
        if (idCurrentTab == "Gui") {
            htmlGUI();
            document.getElementById("diagramGUIcontainer").style.width = "300px";
            PaintPointsGUI();
            document.getElementById("imagesPlace").innerHTML = "";
            PaintImageAdder();
            ChargePointsOfTheImage();
        }
        alertify.success(translations.PPUP_GUI_BLOC_TRUE);
    } else if (document.getElementById("swIsGUIBloc").checked == false) {
        title = translations.PPUP_ARE_YOU_SURE;
        message = translations.PPUP_CHANGING_TO_NO_GUI_CONFIRMATION;
        var pAnswer = confirm(message);
        if (pAnswer == true) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc = "false";
            if (idCurrentTab == "Gui") {
                htmlGUI();
            }
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
                grphlength = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.length;
                o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.splice(0, grphlength);
            }
            alertify.success(translations.PPUP_PROF_DESCR_DELETED);
        } else {
            document.getElementById("swIsGUIBloc").checked = true;
            alertify.warning(translations.PPUP_OPERATION_CANCELED);
        }
    }
}

function swEnableSignalInvertedClick() {
    if (document.getElementById('txtEnableSignal').disabled != true) {
        if (document.getElementById("swEnableSignalInverted").checked == true) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted = 'true';
            document.getElementById("swEnableSignalInverted").checked = true;
        } else if (document.getElementById("swEnableSignalInverted").checked == false) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted = 'false';
            document.getElementById("swEnableSignalInverted").checked = false;
        }
    } else {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted = 'false';
        document.getElementById("swEnableSignalInverted").checked = false;
    }
}

function ClickDropDownBlocAuthType() {
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType = document.getElementById("dropdownBlocAuthType").value;
    if (document.getElementById("dropdownBlocAuthType").value == "NA") {
        document.getElementById("txtEnableSignal").disabled = "";
        document.getElementById("txtExecutingSignal").disabled = "";
    } else {
        document.getElementById("txtEnableSignal").disabled = "false";
        document.getElementById("txtExecutingSignal").disabled = "false";
        document.getElementById('swEnableSignalInverted').checked = false;
    }
    document.getElementById("txtEnableSignal").value = "null";
    document.getElementById("txtExecutingSignal").value = "null";
}

function ClickDropDownBlocAuthTypeCBC() {
    var valueaux;
    valueaux = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal.replace(/[^0-9.]/g, "");
    valueaux = "Service" + valueaux;

    oldServiceSelected = JSON.parse(JSON.stringify(valueaux));
    if (document.getElementById("dropdownBlocAuthTypeCBC").value != 'not used') {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType = "NA";
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal = objServices.getServiceBySignal(document.getElementById("dropdownBlocAuthTypeCBC").value).EnableSignal;
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal = objServices.getServiceBySignal(document.getElementById("dropdownBlocAuthTypeCBC").value).ExecutingSignal;
        ExecutingSignalChanged(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]);
        document.getElementById('txtEnableSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal;
        document.getElementById('txtExecutingSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal;
        for (var j = 0; j < ListOfServices.length; j++) {
            if (ListOfServices[j] == document.getElementById("dropdownBlocAuthTypeCBC").value) {
                ListOfServices.splice(j, 1);
                if (oldServiceSelected != "Service") {
                    ListOfServices.push(oldServiceSelected);
                }
            }
        }
    } else {
        for (var j = 0; j < ListOfServices.length; j++) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal = 'null';
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal = 'null';
            document.getElementById('txtEnableSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal;
            document.getElementById('txtExecutingSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal;
            if ((ListOfServices[j] == 'not used') || (ListOfServices[j] == 'NA')) {
                ListOfServices.splice(j, 1);
                ListOfServices.push(oldServiceSelected);
                o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal = 'null';
                o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal = 'null';
                ExecutingSignalChanged(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]);
                //o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType='not used';
                o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType = "NA";
                document.getElementById('txtEnableSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal;
                document.getElementById('txtExecutingSignal').value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal;
                return;
            }
        }
    }
}

function GetAllIdsBlocsInRoot() {
    var listIdsBlocsInRoot = [];
    for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[i].parentID == "1000") {
            listIdsBlocsInRoot.push(o.BlocAssembly.AllBlocs.Bloc["@Id"]);
        }
    }
    return(listIdsBlocsInRoot);
}
function swAuxRTAllowed() {
    if (document.getElementById("swAuxRTAllowed").checked == true) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].AuxRTAllowed = "true";
    } else if (document.getElementById("swAuxRTAllowed").checked == false) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].AuxRTAllowed = "false";
    }
}

function ExtPoseModified() {
    try {
        if (document.getElementById("ExtPoseModified").checked == true) {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ExtPoseModified = "true";
            alertify.notify(translations.MODIFIED_WITH_EXTERN_FRAME + " ON");
        } else if (document.getElementById("ExtPoseModified").checked == false) {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ExtPoseModified = "false";
            alertify.notify(translations.MODIFIED_WITH_EXTERN_FRAME + " OFF");
        } else {
            console.log("Invalid value of ExpPoseModified!");
            alertify.error(translations.MODIFIED_WITH_EXTERN_FRAME + " Error Invalid Value");
        }
    } catch (e) {
        console.log("Error in function - modifExternFrame(): " + e);
    }
}

var objServices = [];
for (var i = 0; i < 6; i++) {
    objServices.push({
        Service: "Service" + i,
        EnableSignal: "vdiServ" + i + "Auth",
        ExecutingSignal: "vdoServ" + i + "Safe"
    });
}

objServices.getServiceBySignal = function (signalGiv) {
    for (var i = 0; i < 6; i++) {
        if (objServices[i].EnableSignal == signalGiv) {
            return(objServices[i]);
        }
    }
    for (var i = 0; i < 6; i++) {
        if (objServices[i].ExecutingSignal == signalGiv) {
            return(objServices[i]);
        }
    }
    for (var i = 0; i < 6; i++) {
        if (objServices[i].Service == signalGiv) {
            return(objServices[i]);
        }
    }
    return(null);
};

function BlocClick(idBloc) {
    if (document.getElementsByClassName("treeview_anchorSelected").length > 0) {
        document.getElementsByClassName("treeview_anchorSelected")[0].className = "treeview_";
    }
    if (idBloc == 'bloc0') {
        idBloc = 'bloc' + idJustCreatedBloc;
    }
    document.getElementById(idBloc).className = "treeview_anchorSelected";
    idCurrentBloc = idBloc.replace("bloc", "");
    idCurrentBloc = GetBlocArrayPositionById(idCurrentBloc);
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int) {
            iCurrentPoint = 0;
        }
    }
    if (idCurrentBloc != undefined) {
        prop = "";
        prop += "<b>" + translations.LBL_PROPERTIES + ":</b> ";
        prop += "<div style='float: right; color: gray;'>";
        prop += translations.PROP_LBL_ID + ": " + idBloc.replace("bloc", "") + "<br>";
        prop += "</div>";
        prop += "<textarea cols='40' rows='4' id='txtDescription' class='tbpropertieslarge'>" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Description + "</textarea><br>";
        prop += translations.PROP_LBL_BLOCNAME + ": <input class='tbproperties' type='text' id='txtBlocName' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocName + "'> <br>";

        if (ConfiguratorMode != 'CBC') {
            ActualizeListOfServices();
            prop += translations.PROP_LBL_ISCYCLIC + " ";
            prop += "<div class='onoffswitch01'>";
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsCyclic == "true") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsCyclicClick();' id='swIsCyclic' checked>";
            } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsCyclic == "false") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsCyclicClick();' id='swIsCyclic'>";
            }
            prop += "    <label class='onoffswitch01-label' for='swIsCyclic'>";
            prop += "        <span class='onoffswitch01-inner'></span>";
            prop += "        <span class='onoffswitch01-switch'></span>";
            prop += "    </label>";
            prop += "</div><br>";
            prop += translations.PROP_LBL_ISGUIBLOC + " ";
            prop += "<div class='onoffswitch01'>";
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == "true") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsGUIBlocClick();' id='swIsGUIBloc' checked>";
            } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == "false") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsGUIBlocClick();' id='swIsGUIBloc'>";
            }
            prop += "    <label class='onoffswitch01-label' for='swIsGUIBloc'>";
            prop += "        <span class='onoffswitch01-inner'></span>";
            prop += "        <span class='onoffswitch01-switch'></span>";
            prop += "    </label>";
            prop += "</div><br>";
            prop += translations.PROP_LBL_ISDEVICEBLOC + " ";
            prop += "<div class='onoffswitch01'>";
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc == "true") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsDeviceBlocClick();' id='swIsDeviceBloc' checked>";
            } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc == "false") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swIsDeviceBlocClick();' id='swIsDeviceBloc'>";
            }
            prop += "    <label class='onoffswitch01-label' for='swIsDeviceBloc'>";
            prop += "        <span class='onoffswitch01-inner'></span>";
            prop += "        <span class='onoffswitch01-switch'></span>";
            prop += "    </label>";
            prop += "</div><br>";
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc == "true") {
                prop += translations.PROP_LBL_ENABLESIGNAL + ": <input disabled class='tbproperties' type='text' id='txtEnableSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal + "'>";
                prop += "Inverted ";
                prop += "<div class='onoffswitch01'>";
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "true") {
                    prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted' checked>";
                } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "false") {
                    prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted'>";
                }
                prop += "    <label class='onoffswitch01-label' for='swEnableSignalInverted'>";
                prop += "        <span class='onoffswitch01-inner'></span>";
                prop += "        <span class='onoffswitch01-switch'></span>";
                prop += "    </label>";
                prop += "</div><br>";
                prop += translations.PROP_LBL_EXECUTINGSIGNAL + ": <input disabled class='tbproperties' type='text' id='txtExecutingSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal + "'><br>";
                prop += translations.PROP_LBL_BLOCAUTHTYPE + ": ";
                prop += "<select id='dropdownBlocAuthType' onchange='ClickDropDownBlocAuthType();'>";
                prop += "  <option value='Load'>Load</option>";
                prop += "  <option value='Unload'>Unload</option>";
                prop += "  <option value='Aux'>Aux</option>";
                prop += "  <option value='NA'>NA</option>";
                prop += "</select>";
                prop += "<br>";
            } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsDeviceBloc == "false") {
                prop += translations.PROP_LBL_ENABLESIGNAL + ": <input class='tbproperties' type='text' id='txtEnableSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal + "'>";
                prop += "Inverted ";
                prop += "<div class='onoffswitch01'>";
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "true") {
                    prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted' checked>";
                } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "false") {
                    prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted'>";
                }
                prop += "    <label class='onoffswitch01-label' for='swEnableSignalInverted'>";
                prop += "        <span class='onoffswitch01-inner'></span>";
                prop += "        <span class='onoffswitch01-switch'></span>";
                prop += "    </label>";
                prop += "</div><br>";
                prop += translations.PROP_LBL_EXECUTINGSIGNAL + ": <input class='tbproperties' type='text' id='txtExecutingSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal + "'><br>";
                prop += translations.PROP_LBL_BLOCAUTHTYPE + ": ";
                prop += "<select disabled id='dropdownBlocAuthType' onchange='ClickDropDownBlocAuthType();'>";
                prop += "  <option value='Load'>Load</option>";
                prop += "  <option value='Unload'>Unload</option>";
                prop += "  <option value='Aux'>Aux</option>";
                prop += "  <option value='NA'>NA</option>";
                prop += "</select>";
                prop += "<br>";
            }
        } else if (ConfiguratorMode == 'CBC') {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].parentID == 1000) {
                prop += translations.PROP_LBL_BLOCAUTHTYPE + ": ";
                prop += "<select id='dropdownBlocAuthTypeCBC' class='dropdownstyle' onchange='ClickDropDownBlocAuthTypeCBC();'>";
                var valueaux;
                if ((o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != "null") && (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != null)) {
                    valueaux = objServices.getServiceBySignal(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal).Service;
                } else {
                    valueaux = "not used";
                }
                prop += "  <option value='" + valueaux + "'>" + valueaux + "</option>";
                for (i = 0; i < ListOfServices.length; i++) {
                    if (ListOfServices[i] != 'not used') {
                        prop += "  <option value='" + ListOfServices[i] + "'>" + ListOfServices[i] + "</option>";
                    }
                }
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != null) {
                    prop += "  <option value='not used'>not used</option>";
                }
                prop += "</select>";
                prop += "<br>";
                prop += translations.PROP_LBL_ENABLESIGNAL + ": <input disabled class='tbproperties' type='text' id='txtEnableSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal + "'><br>";
                prop += translations.PROP_LBL_EXECUTINGSIGNAL + ": <input disabled class='tbproperties' type='text' id='txtExecutingSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal + "'>";
            } else {
                prop += translations.PROP_LBL_ENABLESIGNAL + ": <input class='tbproperties' type='text' id='txtEnableSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal + "'><br>";
                prop += translations.PROP_LBL_EXECUTINGSIGNAL + ": <input class='tbproperties' type='text' id='txtExecutingSignal' onchange='ActualizeBlocProperties();' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal + "'>";
            }
            prop += "Inverted ";
            prop += "<div class='onoffswitch01'>";
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "true") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted' checked>";
            } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignalInverted == "false") {
                prop += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swEnableSignalInvertedClick();' id='swEnableSignalInverted'>";
            }
            prop += "    <label class='onoffswitch01-label' for='swEnableSignalInverted'>";
            prop += "        <span class='onoffswitch01-inner'></span>";
            prop += "        <span class='onoffswitch01-switch'></span>";
            prop += "    </label>";
            prop += "</div><br>";
        }
        document.getElementById("blocproperties").innerHTML = prop;
        if (ConfiguratorMode != 'CBC') {
            document.getElementById("dropdownBlocAuthType").value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocAuthType;
        } else if (ConfiguratorMode == 'CBC') {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].parentID == 1000) {
                var valueaux;
                if ((o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != "null") && (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != null)) {
                    valueaux = objServices.getServiceBySignal(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal).Service;
                } else {
                    valueaux = "not used";
                }
                document.getElementById("dropdownBlocAuthTypeCBC").value = valueaux;
            }
        }
    }
    if (idCurrentTab == "Gui") {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == "true") {
            htmlGUI();
            document.getElementById("diagramGUIcontainer").style.width = "300px";
            PaintPointsGUI();
            document.getElementById("imagesPlace").innerHTML = "";
            PaintImageAdder();
            ChargePointsOfTheImage();
        } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == "false") {
            InitializeSequence();
        }
    } else if (idCurrentTab == "Actions") {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
            InitializeActions();
        } else {
            alertify.warning(translations.ACTIONS_EXISTING_POINTS_INSIDE_BLOCK);
            InitializeSequence();
        }
    } else if (idCurrentTab == "Sequence") {
        if (idCurrentBloc != undefined) {
            PaintSequence();
            ShowPropertiesFromPoint('empty');
        }
    }
}

function ActualizeListOfServices() {
    for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        for (var j = 0; j < ListOfServices.length; j++) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal != null) {
                if (ListOfServices[j] != "not used") {
                    if (objServices.getServiceBySignal(ListOfServices[j]).ExecutingSignal == o.BlocAssembly.AllBlocs.Bloc[i].ExecutingSignal) {
                        ListOfServices.splice(j, 1);
                    }
                }
            }
        }
    }
}

function PinButtonTreeView() {
    if (PinButton) {
        document.getElementById("pinbuttontreeview").id = "unpinbuttontreeview";
        document.getElementById("sidebar").className = "sidebar";
        document.getElementById("caixadinstreeview").className = "caixadinstreeviewSidebarPlegada";
        PinButton = false;
    } else {
        document.getElementById("unpinbuttontreeview").id = "pinbuttontreeview";
        document.getElementById("sidebar").className = "sidebarfixed";
        document.getElementById("caixadinstreeview").className = "caixadinstreeview";
        PinButton = true;
    }
    if (idCurrentTab == "Sequence") {
        PaintSequence();
    }
    if (idCurrentTab == "Gui") {
        BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
    }

}

function MouseOverBlocTreeView(idOver) {
    idBlocOver = idOver;
}

function ActualizeBlocProperties() {        
    if ((idCurrentBloc != undefined) && (idCurrentBloc < o.BlocAssembly.AllBlocs.Bloc.length)) {           
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocName = document.getElementById("txtBlocName").value;
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].EnableSignal = document.getElementById("txtEnableSignal").value;
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal != document.getElementById("txtExecutingSignal").value) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ExecutingSignal = document.getElementById("txtExecutingSignal").value;
            ExecutingSignalChanged(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]);
        }
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Description = document.getElementById("txtDescription").value;
        for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc.length; j++) {
            if (document.getElementById("bloc" + o.BlocAssembly.AllBlocs.Bloc[j]["@Id"])) {
                document.getElementById("bloc" + o.BlocAssembly.AllBlocs.Bloc[j]["@Id"]).innerHTML = o.BlocAssembly.AllBlocs.Bloc[j].BlocName;
            }
        }
    }
}

function OnMainButtonClick() {
    title = translations.PPUP_EXIT_WITHOUT_SAVE;
    message = translations.PPUP_ARE_YOU_SURE;
    var pAnswer = confirm(title + ", " + message);
    if (pAnswer) {
        document.getElementById('caixadinstreeview').style.animationDuration = '1.5s';
        document.getElementById('sidebar').style.animationDuration = '1.5s';
        document.getElementById('caixadinstreeview').style.animationName = 'surtanim2';
        document.getElementById('sidebar').style.animationName = 'surtanim1';
        document.body.style.background = '-moz-radial-gradient(right bottom, ellipse farthest-corner, #E9F2FA 20%, #09274F 100%)';
        window.setTimeout(ChargePageMain, 1000);
    }
}

function ChargePageMain() {
    window.location.href = "index.html";
}

/*################################################################
 global bloc or point operations	
 ################################################################*/

function DeleteBloc(idToDel) {
    DeleteBlocWithoutRefreshing(idToDel);
    idCurrentBloc = undefined;
    PaintBlocsTreeView();
    InitializeSequence();
}

function DeleteBlocWithoutRefreshing(idToDel) {
    if (document.getElementsByClassName("treeview_anchorSelected").length > 0) {
        iBlocSelected = document.getElementsByClassName("treeview_anchorSelected")[0].id;
        iBlocSelected = iBlocSelected.replace("bloc", "");
    }
    if (idToDel != 999) {
        alertify.success(translations.GENERAL_DELETE_BLOCK + idToDel);
    }
    var isGuiBlockToDelete;
    var parentIdBlockToDelete;
    //AllBlocs.Bloc
    for (var t = 0; t < o.BlocAssembly.AllBlocs.Bloc.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[t]["@Id"] == idToDel) {
            if ((o.BlocAssembly.AllBlocs.Bloc[t]["@Id"] != "999") && (o.BlocAssembly.AllBlocs.Bloc[t].ExecutingSignal)) {
                if (objServices.getServiceBySignal(o.BlocAssembly.AllBlocs.Bloc[t].ExecutingSignal) != null) {
                    ListOfServices.push(objServices.getServiceBySignal(o.BlocAssembly.AllBlocs.Bloc[t].ExecutingSignal).Service);
                }
            }
            isGuiBlockToDelete = o.BlocAssembly.AllBlocs.Bloc[t].IsGUIBloc;
            parentIdBlockToDelete = o.BlocAssembly.AllBlocs.Bloc[t].parentID;
            o.BlocAssembly.AllBlocs.Bloc.splice(t, 1);
        }
    }
    //AllBlocs.Bloc.BlocsReferences.int    
    for (var t = 0; t < o.BlocAssembly.AllBlocs.Bloc.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[t].BlocsReferences) {
            for (var s = 0; s < o.BlocAssembly.AllBlocs.Bloc[t].BlocsReferences.int.length; s++) {
                if (o.BlocAssembly.AllBlocs.Bloc[t].BlocsReferences.int[s] == idToDel) {
                    o.BlocAssembly.AllBlocs.Bloc[t].BlocsReferences.int.splice(s, 1);
                }
            }
        }
    }

    //AllBlocs.Bloc.SequenceDescriptions.AllItems.ItemGUI
    for (var t = 0; t < o.BlocAssembly.AllBlocs.Bloc.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[t].SequenceDescriptions.AllItems) {
            for (var s = 0; s < o.BlocAssembly.AllBlocs.Bloc[t].SequenceDescriptions.AllItems.ItemGUI.length; s++) {
                if (o.BlocAssembly.AllBlocs.Bloc[t].SequenceDescriptions.AllItems.ItemGUI[s].itemId == idToDel) {
                    o.BlocAssembly.AllBlocs.Bloc[t].SequenceDescriptions.AllItems.ItemGUI.splice(s, 1);
                }
            }
        }
    }

    //AllBlocs.Bloc.Connections.Connection
    for (var t = 0; t < o.BlocAssembly.AllBlocs.Bloc.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[t].Connections.Connection) {
            for (var s = 0; s < o.BlocAssembly.AllBlocs.Bloc[t].Connections.Connection.length; s++) {
                if ((o.BlocAssembly.AllBlocs.Bloc[t].Connections.Connection[s].sourceId == idToDel) || (o.BlocAssembly.AllBlocs.Bloc[t].Connections.Connection[s].endId == idToDel)) {
                    o.BlocAssembly.AllBlocs.Bloc[t].Connections.Connection.splice(s, 1);
                    s--;
                }
            }
        }
    }

    //AssemblyIDs
    for (var t = 0; t < o.BlocAssembly.AssemblyIDs.int.length; t++) {
        if (o.BlocAssembly.AssemblyIDs.int[t] == idToDel) {
            o.BlocAssembly.AssemblyIDs.int.splice(t, 1);
        }
    }

    //ChildrenBlocsIds
    for (var t = 0; t < o.BlocAssembly.ChildrenBlocsIds.int.length; t++) {
        if (o.BlocAssembly.ChildrenBlocsIds.int[t] == idToDel) {
            o.BlocAssembly.ChildrenBlocsIds.int.splice(t, 1);
        }
    }

    //for each ProcessPoint that have parentID the id of the Bloc to eliminate
    var listProcessPointToDelete = [];
    if (o.BlocAssembly.AllPoints) {
        for (var s = 0; s < o.BlocAssembly.AllPoints.ProcessPoint.length; s++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[s].parentID == idToDel) {
                listProcessPointToDelete.push(o.BlocAssembly.AllPoints.ProcessPoint[s]["@Id"]);
            }
        }
    }
    for (var s = 0; s < listProcessPointToDelete.length; s++) {
        DelProcessPointById(listProcessPointToDelete[s]);
    }

    //if the block does not have gui and have parent id!=0 and the parentBloc have gui, for each processpoint, go to parentBlock GUI and delete the PointGUI
    if (((isGuiBlockToDelete == false) || (isGuiBlockToDelete == "false")) && (parentIdBlockToDelete != 0)) {
        for (var s = 0; s < listProcessPointToDelete.length; s++) {
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
                if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions) {
                    if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription) {
                        for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.length; j++) {
                            if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions) {
                                if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI) {
                                    for (var k = 0; k < o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI.length; k++) {
                                        if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI[k].pointId == listProcessPointToDelete[s]) {
                                            o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI.splice(k, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //for each Bloc that have parentID the id of the Bloc to eliminate
    var listBlocsFromABlocToDelete = [];
    for (var s = 0; s < o.BlocAssembly.AllBlocs.Bloc.length; s++) {
        if (o.BlocAssembly.AllBlocs.Bloc[s].parentID == idToDel) {
            listBlocsFromABlocToDelete.push(o.BlocAssembly.AllBlocs.Bloc[s]["@Id"]);
        }
    }
    for (var s = 0; s < listBlocsFromABlocToDelete.length; s++) {
        DeleteBloc(listBlocsFromABlocToDelete[s]);
    }
}

function FocusRenameBlock() {
    document.getElementById("txtBlocName").select();
}

function RenameBlock() {
    BlocClick(idBlocOver);
    window.setTimeout(function () {
        document.getElementById("txtBlocName").select();
    }, 500);
}

function CopyBloc() {
    idBlocToCopy = idBlocOver;
    idBlocToCopyGlobal = idBlocOver;
    setLocalStorageCopyConfig('block', idBlocOver.replace("bloc", ""));
    var bloccopiat;
    bloccopiat = GetBlocById(idBlocToCopyGlobal.replace("bloc", ""));
    alertify.notify(translations.PPUP_COPY_BLOC + " <b>" + bloccopiat.BlocName + "</b>");
}

function PasteBloc() {
    if ((getLocalStorageCopyConfig("block") != "nolocalstorage")) {
        if (getLocalStorageCopyConfig("block") != "nolocalstorage") {
            //duplicate from localstorage block
            idBlocOverGlobal = idBlocOver.replace("bloc", ""); //where inside goes the new bloc
            DuplicateBloc(getLocalStorageCopyConfig("block"), GetBoPById(idBlocOverGlobal));
        } else {
            idBlocToCopyGlobal = idBlocToCopy.replace("bloc", "");
            idBlocOverGlobal = idBlocOver.replace("bloc", ""); //where inside goes the new bloc
            DuplicateBloc(GetBoPById(idBlocToCopyGlobal), GetBoPById(idBlocOverGlobal));
        }
        alertify.notify(translations.PPUP_PASTE_BLOC);
        PaintBlocsTreeView();
        if (idCurrentTab == "Sequence") {
            PaintSequence();
        } else if (idCurrentTab == "Gui") {
            PaintPointsGUI();
        }
        idCurrentBloc = idBlocOverGlobal;
        BlocClick("bloc" + idBlocOverGlobal);
    } else {
        alertify.warning(translations.GENERAL_NO_BLOCK_COPIED);
    }
}

function AddNewBlocToBloc() {
    idBlocToCopyGlobal = 999;
    idBlocOverGlobal = idBlocOver.replace("bloc", ""); //where inside goes the new bloc
    DuplicateBlocNoLocalStorage(GetBoPById(idBlocToCopyGlobal), GetBoPById(idBlocOverGlobal));
    alertify.notify(translations.PPUP_PASTE_BLOC);
    PaintBlocsTreeView();
    if (idCurrentTab == "Sequence") {
        PaintSequence();
    } else if (idCurrentTab == "Gui") {
        PaintPointsGUI();
    }
    idCurrentBloc = idBlocOverGlobal;
    BlocClick("bloc" + idBlocOverGlobal);

    if (document.getElementById('txtBlocName')) {
        document.getElementById('txtBlocName').select();
    }
    if (ConfiguratorMode == 'CBC') {
        justcreatedbloc = GetBlocById(idJustCreatedBloc);
        justcreatedbloc.BlocAuthType = 'NA';
        justcreatedbloc.EnableSignal = '';
        justcreatedbloc.ExecutingSignal = '';
    }
}

function PasteBlocToAssembly() {
    if ((localStorage.getItem("cbc_block") && (ConfiguratorMode == "CBC")) || (localStorage.getItem("nor_block") && (ConfiguratorMode != "CBC"))) {
        if (ConfiguratorMode != 'CBC') {
            idBlocOverGlobal = 0; //assembly
        } else if (ConfiguratorMode == 'CBC') {
            idBlocOverGlobal = 1000;
        }
        DuplicateBloc(getLocalStorageCopyConfig("block"), GetBoPById(idBlocOverGlobal));
        alertify.notify(translations.PPUP_PASTE_BLOC);
        PaintBlocsTreeView();
        if (idCurrentTab == "Sequence") {
            PaintSequence();
        } else if (idCurrentTab == "Gui") {
            PaintPointsGUI();
        }
        idCurrentBloc = idBlocOverGlobal;
        ActualizeListOfServices();
        BlocClick("bloc" + idBlocOverGlobal);

        if (document.getElementById('txtBlocName')) {
            document.getElementById('txtBlocName').select();
        }
    } else {
        alertify.warning(translations.GENERAL_NO_BLOCK_COPIED);
    }
}

function AddNewBloc() {
    var bloc0 = {
        "@Id": "0"
    };
    if (o.BlocAssembly.AllBlocs.Bloc[1]) {
        if (o.BlocAssembly.AllBlocs.Bloc[1]["@Id"] == 1000) {
            DuplicateBlocNoLocalStorage(GetBoPById(999), GetBoPById(1000));
        } else {
            DuplicateBlocNoLocalStorage(GetBoPById(999), bloc0);
        }
    } else {
        DuplicateBlocNoLocalStorage(GetBoPById(999), bloc0);
    }
    alertify.success(translations.PPUP_NEW_BLOC_CREATED);
    PaintBlocsTreeView();
    idCurrentBloc = idJustCreatedBloc;
    BlocClick("bloc" + idJustCreatedBloc);
    if (document.getElementById('txtBlocName')) {
        document.getElementById('txtBlocName').select();
    }

}

function DuplicateBloc(blocToCopy, blocOver) {
    var iBlocParent; //posició i del bloc over, on ho estic copiant, el parent
    listIdsBlocABlocs = []; //resets...
    listIdsBlocAPoints = [];
    newlistIdsBlocABlocs = [];
    newlistIdsBlocAPoints = [];
    var listNewIdsBlocsCreated;
    listNewIdsBlocsCreated = [];
    var idBlocToCopy = blocToCopy["@Id"];
    if (blocOver == undefined) {
        var idBlocOver = 0;
    } else {
        var idBlocOver = blocOver["@Id"];
    }
    listIdsBlocFromBlocLocalStorage = [];
    var iBlocCreatedRoot;
    var auxAssembly = JSON.parse(localStorage.getItem("auxAssembly"));
    prevNum = o.BlocAssembly.AllBlocs.Bloc.length;
    for (var i = 0; i < prevNum; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] == idBlocOver) {
            iBlocParent = i;
        }
    }
    MakeListIdsBlocsFromAuxAssembly(blocToCopy, auxAssembly, listIdsBlocFromBlocLocalStorage);
    //make the list of id's of the BlocA PointsReferences Id
    for (var i = 0; i < listIdsBlocFromBlocLocalStorage.length; i++) {
        BlocOfId = GetBoPByIdFromAuxAssembly(listIdsBlocFromBlocLocalStorage[i], auxAssembly);
        if (BlocOfId.PointsReferences) {
            for (var j = 0; j < BlocOfId.PointsReferences.int.length; j++) {
                listIdsBlocAPoints.push(BlocOfId.PointsReferences.int[j]);
            }
        }
    }
    for (var i = 0; i < listIdsBlocFromBlocLocalStorage.length; i++) {
        newId = RandomIdNoRepeated();
        newlistIdsBlocABlocs.push(newId);
        o.BlocAssembly.AssemblyIDs.int.push(newId);
        newIdBloc = JSON.parse(JSON.stringify(newId));
    }
    //now needs to generate the new id s for Points of the BlocA'
    for (var i = 0; i < listIdsBlocAPoints.length; i++) {
        newId = RandomIdNoRepeated();
        newlistIdsBlocAPoints.push(newId);
        o.BlocAssembly.AssemblyIDs.int.push(newId);
    }
    for (var w = 0; w < newlistIdsBlocABlocs.length; w++) {
        newbloctocreate = GetBoPByIdFromAuxAssembly(listIdsBlocFromBlocLocalStorage[w], auxAssembly);
        var nouBloc = JSON.parse(JSON.stringify(newbloctocreate));
        o.BlocAssembly.AllBlocs.Bloc.push(nouBloc);
        iBlocCreated = o.BlocAssembly.AllBlocs.Bloc.length - 1;
        if (w == 0) {
            iBlocCreatedRoot = JSON.parse(JSON.stringify(iBlocCreated));
        }
        listNewIdsBlocsCreated.push(iBlocCreated);//listNewIsBlocsCreated

        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] == idBlocToCopy) {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID = idBlocOver;
            if (idBlocOver == 0) {
                o.BlocAssembly.ChildrenBlocsIds.int.push(IDsTranslatorFromBlocLocalStorage(idBlocToCopy));
            }
        } else {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID);
        }
        if (ConfiguratorMode == "CBC") {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].IsGUIBloc = "false";
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocAuthType = "NA";
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].IsDeviceBloc = "false";
            //això és temporalment, per tenir el nom posat la id per fer proves
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName = o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName + "_" + newId;
        }

        //translate @Id of the bloc
        o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"]);
        idJustCreatedBloc = JSON.parse(JSON.stringify(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"]));

        //translate the PointGUI id s from ProfilesDescriptions
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions) {
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription.length > 0) {
                for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI.length; j++) {
                    translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI[j].pointId);
                    o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI[j].pointId = translatedId;
                }
            }
        }

        //translate the itemId id s from SequenceDescriptions.AllItems
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems) {
            for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI.length; j++) {
                translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI[j].itemId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI[j].itemId = translatedId;
            }
        }

        //translate Connections
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections) {
            for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection.length; j++) {
                translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].sourceId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].sourceId = translatedId;
                translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].endId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].endId = translatedId;
            }
        }

        //translate BlocsReferences
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences) {
            for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int.length; j++) {
                translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int[j]);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int[j] = translatedId;
            }
        }

        //translate PointsReferences
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences) {
            for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int.length; j++) {
                translatedId = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int[j]);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int[j] = translatedId;
            }
        }
    }

    //comprova si el nom existeix ja en un altre bloc del mateix nivell dins del parent
    if (BlocNameRepetitMateixNivellDinsParent(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]) == true) {
        o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName = o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName.split("_")[0] + '_' + o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"];
    }

    for (var w = 0; w < listNewIdsBlocsCreated.length; w++) {
        iBlocCreatedTemp = listNewIdsBlocsCreated[w];
        if ((idBlocOver != 0) && (w == 0))  //only for the 0 w, is the just child node of the parent
        {
            //in the parent bloc, needs to add the blocreference to the new bloc created
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences) {
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences.int.push(IDsTranslatorFromBlocLocalStorage(idBlocToCopy));
            } else {
                br = {
                    int: [IDsTranslatorFromBlocLocalStorage(idBlocToCopy)]
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences = br;
            }
            //needs to put the duplicated bloc into the parent bloc sequence gui
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems) {
                newitgui = {
                    itemId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedTemp]["@Id"],
                    x_location: "100",
                    y_location: "100"
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems.ItemGUI.push(newitgui);
            } else {
                newitgui = {
                    itemId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedTemp]["@Id"],
                    x_location: "100",
                    y_location: "100"
                };
                arrayBlocReferences = {
                    ItemGUI: [newitgui]
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems = arrayBlocReferences;
            }
        }
    }

    // for each newlistIdsBlocAPoints, needs to create the corresponend ProcessPoint
    for (var j = 0; j < listIdsBlocAPoints.length; j++) {
        for (var u = 0; u < auxAssembly.AllPoints.ProcessPoint.length; u++) {
            if (auxAssembly.AllPoints.ProcessPoint[u]["@Id"] == listIdsBlocAPoints[j]) {
                iProcPoint = u;
            }
        }
        var nouProcPoint = JSON.parse(JSON.stringify(auxAssembly.AllPoints.ProcessPoint[iProcPoint]));
        for (var q = 0; q < nouProcPoint.ActionBinds.ActionBind.length; q++) {
            if (nouProcPoint.ActionBinds.ActionBind[q].actions) {
                for (var w = 0; w < nouProcPoint.ActionBinds.ActionBind[q].actions.BlocAction.length; w++) {
                    if (nouProcPoint.ActionBinds.ActionBind[q].actions.BlocAction[w].ActionName == "SetPosNumId") {
                        nouProcPoint.ActionBinds.ActionBind[q].actions.BlocAction[w].ActionParam = IDsTranslatorFromBlocLocalStorage(nouProcPoint["@Id"]);
                    }
                }
            }
        }
        o.BlocAssembly.AllPoints.ProcessPoint.push(nouProcPoint);

        //change the parentID of the processpoint
        numProcPoints = o.BlocAssembly.AllPoints.ProcessPoint.length;
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] == idBlocToCopy) {
            o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID = o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"];
        } else {
            o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID);
        }
        o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1]["@Id"] = IDsTranslatorFromBlocLocalStorage(o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1]["@Id"]);

    }
    if (ConfiguratorMode == 'CBC') {
        if (idBlocOver == 1000) {
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.length; i++) {
                if ((o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection[i].sourceId == 1001) && (o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection[i].endId == 1000)) {
                    o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.splice(i, 1);
                }
            }
            conaux1 = {
                sourceId: 1001,
                endId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot]["@Id"],
                Condition: 'TRUE'
            };
            conaux2 = {
                sourceId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot]["@Id"],
                endId: 1000,
                Condition: 'TRUE'
            };
            o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.push(conaux1);
            o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.push(conaux2);

            //now position on the sequence description;  first position the pHome point
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].x_location = '0';
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].y_location = '0';
            if (document.getElementById('diagramcontainer')) {
                xinitial = ((document.getElementById('diagramcontainer').clientWidth - 100) / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length - 1)) - document.getElementById('diagramcontainer').clientWidth / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length * 2);
                espaiperbloc = (document.getElementById('diagramcontainer').clientWidth - 100) / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length);
            } else {
                xinitial = 50;
                espaiperbloc = 50;
            }
            xleftest = 0 - (xinitial * (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length - 1));
            xbloci = xleftest - 25;
            yinitial = 150;
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length; i++) {
                if (IsBlocOrPoint(o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].itemId) == 'bloc') {
                    xbloci = xbloci + espaiperbloc;
                    xbloci = Math.round(xbloci);
                    yinitial = Math.round(yinitial);
                    o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].x_location = xbloci;
                    if (o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length < 5) {
                        o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].y_location = yinitial;
                        yinitial = yinitial - 45;
                    } else {
                        o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].y_location = yinitial;
                        yinitial = yinitial + 20;
                    }
                }
            }

            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].x_location = '0';
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].y_location = -35 * (o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length - 1);
        }
        //deleting enable and executing signal in the block, and deleting the actions associed
        if ((o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot].parentID == 1000) || (o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot].parentID == "1000")) {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot].ExecutingSignal = "null";
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot].EnableSignal = "null";
            ExecutingSignalChanged(o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedRoot]);
        }

    }
}

function DuplicateBlocNoLocalStorage(blocToCopy, blocOver) {
    var iBlocParent; //posició i del bloc over, on ho estic copiant, el parent
    listIdsBlocABlocs = []; //resets...
    listIdsBlocAPoints = [];
    newlistIdsBlocABlocs = [];
    newlistIdsBlocAPoints = [];
    var listNewIdsBlocsCreated;
    listNewIdsBlocsCreated = [];
    var idBlocToCopy = blocToCopy["@Id"];
    var idBlocOver = blocOver["@Id"];

    //get the bloc with idBlocToCopy
    prevNum = o.BlocAssembly.AllBlocs.Bloc.length;
    for (i = 0; i < prevNum; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] == idBlocOver) {
            iBlocParent = i;
        }
    }
    MakeListIdsBlocs(blocToCopy);

    //make the list of id's of the BlocA PointsReferences Id
    for (i = 0; i < listIdsBlocABlocs.length; i++) {
        BlocOfId = GetBlocById(listIdsBlocABlocs[i]);
        if (BlocOfId.PointsReferences) {
            for (j = 0; j < BlocOfId.PointsReferences.int.length; j++) {
                listIdsBlocAPoints.push(BlocOfId.PointsReferences.int[j]);
            }
        }
    }
    for (i = 0; i < listIdsBlocABlocs.length; i++) {
        newId = RandomIdNoRepeated();
        newlistIdsBlocABlocs.push(newId);
        o.BlocAssembly.AssemblyIDs.int.push(newId);
        newIdBloc = JSON.parse(JSON.stringify(newId));
    }
    //now needs to generate the new id s for Points of the BlocA'
    for (i = 0; i < listIdsBlocAPoints.length; i++) {
        newId = RandomIdNoRepeated();
        newlistIdsBlocAPoints.push(newId);
        o.BlocAssembly.AssemblyIDs.int.push(newId);
    }
    //adds the newblocid to the childrenblocsids assembly
    if (idBlocOver == 0) {
        o.BlocAssembly.ChildrenBlocsIds.int.push(newIdBloc);
    }

    for (w = 0; w < newlistIdsBlocABlocs.length; w++) {
        newbloctocreate = GetBlocById(listIdsBlocABlocs[w]);
        var nouBloc = JSON.parse(JSON.stringify(newbloctocreate));
        o.BlocAssembly.AllBlocs.Bloc.push(nouBloc);

        //translate the ids of the new bloc
        iBlocCreated = o.BlocAssembly.AllBlocs.Bloc.length - 1;
        listNewIdsBlocsCreated.push(iBlocCreated);

        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] == idBlocToCopy) {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID = idBlocOver;
        } else {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].parentID);
        }
        if (ConfiguratorMode == "CBC") {
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].IsGUIBloc = "false";
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocAuthType = "NA";
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].IsDeviceBloc = "false";
            //això és temporalment, per tenir el nom posat la id per fer proves
            o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName = newId;
        }

        //translate @Id of the bloc
        o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"]);
        idJustCreatedBloc = JSON.parse(JSON.stringify(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"]));
        //translate the PointGUI id s from ProfilesDescriptions
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions) {
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription.length > 0) {
                for (j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI.length; j++) {
                    translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI[j].pointId);
                    o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].ProfilesDescriptions.GraphicProfileDescription[0].pointsDescriptions.PointGUI[j].pointId = translatedId;
                }
            }
        }

        //translate the itemId id s from SequenceDescriptions.AllItems
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems) {
            for (j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI.length; j++) {
                translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI[j].itemId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].SequenceDescriptions.AllItems.ItemGUI[j].itemId = translatedId;
            }
        }

        //translate Connections
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections) {
            for (j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection.length; j++) {
                translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].sourceId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].sourceId = translatedId;
                translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].endId);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].Connections.Connection[j].endId = translatedId;
            }
        }

        //translate BlocsReferences
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences) {
            for (j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int.length; j++) {
                translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int[j]);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocsReferences.int[j] = translatedId;
            }
        }

        //translate PointsReferences
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences) {
            for (j = 0; j < o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int.length; j++) {
                translatedId = IDsTranslator(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int[j]);
                o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].PointsReferences.int[j] = translatedId;
            }
        }
    }

    if (BlocNameRepetitMateixNivellDinsParent(o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]) == true) {
        o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName = o.BlocAssembly.AllBlocs.Bloc[iBlocCreated].BlocName.split("_")[0] + '_' + o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"];
    }

    for (w = 0; w < listNewIdsBlocsCreated.length; w++) {
        iBlocCreatedTemp = listNewIdsBlocsCreated[w];
        if ((idBlocOver != 0) && (w == 0))  //only for the 0 w, is the just child node of the parent
        {
            //now, in the parent bloc, needs to add the blocreference to the new bloc created
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences) {
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences.int.push(IDsTranslator(idBlocToCopy));
            } else {
                br = {
                    int: [IDsTranslator(idBlocToCopy)]
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].BlocsReferences = br;
            }
            if (o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems) {
                newitgui = {
                    itemId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedTemp]["@Id"],
                    x_location: "100",
                    y_location: "100"
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems.ItemGUI.push(newitgui);
            } else {
                newitgui = {
                    itemId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreatedTemp]["@Id"],
                    x_location: "100",
                    y_location: "100"
                };
                arrayBlocReferences = {
                    ItemGUI: [newitgui]
                };
                o.BlocAssembly.AllBlocs.Bloc[iBlocParent].SequenceDescriptions.AllItems = arrayBlocReferences;
            }
        }
    }

    for (j = 0; j < listIdsBlocAPoints.length; j++) {
        for (u = 0; u < o.BlocAssembly.AllPoints.ProcessPoint.length; u++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[u]["@Id"] == listIdsBlocAPoints[j]) {
                iProcPoint = u;
            }
        }
        var nouProcPoint = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iProcPoint]));
        o.BlocAssembly.AllPoints.ProcessPoint.push(nouProcPoint);
        numProcPoints = o.BlocAssembly.AllPoints.ProcessPoint.length;//la id nova del bloc nou?
        if (o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"] == idBlocToCopy) {
            o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID = o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"];
        } else {
            o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID = IDsTranslator(o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1].parentID);
        }
        o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1]["@Id"] = IDsTranslator(o.BlocAssembly.AllPoints.ProcessPoint[numProcPoints - 1]["@Id"]);

    }
    if (ConfiguratorMode == 'CBC') {
        if (idBlocOver == 1000) {
            for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.length; i++) {
                if ((o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection[i].sourceId == 1001) && (o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection[i].endId == 1000)) {
                    o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.splice(i, 1);
                }
            }
            conaux1 = {
                sourceId: 1001,
                endId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"],
                Condition: 'TRUE'
            };
            conaux2 = {
                sourceId: o.BlocAssembly.AllBlocs.Bloc[iBlocCreated]["@Id"],
                endId: 1000,
                Condition: 'TRUE'
            };
            o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.push(conaux1);
            o.BlocAssembly.AllBlocs.Bloc[1].Connections.Connection.push(conaux2);
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].x_location = '0';
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].y_location = '0';
            if (document.getElementById('diagramcontainer')) {
                xinitial = ((document.getElementById('diagramcontainer').clientWidth - 100) / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length - 1)) - document.getElementById('diagramcontainer').clientWidth / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length * 2);
                espaiperbloc = (document.getElementById('diagramcontainer').clientWidth - 100) / (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length);
            } else {
                xinitial = 50;
                espaiperbloc = 50;
            }
            xleftest = 0 - (xinitial * (o.BlocAssembly.AllBlocs.Bloc[1].BlocsReferences.int.length - 1));
            xbloci = xleftest - 25;
            yinitial = 150;
            for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length; i++) {
                if (IsBlocOrPoint(o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].itemId) == 'bloc') {
                    xbloci = xbloci + espaiperbloc;
                    xbloci = Math.round(xbloci);
                    yinitial = Math.round(yinitial);
                    o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].x_location = xbloci;
                    if (o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length < 5) {
                        o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].y_location = yinitial;
                        yinitial = yinitial - 45;
                    } else {
                        o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[i].y_location = yinitial;
                        yinitial = yinitial + 20;
                    }
                }
            }
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].x_location = '0';
            o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI[0].y_location = -35 * (o.BlocAssembly.AllBlocs.Bloc[1].SequenceDescriptions.AllItems.ItemGUI.length - 1);
        }
    }
}

function BlocNameRepetitMateixNivellDinsParent(blocgiv) {
    var nomdelbloc;
    var nomdelbloctemp;
    numrepeticions = 0;
    nomdelbloc = blocgiv.BlocName;
    if (blocgiv.parentID != 0) {
        parentbloc = GetBlocById(blocgiv.parentID);
        if (parentbloc.BlocsReferences) {
            if (parentbloc.BlocsReferences.int) {
                for (j = 0; j < parentbloc.BlocsReferences.int.length; j++) {
                    nomdelbloctemp = GetBlocById(parentbloc.BlocsReferences.int[j]).BlocName;
                    if (nomdelbloc == nomdelbloctemp) {
                        numrepeticions++;
                    }
                }
                if (numrepeticions > 0) {
                    return(true);
                } else {
                    return(false);
                }
            }
        }
        return(false);
    } else if (blocgiv.parentID == 0) {
        for (j = 0; j < o.BlocAssembly.ChildrenBlocsIds.int.length; j++) {
            nomdelbloctemp = GetBlocById(o.BlocAssembly.ChildrenBlocsIds.int[j]).BlocName;
            if (nomdelbloc == nomdelbloctemp) {
                numrepeticions++;
            }
        }
        if (numrepeticions > 0) {
            return(true);
        } else {
            return(false);
        }
    }
}

function AddPointToProcessPoint(idGiv, pointName) {//to add the new point to the xml file
    idNova = idGiv;
    blo = [5];
    for (i = 0; i < 5; i++) {
        blo[i] = {
            "@xsi:nil": "true",
        };
    }
    actbin = [8];
    for (i = 0; i < 8; i++) {
        actbin[i] = {
            "@xsi:nil": "true",
        };
    }
    act = {
        BlocAction: blo
    }
    proto = {
        "@Id": idNova,
        parentID: o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"],
        ActionBinds: {
            ActionBind: actbin
        },
        PostSecuentialActions: {
            BlocAction: blo
        },
        PreSecuentialActions: {
            BlocAction: blo
        },
        Alias: pointName,
        AuxRTAllowed: 'true',
        ExtPoseModified: 'true'
    };
    if (o.BlocAssembly.AllPoints) {
        o.BlocAssembly.AllPoints.ProcessPoint.push(proto);
    } else {
        allpo = {
            ProcessPoint: [proto]
        }
        o.BlocAssembly.AllPoints = allpo;
    }
    alertify.notify(translations.PPUP_NEW_POINT_ADDED);
    ShowPropertiesFromPoint('empty');
}

function GetiPointFromidPoint(idPoint) {
    for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint.length; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[i]["@Id"] == idPoint) {
            return(i);
        }
    }
}

function SelectFirstPointFromiCurrentBloc() {
    idCurrentPoint = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[0].itemId;
    iCurrentPoint = GetiPointFromidPoint(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[0].itemId);
}

$(function () {
    var box = $("#blocproperties");
    $(window).on("click.Bst", function (event) {
        if (box.has(event.target).length == 0 && 
            !box.is(event.target) && 
            !event.target.classList.contains("saveButtonAction") &&
            idCurrentBloc != undefined) {
            ActualizeBlocProperties();
        }
    });
});

/*  ##############################################
 SEQUENCE FUNCTIONS
 ##############################################
 initialization sequence functions 
 ##############################################*/

function InitializeSequence() {
    idCurrentTab = "Sequence";
    ConEdiMode = "Edi";
    InfoEdiMode = "Edi";
    htmlSequence();
    PaintSequence();
}

/**
 * shows the flowchart UserInterface of Points from the xml on the Sequence pannel
 */
function PaintSequence() {
    if (idCurrentBloc != undefined) {
        var nom, item, topMargin;
        topMargin = 60; //initial value of topMargin for the first box. This value will increment +50px for each box of the jsplumb.
        idsInside = [];
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocsReferences) {
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocsReferences.int.length; i++) {
                idsInside.push(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].BlocsReferences.int[i] + "-B");
            }
        }
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.length; i++) {
                idsInside.push(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int[i] + "-P");
            }
        }

        document.getElementById("diagramcontainer").innerHTML = "";
        document.getElementById("diagramcontainer").innerHTML += "<div id='item9998' class='item'  onclick='GetItemGUIPositionMouseUp(this.id)' style='top:10px; background: #ffffff; color: #242629; width: 80px;margin-left:auto;margin-right:auto;'><strong><p id='initcontent'></p></strong></div>";
        document.getElementById('initcontent').innerHTML = "Init";
        var middleX;
        middleX = (document.getElementById("diagramcontainer").offsetWidth / 2) - 100;
        for (var i = 0; i < idsInside.length; i++) {
            arrayidsInside = idsInside[i].split("-");
            id = idsInside[i].split("-", 1);
            item = "item" + id;
            nom = "nom" + id;

            //first compares the idgiven with the ItemGUI id's
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI) {
                for (var u = 0; u < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.length; u++) {
                    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[u].itemId == id) {
                        xS = (+o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[u].x_location) + (+middleX);
                        yS = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI[u].y_location;
                        document.getElementById("diagramcontainer").innerHTML += "<div id='" + item + "' class='item' style='top:" + yS + "px; left:" + xS + "px;' oncontextmenu='RightClickItem(this.id)' onmouseover='MouseOverItem(this.id, event)' onmouseout='HideDialogBox()' onclick='GetItemGUIPositionMouseUp(this.id)' ondblclick='DblClickElemSequence(this.id)'><strong><p id='" + nom + "'></p></strong></div>";

                    }
                }
                if (arrayidsInside[1] == "B") {
                    for (var q = 0; q < o.BlocAssembly.AllBlocs.Bloc.length; q++) {
                        if (o.BlocAssembly.AllBlocs.Bloc[q]["@Id"] == id) {
                            document.getElementById(nom).innerHTML = o.BlocAssembly.AllBlocs.Bloc[q].BlocName;
                            document.getElementById(item).style.background = "#54595f"; //color bloc in secuence
                            document.getElementById(item).style.color = "#ffffff";

                        }
                    }
                } else if (arrayidsInside[1] == "P") {
                    for (var q = 0; q < o.BlocAssembly.AllPoints.ProcessPoint.length; q++) {
                        if (o.BlocAssembly.AllPoints.ProcessPoint[q]["@Id"] == id) {
                            document.getElementById(nom).innerHTML = o.BlocAssembly.AllPoints.ProcessPoint[q].Alias;
                        }
                    }
                }
            }
        }
        document.getElementById("diagramcontainer").innerHTML += "<div id='item9999' class='item' onclick='GetItemGUIPositionMouseUp(this.id)' style='top:" + 500 + "px; background: #ffffff; color: #242629; width: 80px; margin-left:auto;margin-right:auto;'><strong><p id='fincontent'></p></strong></div>";
        document.getElementById('fincontent').innerHTML = "End";
        PlumbGrafic();
    }
}

/*################################################################
 items functions (bloc and point)
 ################################################################*/

/**
 * on mouse over, detects wich Point box is and shows his properties in the box of 'PointProperties'
 */
function RightClickItem(idPoint) {
    idItem = idPoint.replace("item", "");
    iCurrentPoint = GetIFromIdPoint(idItem);
    idBlocOver = idItem;
}

/**
 * on mouse over, detects wich Point box is and shows his properties in the box of 'PointProperties'
 */
function MouseOverItem(idPoint, e) {
    idItemOver = idPoint.replace("item", "");
    if (InfoEdiMode == "Info") {
        ShowInfoFromPoint(idItemOver, e);
    }
}

function ChangeAlias(idcn) {//function activates when doubleclick on one Point box
    if ((ConEdiMode == "Edi") || (ConEdiMode = "NoEdi")) {
        idPoint = idcn.replace("item", "");
        pid = "nom" + idPoint;
        oldAlias = document.getElementById(pid).innerHTML;
        var title = translations.PPUP_RENAME_POINT;
        var pAnswer = prompt(title, oldAlias);
        if (pAnswer != null) {
            if (document.getElementById("diagramcontainer") !== null) {
                //search where is the concrete ProcessPoint with the idPoint, to change his Alias
                for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint.length; i++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[i]["@Id"] == idPoint) {
                        o.BlocAssembly.AllPoints.ProcessPoint[i].Alias = pAnswer;
                        PaintSequence();
                    }
                }
            } else if (document.getElementById("diagramGUIcontainer") !== null) {
                document.getElementById(pid).innerHTML = pAnswer;
            }
            
        } else {
            alertify.warning(translations.PPUP_OPERATION_CANCELED);
        }
        if (document.getElementById("diagramcontainer") !== null) {
            PaintSequence();
        }
    }
}

function ChangeAliasBloc(idcn) {//function activates when doubleclick on one Point box
    if ((ConEdiMode == "Edi") || (ConEdiMode = "NoEdi")) {
        idPoint = idcn.replace("item", "");
        pid = "nom" + idPoint;
        oldAlias = document.getElementById(pid).innerHTML;
        var title = translations.PPUP_RENAME;
        var pAnswer = prompt(title, oldAlias);
        if (pAnswer != null) {
            //search where is the concrete ProcessPoint with the idPoint, to change his Alias
            for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
                if (o.BlocAssembly.AllBlocs.Bloc[i]["@Id"] == idPoint) {
                    o.BlocAssembly.AllBlocs.Bloc[i].BlocName = pAnswer;
                    PaintSequence();
                    ActualizeBlocProperties();
                }
            }
        } else {
            alertify.warning(translations.PPUP_OPERATION_CANCELED);
        }
        PaintSequence();
        ActualizeBlocProperties();
    }
}

function DblClickElemSequence(idElem) {
    if (ConEdiMode == "Edi") {
        idElem = idElem.replace("item", "");
        if (IsBlocOrPoint(idElem) == "bloc") {
            document.getElementById("item" + idElem).style.zIndex = '10000000';
            document.getElementById("item" + idElem).style.animationName = 'zoomBloc';
            window.setTimeout(function () {
                BlocClick('bloc' + idElem);
            }, 500);
        }
    }
}

function DeleteItem() {
    if (listIdsMultipleSelection.length < 1) {
        var itemType;
        title = translations.PPUP_ARE_YOU_SURE;
        idBlocOver = idBlocOver.replace("bloc", "");
        if (IsBlocOrPoint(idBlocOver) == 'bloc') {
            message = translations.PPUP_ARE_YOU_SURE_TO_DELETE_THE + GetBlocById(idBlocOver).BlocName + '?';
        } else {
            message = translations.PPUP_ARE_YOU_SURE_TO_DELETE_THE + GetPointById(idBlocOver).Alias + '?';
        }
        var pAnswer = confirm(title + ", " + message);
        if (pAnswer == true) {
            itemType = IsBlocOrPoint(idBlocOver);
            if (itemType == "point") {
                DeletePoint(idBlocOver);
                ShowPropertiesFromPoint('empty');
            } else if (itemType == "bloc") {
                parentblid = GetIdParentBlocById(idBlocOver);
                if (parentblid != 0) {
                    BlocClick("bloc" + parentblid);
                }
                DeleteBloc(idBlocOver);
                if (parentblid != 0) {
                    BlocClick("bloc" + parentblid);
                } else {
                    document.getElementById("blocproperties").innerHTML = "";
                }
                if (o.BlocAssembly.AllBlocs.Bloc.length < 2) {
                    document.getElementById("blocproperties").innerHTML = "";
                }
            }
        } else {
            if (document.getElementById("swIsGUIBloc")) {
                document.getElementById("swIsGUIBloc").checked = true;
            }
            alertify.warning(translations.PPUP_OPERATION_CANCELED);

        }
    } else {
        title = "multiple deletion";
        message = "Are you sure? ids to delete: " + listIdsMultipleSelection;
        var pAnswer = confirm(title + ", " + message);
        if (pAnswer == true) {
            DeleteMultipleSelectionFromList();
        } else {
            alertify.warning(translations.PPUP_OPERATION_CANCELED);
        }
    }
}
function DeleteItemById(idgiv) {
    itemType = IsBlocOrPoint(idgiv);
    if (itemType == "point") {
        DeletePoint(idgiv);
        ShowPropertiesFromPoint('empty');
    } else if (itemType == "bloc") {
        parentblid = GetIdParentBlocById(idgiv);
        if (parentblid != 0) {
            BlocClick("bloc" + parentblid);
        }
        DeleteBloc(idgiv);
        if (parentblid != 0) {
            BlocClick("bloc" + parentblid);
        } else {
            document.getElementById("blocproperties").innerHTML = "";
        }
        if (o.BlocAssembly.AllBlocs.Bloc.length < 2) {
            document.getElementById("blocproperties").innerHTML = "";
        }
    }
}

function GetIdParentBlocById(idgiv) {
    var iBlocTemp;
    iBlocTemp = GetBlocArrayPositionById(idgiv);
    return(o.BlocAssembly.AllBlocs.Bloc[iBlocTemp].parentID);
}

function DelProcessPointById(idGiven) {//
    for (var t = 0; t < o.BlocAssembly.AllPoints.ProcessPoint.length; t++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[t]["@Id"] == idGiven) {
            o.BlocAssembly.AllPoints.ProcessPoint.splice(t, 1);
        }
    }
    for (t = 0; t < o.BlocAssembly.AssemblyIDs.int.length; t++) {
        if (o.BlocAssembly.AssemblyIDs.int[t] == idGiven) {
            o.BlocAssembly.AssemblyIDs.int.splice(t, 1);
        }
    }
}

function DelPointsReferencesIntById(idGiven) {//ItemGUI from SequenceDescriptions.AllItems
    for (t = 0; t < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.length; t++) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int[t] == idGiven) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.splice(t, 1);
        }
    }
}

function DeletePoint(idToDel) {
    alertify.success(translations.GENERAL_DELETE_POINT + idToDel);
    DelProcessPointById(idToDel);
    DelPointGUIById(idToDel);
    DelItemGUIById(idToDel);
    DelConnectionById(idToDel);
    DelPointsReferencesIntById(idToDel);
    PaintSequence();
}

function RenameItem() {
    var itemType;
    itemType = IsBlocOrPoint(idItem);
    if (itemType == "point") {
        ChangeAlias(idItem);
        ShowPropertiesFromPoint(idItem);
    } else if (itemType == "bloc") {
        ChangeAliasBloc(idItem);
    }
    alertify.success(translations.PPUP_ITEM_RENAMED);
}

function CopyItem() {
    if (listIdsMultipleSelection.length < 1) {
        localStorage.clear();
        alertify.notify(translations.PPUP_ID_COPIED + idItem);
        if (IsBlocOrPoint(idItem) == 'point') {
            setLocalStorageCopyConfig('point', idItem);
            idPointToCopyGlobal = idItem;
        } else {
            setLocalStorageCopyConfig('block', idItem);
            idBlocToCopy = idItem;
            idBlocToCopyGlobal = idItem;
        }
    } else {
        CopyMultipleItems();
        copyingItems = true;
    }
}
function CopyMultipleItems() {
    listIdsMultipleSelectionCopied = [];
    listIdsMultipleSelectionCopied = listIdsMultipleSelection;
}
function PasteItem() {
    if (localStorage.getItem("cbc_block")) {
        idPointToCopyGlobal = localStorage.getItem("cbc_block");
    } else if (localStorage.getItem("cbc_point")) {
        idPointToCopyGlobal = getLocalStorageCopyConfig("point")["@Id"];
    } else if (localStorage.getItem("nor_block")) {
        idPointToCopyGlobal = localStorage.getItem("nor_block");
    } else if (localStorage.getItem("nor_point")) {
        idPointToCopyGlobal = getLocalStorageCopyConfig("point")["@Id"];
    }

    if (copyingItems == false) {
        if (localStorage.getItem("cbc_point") && (ConfiguratorMode == "CBC")) {
            DuplicatePointFromLocalStorage(idPointToCopyGlobal, o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
            alertify.notify(translations.PPUP_POINT_PASTED);
        } else if (localStorage.getItem("nor_point") && (ConfiguratorMode == "assembly")) {
            DuplicatePointFromLocalStorage(idPointToCopyGlobal, o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
            alertify.notify(translations.PPUP_POINT_PASTED);
        } else if (localStorage.getItem("nor_block") && (ConfiguratorMode == "assembly")) {
            idBlocOver = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
            PasteBloc();
        } else if (localStorage.getItem("cbc_block") && (ConfiguratorMode == "CBC")) {
            idBlocOver = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
            PasteBloc();
        }
    } else {
        copyingItems = false;
        PasteMultipleItems();

    }
}
function PasteMultipleItems() {
    for (var i = 0; i < listIdsMultipleSelectionCopied.length; i++) {
        idPointToCopyGlobal = listIdsMultipleSelectionCopied[i];
        PasteItem(listIdsMultipleSelectionCopied[i]);
    }
}

function DuplicatePointFromLocalStorage(pointtoduplicate, blocparentofpoint) {
    var pointLocalStorage = getLocalStorageCopyConfig("point");
    newId = RandomIdNoRepeated();
    pointCopied = getLocalStorageCopyConfig("point");
    o.BlocAssembly.AllPoints.ProcessPoint.push(pointCopied);
    o.BlocAssembly.AllPoints.ProcessPoint[o.BlocAssembly.AllPoints.ProcessPoint.length - 1]["@Id"] = newId;
    itemguiaux = {
        itemId: newId,
        x_location: 100,
        y_location: 100,
    };
    seqdescraux = {
        ItemGUI: [itemguiaux]
    };

    //now, changes the parentid of the new point
    o.BlocAssembly.AllPoints.ProcessPoint[o.BlocAssembly.AllPoints.ProcessPoint.length - 1].parentID = blocparentofpoint;
    //and now if is CBC, the SetPosNumId
    if (ConfiguratorMode == "CBC") {
        iCurrentPoint = o.BlocAssembly.AllPoints.ProcessPoint.length - 1;
        for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.length; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions) {
                for (var j = 0; j < o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction.length; j++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionName == "SetPosNumId") {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionParam = newId;
                    } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionName == "SetBlocSafety") {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].VisibleFP;
                    } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionName == "ResetBlocSafety") {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction[j].VisibleFP;
                    }
                }
            }
        }
    }
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.push(itemguiaux);
    } else {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems = seqdescraux;
    }
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.push(newId);
    } else {
        intAux = newId;
        pr = {
            int: [intAux]
        };
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences = pr;
    }
    o.BlocAssembly.AssemblyIDs.int.push(newId);
    PaintSequence();
}

function DuplicatePoint(pointtoduplicate, blocparentofpoint) {
    newId = RandomIdNoRepeated();
    pointCopied = JSON.parse(JSON.stringify(GetPointById(pointtoduplicate)));
    o.BlocAssembly.AllPoints.ProcessPoint.push(pointCopied);
    o.BlocAssembly.AllPoints.ProcessPoint[o.BlocAssembly.AllPoints.ProcessPoint.length - 1]["@Id"] = newId;
    itemguiaux = {
        itemId: newId,
        x_location: 100,
        y_location: 100,
    };
    seqdescraux = {
        ItemGUI: [itemguiaux]
    };

    //now, changes the parentid of the new point
    o.BlocAssembly.AllPoints.ProcessPoint[o.BlocAssembly.AllPoints.ProcessPoint.length - 1].parentID = blocparentofpoint;
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.push(itemguiaux);
    } else {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems = seqdescraux;
    }
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.push(newId);
    } else {
        intAux = newId;
        pr = {
            int: [intAux]
        };
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences = pr;
    }
    o.BlocAssembly.AssemblyIDs.int.push(newId);
    PaintSequence();
}

function ShowInfoFromPoint(idgiv, e) {
    varcontent = "";
    if (IsBlocOrPoint(idgiv) == "point") {
        currpoint = GetPointById(idgiv);
        iCurrentPoint = GetPointIById(idgiv);
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction) {
                if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[0].ActionName) {
                    varcontent += "<b>" + translations.LBL_PRESECUENTIAL_ACTIONS + "</b><br>";
                }
                for (i = 0; i < 5; i++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != undefined) {
                        varcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule + " - " + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName + "<br>";
                    }
                }
            }
        }

        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction) {
                if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[0].ActionName) {
                    varcontent += "<b>" + translations.LBL_POSTSECUENTIAL_ACTIONS + "</b><br>";
                }
                for (i = 0; i < 5; i++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != undefined) {
                        varcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule + " - " + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName + "<br>";
                    }
                }
            }
        }
        for (ho = 0; ho < 8; ho++) {//for the points
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho]) {
                if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions.BlocAction) {
                        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions.BlocAction[0].ActionName) {
                            varcontent += "<b>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].Description + "</b><br>";
                        }
                        for (i = 0; i < 5; i++) {
                            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions.BlocAction[i].ActionName != undefined) {
                                varcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions.BlocAction[i].ActionModule + " - " + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[ho].actions.BlocAction[i].ActionName + "<br>";
                            }
                        }
                    }
                }
            }
        }
    } else {
        for (ho = 0; ho < o.BlocAssembly.AllBlocs.Bloc.length; ho++) {//for the blocs
            if (o.BlocAssembly.AllBlocs.Bloc[ho]["@Id"] == idgiv) {
                if (o.BlocAssembly.AllBlocs.Bloc[ho].Description != undefined) {
                    varcontent += o.BlocAssembly.AllBlocs.Bloc[ho].Description;
                }
            }
        }
    }
    if (varcontent != "") {
        ShowDialogBoxOverMouse(varcontent, e);
    }
}
function ShowDialogBoxOverMouse(content, e) {
    document.getElementById("dialogBoxInfo").style.display = 'block';
    if (PinButton == false) {
        document.getElementById("dialogBoxInfo").style.left = (+e.clientX) - 70 + "px";
    } else {
        document.getElementById("dialogBoxInfo").style.left = (+e.clientX) - 400 + "px";
    }
    document.getElementById("dialogBoxInfo").style.top = (+e.clientY) + "px";
    document.getElementById("dialogBoxInfo").innerHTML = "";
    document.getElementById("dialogBoxInfo").innerHTML += content;
}

function HideDialogBox() {
    document.getElementById("dialogBoxInfo").style.display = 'none';
}

function UnselectItemsFromSequence() {
    if (document.getElementsByClassName('item')) {
        for (var it = 0; it < document.getElementsByClassName('item').length; it++) {
            if (document.getElementsByClassName('item')[it]) {
                document.getElementsByClassName('item')[it].style.borderColor = "";
            }
        }
    }
}

function GoToActionsOfPoint() {
    if (IsBlocOrPoint(idItem) == "point") {
        OnClickPoint_Actions("item" + idItem);
    } else {
        alertify.warning(translations.PPUP_SELECT_POINT_TO_SHOW_ACTIONS_PANEL);
    }
}
/*################################################################
 dragging functions
 ################################################################*/

function ItemDraggables() {//per ara no ho faig servir, faig PlumbGrafic();
    jsPlumb.ready(function () {
        var x = o.BlocAssembly.AllPoints.ProcessPoint;
        for (m = 0; m < x.length; m++) {//creates all the diagram boxes for each Point
            esdelbloc = CompareProcessPointWithPointReferencesBloc(x[m]["@Id"]); //compara l'id del ProcessPoint que vaig a pintar, amb els ids del PointReferences del Bloc on estem. Si està, retorna true
            if (esdelbloc == true) {
                id = x[m]["@Id"];
                jsPlumb.addEndpoint("item" + id, {//si no faig conexions amb plumb no poso anchors points
                    anchors: ["Top"]
                }, cstyle);
                jsPlumb.addEndpoint("item" + id, {
                    anchors: ["Bottom"]
                }, cstyle);
                jsPlumb.draggable("item" + id, {
                    containment: "parent" //to contain the div into the area
                });
            }
        }
    });
}

function dragStartGUI(event, idP) {
    event.dataTransfer.setData("Text", event.target.id);
    idP = idP.replace("item", "");//to know the id of the dragged point
    iCurrentPoint = idP;
}

function dragStart(event, idP) {
    event.dataTransfer.setData("Text", event.target.id);
    idP = idP.replace("item", "");//to know the id of the dragged point
    iCurrentPoint = idP;
    document.getElementById("diagramcontainer").className = "diagramcontainerGreen";
    kindElemDragging = idP.replace("new", "");
    onlyonetimedragging = 1;
}

function dragEndItemNew() {
    document.getElementById("diagramcontainer").className = "diagramcontainer";
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    if (typeof (document.getElementById(data)) != 'object') {
        event.target.appendChild(document.getElementById(data));
    }
}

function RatoliUp(e) {
    if (isdragging == true) {
        var el = cImage.getBoundingClientRect();
        cursorX = e.clientX - el.left - 25;
        cursorY = el.top - e.clientY + 25;
        cursorX = Math.round(cursorX);
        cursorY = Math.round(cursorY);
        cursorY = Math.abs(cursorY);
        var pdescription;
        if (cursorY > 250) {
            cursorY = 250;
        }
        namingImgPoint = true;
        var pAnswer = prompt(translations.GUI_ENTER_3_LETTERS_NAME);
        if ((pAnswer != null) && (pAnswer.length < 4)) {
            if (pAnswer == "") {
                pAnswer = iCurrentPoint;
            }
            pdescription = pAnswer;
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription) {
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI[0]) {
                    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI[0].pointId == "defaultP") {
                        pgui = {
                            pointId: iCurrentPoint,
                            x_location: cursorX,
                            y_location: cursorY,
                            shortDescrition: pdescription
                        };//adds the new imgPoint to the jsonObject
                        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI[0] = pgui;
                    } else {
                        pgui = {
                            pointId: iCurrentPoint,
                            x_location: cursorX,
                            y_location: cursorY,
                            shortDescrition: pdescription
                        };//adds the new imgPoint to the jsonObject
                        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI.push(pgui);
                    }
                } else {
                    pgui = {
                        pointId: iCurrentPoint,
                        x_location: cursorX,
                        y_location: cursorY,
                        shortDescrition: pdescription
                    };//adds the new imgPoint to the jsonObject
                    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI.push(pgui);
                }
            }
            PaintPointsGUI();
            ChargePointsOfTheImage();
            alertify.success(translations.PPUP_POINT_ADDED_PROF_DESCR);
            namingImgPoint = false;
        } else {
            alertify.error(translations.PPUP_ERROR_NAMING_GUI_POINT);
            namingImgPoint = false;
        }
    }
    isdragging = false;
}

function DragNewPointToDiagramSequence(diagramcontainerid) {
    if (diagramcontainerid == undefined || typeof diagramcontainerid !== "string") {
        diagramcontainerid = "diagramcontainer";
        onlyonetimedragging = 1;
        kindElemDragging = 'point';
    }
    if (onlyonetimedragging == 1) {
        onlyonetimedragging = 0;
        if (kindElemDragging == 'point') {
            pointId = RandomIdNoRepeated();
            var pointName = prompt(translations.PPUP_NEW_POINT, "p" + pointId);
            if (pointName != null) {
                matchId = IdRepeated(pointId);
                if (matchId == "nomatch") {
                    if (idsInside.length > 0) {
                        //enlloc d'afegir-lo pintant-lo, el poso al objecte 'o' que tinc fet de l'xml, i després re-pinto els points des de l'objecte, amb el nou inclòs
                        quantitat = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.length;
                        iGUI = {
                            itemId: pointId,
                            x_location: 50,
                            y_location: 0
                        };
                        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI.push(iGUI);
                        AddPointToProcessPoint(pointId, pointName);
                        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
                            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int.push(pointId);
                        } else {
                            tempPointsReferences = {
                                int: [pointId]
                            }
                            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences = tempPointsReferences;
                        }
                        o.BlocAssembly.AssemblyIDs.int.push(pointId);
                        PaintSequence();
                    } else {//no hi ha ItemGUI dins del SequenceDescriptions.AllItems, per tant el creo
                        iGUI = {
                            itemId: pointId,
                            x_location: 200,
                            y_location: 0
                        };
                        sq = {
                            ItemGUI: [iGUI]
                        };
                        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems = sq;
                        AddPointToProcessPoint(pointId, pointName);
                        intAux = pointId;
                        pr = {
                            int: [intAux]
                        };
                        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences = pr;
                        o.BlocAssembly.AssemblyIDs.int.push(pointId);
                        PaintSequence();
                    }
                    iCurrentPoint = GetIPointById(pointId);
                    ShowPropertiesFromPoint(pointId);
                }
                if (ConfiguratorMode == 'CBC') {//si es cbc, al point li poso l'action setposnum al trigg0
                    iCurrentPoint = o.BlocAssembly.AllPoints.ProcessPoint.length - 1;
                    AddTriggerToPoint();
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0].ActionName = "SetPosNumId";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0].ActionModule = "sAppBaseActions";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint]["@Id"];
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0].DefaultEnabled = "true";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0].VisibleFP = "false";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = "0";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[0]["@xsi:nil"];
                    alertify.success(translations.PPUP_ACTION_ADDED);
                }
            } else {
                alertify.warning(translations.PPUP_OPERATION_CANCELED);
            }
        } else if (kindElemDragging == 'bloc') {
            idBlOv = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
            DuplicateBlocNoLocalStorage(GetBoPById(999), GetBoPById(idBlOv));
            alertify.success(translations.PPUP_NEW_BLOC_CREATED);
            PaintSequence();
            PaintBlocsTreeView();
            BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
        }
    }
}

/*###############################################################
 connections functions
 ################################################################*/

function PaintConnections() {
    //here comes the code to make the conections from the xml file
    var id1, id2;
    c = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection;
    for (j = 0; j < c.length; j++) {
        esdelbloc = CompareProcessPointWithPointReferencesBloc(c[j].sourceId); //compara l'id del ProcessPoint que vaig a pintar, amb els ids del PointReferences del Bloc on estem. Si està, retorna true
        if (esdelbloc == true) {
            id1 = "item" + c[j].sourceId;
            id2 = "item" + c[j].endId;
        }
    }
}

function ConnectionModePointClick(pID, idRaw) {
    if (document.getElementById(pID).className.split(" ", 1) == "item") {
        document.getElementById(pID).className = "itemconnectionselected";
        //now this pointid will be the new connection sourceId
        if (initCon == 0) {
            newConSourceId = idRaw;
            initCon = 1;
        } else if ((initCon == 1) && (idRaw != newConSourceId)) {
            newConEndId = idRaw;
            initCon = 0;
            document.getElementById("item" + newConSourceId).className = "item";
            document.getElementById("item" + newConEndId).className = "item";
            CreateConnection(newConSourceId, newConEndId);
        }
    } else if (document.getElementById(pID).className.split(" ", 1) == "itemconnectionselected") {
        document.getElementById(pID).className = "item";
        initCon = 0;
    }
}

function CreateConnection(conSourceId, conEndId) {
    conExist = ConnectionExistComprovation(conSourceId, conEndId);
    doubleConToFin = DoubleConnectionToFin(conSourceId, conEndId);
    endPointHaveAlreadyCon = EndPointHaveAlreadyConnection(conSourceId, conEndId);
    sourcePointGoesAlreadyToFin = SourcePointGoesAlreadyToFin(conSourceId, conEndId);
    if ((conSourceId == 9998) || (conSourceId == 9999)) {
        conSourceId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if ((conEndId == 9998) || (conEndId == 9999)) {
        conEndId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if ((conExist == "no") && (doubleConToFin == "no") && (endPointHaveAlreadyCon == "no") && (sourcePointGoesAlreadyToFin == "no")) {
        protConnection = {
            sourceId: conSourceId,
            endId: conEndId,
            Condition: "TRUE"
        };
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.push(protConnection);
        } else {
            var ConnectionAux = [protConnection];
            var ConnectionsAux = {
                Connection: ConnectionAux
            };
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections = ConnectionsAux;
        }
        PlumbGrafic();
        alertify.success(translations.PPUP_CONNECTION_CREATED);
        if (ConfiguratorMode == 'CBC') {
            OnConnectionCreateCBC(protConnection);
        }
    } else if (conExist == "yes") {
        alertify.warning(translations.PPUP_CONNECTION_EXIST);
    } else if (doubleConToFin == "yes") {
        alertify.warning(translations.PPUP_ONLY_ONE_CONNECTION_TO_FIN);
    } else if (endPointHaveAlreadyCon == "yes") {
        alertify.warning(translations.PPUP_ONLY_ONE_CONNECTION__FROM_P_TO_P);
    } else if (sourcePointGoesAlreadyToFin == "yes") {
        alertify.warning(translations.PPUP_SOURCE_P_ALREADY_GOES_TO_FIN);
    }
}

function ConnectionExistComprovation(tempconSourceId, tempconEndId) {//function to verify if the connection already exists
    if ((tempconSourceId == 9998) || (tempconSourceId == 9999)) {
        tempconSourceId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if ((tempconEndId == 9998) || (tempconEndId == 9999)) {
        tempconEndId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections) {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; i++) {
            if ((tempconSourceId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].sourceId) && (tempconEndId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].endId)) {
                return("yes");
            }
        }
    }
    return("no");
}

function DoubleConnectionToFin(tempconSourceId, tempconEndId) {//
    if (tempconEndId == 9999) {
        if ((tempconSourceId == 9998) || (tempconSourceId == 9999)) {
            tempconSourceId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
        }
        if ((tempconEndId == 9998) || (tempconEndId == 9999)) {
            tempconEndId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
        }
        // search if the sourceid have another connection where it is sourceid
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; i++) {
            if (tempconSourceId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].sourceId) {
                return("yes");
            }
        }
    }
    return("no");
}
function EndPointHaveAlreadyConnection(tempconSourceId, tempconEndId) {//
    //miru si el sourceId té una connexió que porta a un punt --> no pot haver-n'hi cap més
    // si ja té una connexió que porta a un bloc --> miru si la nova connexió té el endId a un bloc --> pot fer la connexió
    if ((tempconSourceId == 9998) || (tempconSourceId == 9999)) {
        tempconSourceId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if ((tempconEndId == 9998) || (tempconEndId == 9999)) {
        tempconEndId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    //the sourceid have another existing connection?
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections) {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; i++) {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].sourceId == tempconSourceId) {
                //yes, have another existing connection, now, this connection goes to a point?
                if (IsBlocOrPoint(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].endId) == "point") {
                    return("yes");
                } else {
                    //ok, the sourceid have another connection that goes to another bloc, but, the new creating connection, the endid is a bloc?
                    if (IsBlocOrPoint(tempconEndId) == "bloc") {
                        return("no");
                    } else {
                        return("yes");
                    }
                }
            }
        }
    }
    return("no");
}

function SourcePointGoesAlreadyToFin(tempconSourceId, tempconEndId) {//
    if ((tempconSourceId == 9998) || (tempconSourceId == 9999)) {
        tempconSourceId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    if ((tempconEndId == 9998) || (tempconEndId == 9999)) {
        tempconEndId = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    }
    // search if the sourceid have another connection where it is sourceid
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections) {
        for (i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; i++) {
            if (tempconSourceId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].sourceId) {//the sourceid have another connection
                //this other connection have the endid = fin?
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[i].endId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]) {
                    return("yes");
                }
            }
        }
    }
    return("no");
}

function DelConnectionById(idGiven) {
    for (t = 0; t < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; t++) {
        if ((o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[t].sourceId == idGiven) || (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[t].endId == idGiven)) {
            o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.splice(t, 1);
            DelConnectionById(idGiven);
        }
    }
}

var PathToUp = [];
var PathToDown = [];
var ResetBlocSafetySignalsParams = [];
var PathEndPoint;
function CBCDefaultActions(idStartSource, idStartEnd) {
    PathToUp = []; //està declarada al principi
    PathToDown = []; //està declarada al principi
    ResetBlocSafetySignalsParams = [];
    PathEndPoint = "";
    SweepPathToUp(idStartEnd);
    SweepPathToDown(idStartEnd);
    PutResetBlocSafetySignalsParamsToPathEndPoint();
}

function SweepPathToUp(idStart) { //escombra el path cap amunt
    var itemStart, blocParent;
    var bop = IsBlocOrPoint(idStart);
    if (bop == 'bloc') {
        itemStart = GetBlocById(idStart);
    } else {
        itemStart = GetPointById(idStart);
    }
    blocParent = GetBlocById(itemStart.parentID);
    for (var i = 0; i < blocParent.Connections.Connection.length; i++) {
        if (blocParent.Connections.Connection[i].endId == idStart) {
            if (IsBlocOrPoint(blocParent.Connections.Connection[i].sourceId) == 'bloc') {
                if (blocParent["@Id"] == blocParent.Connections.Connection[i].sourceId) {
                    PathToUp.unshift(blocParent.Connections.Connection[i].sourceId);
                    ResetBlocSafetySignalsParams.unshift(blocParent.EnableSignal);
                    SweepPathToUp(blocParent.Connections.Connection[i].sourceId);
                }
            }
        }
    }
}

function SweepPathToDown(idStart) { //escombra el path cap amunt
    var itemStart;
    var bop = IsBlocOrPoint(idStart);
    if (bop == 'bloc') {
        itemStart = GetBlocById(idStart);
    } else {
        itemStart = GetPointById(idStart);
    }
    if (bop == 'bloc') {
        for (var i = 0; i < itemStart.Connections.Connection.length; i++) {
            if (itemStart.Connections.Connection[i].sourceId == idStart) {
                PathToDown.push(itemStart.Connections.Connection[i].sourceId);
                ResetBlocSafetySignalsParams.push(itemStart.EnableSignal);
                if (IsBlocOrPoint(itemStart.Connections.Connection[i].endId) == 'bloc') {
                    SweepPathToDown(itemStart.Connections.Connection[i].endId);
                } else {
                    PathEndPoint = itemStart.Connections.Connection[i].endId;
                }
            }
        }
    } else {
        PathEndPoint = idStart;
    }
}


function PutResetBlocSafetySignalsParamsToPathEndPoint() {
    var iActBind;
    p = GetPointById(PathEndPoint);
    if (GetiActionBindFromProcessPointByDescription(p, "ResetBlocSafety") == "noexist") {
        iActBind = CreateResetBlocSafetyTrigger(p);
        for (var i = 0; i < PathToUp.length; i++) {
            AddActionToActionsTrigg_auto(p.ActionBinds.ActionBind[iActBind], "sAppBaseActions", p.ActionBinds.ActionBind[iActBind].Description, PathToUp[i]);
        }
        for (var i = 0; i < PathToDown.length; i++) {
            AddActionToActionsTrigg_auto(p.ActionBinds.ActionBind[iActBind], "sAppBaseActions", p.ActionBinds.ActionBind[iActBind].Description, PathToDown[i]);
        }
    }
}

function CreateResetBlocSafetyTrigger(p) {
    var idtr = 7;
    for (var i = 7; i >= 0; i--) {//gets the first empty trigg place i

        if (p.ActionBinds.ActionBind[i]["@xsi:nil"] == "true") {
            idtr = i;
        }
    }
    p.ActionBinds.ActionBind[idtr].Anticipation = "0";
    p.ActionBinds.ActionBind[idtr].inUse = "true";
    p.ActionBinds.ActionBind[idtr].reference = "Start";
    p.ActionBinds.ActionBind[idtr].mode = "Distance";
    p.ActionBinds.ActionBind[idtr].Description = "ResetBlocSafety";
    act = [5];
    for (var i = 0; i < 5; i++) {
        act[i] = {
            "@xsi:nil": "true",
        };
    }
    p.ActionBinds.ActionBind[idtr].actions = {
        BlocAction: act
    };
    delete p.ActionBinds.ActionBind[idtr]["@xsi:nil"];
    return(idtr);
}

function CreateTrigger(p, descriptiongiv) {
    var idtr = p.ActionBinds.ActionBind.length - 1;
    if (idtr > -1) {
        for (var i = p.ActionBinds.ActionBind.length - 1; i >= 0; i--) {//gets the first empty trigg place i

            if (p.ActionBinds.ActionBind[i]["@xsi:nil"] == "true") {
                idtr = i;
            }
        }
        p.ActionBinds.ActionBind[idtr].Anticipation = "0";
        p.ActionBinds.ActionBind[idtr].inUse = "true";
        if (descriptiongiv == "ResetBlocSafety") {
            p.ActionBinds.ActionBind[idtr].reference = "Start";
        } else if (descriptiongiv == "SetBlocSafety") {
            p.ActionBinds.ActionBind[idtr].reference = "End";
        } else {
            p.ActionBinds.ActionBind[idtr].reference = "Start";
        }
        p.ActionBinds.ActionBind[idtr].mode = "Distance";
        p.ActionBinds.ActionBind[idtr].Description = descriptiongiv;
        act = [5];
        for (var i = 0; i < 5; i++) {
            act[i] = {
                "@xsi:nil": "true",
            };
        }
        p.ActionBinds.ActionBind[idtr].actions = {
            BlocAction: act
        };
        delete p.ActionBinds.ActionBind[idtr]["@xsi:nil"];
    } else {
        idtr = 0;
    }
    return(idtr);
}
function DeleteTrigger(p, descriptiongiv) {
    var iActBind;
    if (GetiActionBindFromProcessPointByDescription(p, descriptiongiv) != "noexist") {
        iActBind = GetiActionBindFromProcessPointByDescription(p, descriptiongiv);
        p.ActionBinds.ActionBind.splice(iActBind, 1);
    }
    var auxActionBind = {};
    auxActionBind["@xsi:nil"] = "true";
    p.ActionBinds.ActionBind.push(auxActionBind);
    alertify.warning(translations.GENERAL_DELETED + descriptiongiv);
}

function GetiActionBindFromProcessPointByDescription(p, descriptiongiv) {
    for (var i = 0; i < p.ActionBinds.ActionBind.length; i++) {
        if (p.ActionBinds.ActionBind[i].Description == descriptiongiv) {
            return(i);
        }
    }
    return("noexist");
}

function AddActionToActionsTrigg_auto(pActBind, nameMod, nameAction, idBlActParam) {
    var exist, nBA;
    exist = "no";
    nBA = 5;
    for (var i = pActBind.actions.BlocAction.length - 1; i >= 0; i--) {
        if ((pActBind.actions.BlocAction[i].ActionParam == idBlActParam) && (pActBind.actions.BlocAction[i].ActionName == nameAction)) {
            exist = "yes";
        }
        if (pActBind.actions.BlocAction[i]["@xsi:nil"] == "true") {
            nBA = i;
        }
    }
    if (exist == "no") {
        pActBind.actions.BlocAction[nBA].ActionName = nameAction;
        pActBind.actions.BlocAction[nBA].ActionModule = nameMod;
        pActBind.actions.BlocAction[nBA].ActionParam = idBlActParam;//Math.random();
        pActBind.actions.BlocAction[nBA].DefaultEnabled = "true";
        pActBind.actions.BlocAction[nBA].VisibleFP = "false";
        delete pActBind.actions.BlocAction[nBA]["@xsi:nil"];
    }
}

function deleteResetSafeties() {
    var iActBind;
    p = GetPointById(PathEndPoint);
    if (GetiActionBindFromProcessPointByDescription(p, "ResetBlocSafety") != "noexist") {
        iActBind = GetiActionBindFromProcessPointByDescription(p, "ResetBlocSafety");
        p.ActionBinds.ActionBind.splice(iActBind, 1);
    }
}

function GetConnectionsInDown(connectionGiv) {
    var eId = connectionGiv.endId;
    var connX;
    var cadenas = [];
    var subCadenas;
    var currentBloc;
    if (IsBlocOrPoint(eId) == 'point') {
        return("");
    }
    currentBloc = GetBlocById(eId);
    for (var i = 0; i < currentBloc.Connections.Connection.length; i++) {
        connX = currentBloc.Connections.Connection[i];
        if ((connX.sourceId == currentBloc["@Id"]) && (connX.endId != currentBloc["@Id"])) {//foreach
            if (IsBlocOrPoint(connX.endId) == "point") {
                cadenas.push([connX]);
            } else {
                subCadenas = GetConnectionsInDown(connX);
                if (subCadenas.length == 0) {
                    cadenas.push([connX]);
                }
                for (var j = 0; j < subCadenas.length; j++) {
                    var aux = subCadenas[j];
                    aux.unshift(connX);
                    cadenas.push(aux);
                }
            }
        }
    }
    return(cadenas);
}

function GetConnectionsInUp(connectionGiv) {
    var sId = connectionGiv.sourceId;
    var eId = connectionGiv.endId;
    var connX;
    var cadenas = [];
    var currentBloc;
    var subCadenas;
    if (IsBlocOrPoint(eId) == 'point') {
        return("");
    }
    currentBloc = GetBlocById(sId);
    for (var i = 0; i < currentBloc.Connections.Connection.length; i++) {
        connX = currentBloc.Connections.Connection[i];
        if ((connX.endId == currentBloc["@Id"]) && (connX.sourceId != currentBloc["@Id"])) {//foreach
            if (IsBlocOrPoint(connX.sourceId) == "point") {
                cadenas.push([connX]);
            } else {
                subCadenas = GetConnectionsInUp(connX);
                if (subCadenas.length == 0) {
                    cadenas.push([connX]);
                }
                for (var j = 0; j < subCadenas.length; j++) {
                    var aux = subCadenas[j];
                    aux.push(connX);
                    cadenas.push(aux);
                }
            }
        }
    }
    return(cadenas);
}

function GetConnectionsOutDown(connectionGiv) {
    var sId = connectionGiv.sourceId;
    var eId = connectionGiv.endId;
    var connX;
    var cadena = [];
    var currentBloc;
    var subCadena = [];
    eParentBloc = GetBlocById(GetBlocById(eId).parentID);
    if (GetBlocById(eId).parentID == 1000) {//si és un top block
        return("");
    }
    if (GetBoPById(eId).parentID == GetBoPById(sId).parentID) {//si són
        return("");
    }
    currentBloc = GetBlocById(GetBlocById(eId).parentID);
    for (var i = 0; i < currentBloc.Connections.Connection.length; i++) {
        connX = currentBloc.Connections.Connection[i];
        if (connX.sourceId == eId) {//foreach
            if (connX.endId == currentBloc["@Id"]) {
                if (currentBloc.parentID == 1000) {
                    cadena.push(connX);
                } else {
                    subCadena = GetConnectionsOutDown(connX);
                    subCadena.unshift(connX);
                    cadena = cadena.concat(subCadena);
                }
            }
        }
    }
    return(cadena);
}

function GetConnectionsOutUp(connectionGiv) {
    var sId = connectionGiv.sourceId;
    var eId = connectionGiv.endId;
    var connX;
    var cadena = [];
    var currentBloc;
    var subCadena = [];
    if (GetBlocById(sId).parentID == 1000) {//si és un top block
        return("");
    }
    if (GetBoPById(sId).parentID == GetBoPById(eId).parentID) {//si són
        return("");
    }
    currentBloc = GetBlocById(GetBlocById(sId).parentID);
    for (var i = 0; i < currentBloc.Connections.Connection.length; i++) {
        connX = currentBloc.Connections.Connection[i];
        if (connX.endId == sId) {//foreach
            if (connX.sourceId == currentBloc["@Id"]) {
                if (currentBloc.parentID == 1000) {
                    cadena.push(connX);
                } else {
                    subCadena = GetConnectionsOutUp(connX);
                    subCadena.push(connX);
                    cadena = cadena.concat(subCadena);
                }
            }
        }
    }
    return(cadena);
}
function OnConnectionCreateCBC(protConnection) {
    var arrayResets = [];
    var arraySets = [];
    if (GetBoPById(protConnection.sourceId).parentID != GetBoPById(protConnection.endId).parentID) {
        if (IsBlocOrPoint(protConnection.sourceId) == "point") {
            arraySets.push(protConnection);
        } else if (IsBlocOrPoint(protConnection.endId) == "point") {
            arrayResets.push(protConnection);
        } else if (IsBlocOrPoint(protConnection.sourceId) == "bloc") {
            if (GetBoPById(protConnection.endId).parentID == protConnection.sourceId) {
                cadenas = GetConnectionsInDown(protConnection);
                //mirar si ultima connection l'endId és un punt: agafar la ultima connection, i l'afegeixo arrayResets
                for (var i = 0; i < cadenas.length; i++) {
                    if (IsBlocOrPoint(cadenas[i][cadenas[i].length - 1].endId) == "point") {
                        arrayResets.push(cadenas[i][cadenas[i].length - 1]);
                    }
                }
            } else if (GetBoPById(protConnection.sourceId).parentID == protConnection.endId) {
                cadenas = GetConnectionsInUp(protConnection);
                //mirar si la primera cadena té el sourceId que és un punt: afegeixo la connexió a la llista arraySet
                for (var i = 0; i < cadenas.length; i++) {
                    if (IsBlocOrPoint(cadenas[i][0].sourceId) == "point") {
                        arraySets.push(cadenas[i][0]);
                    }
                }
            }
        }
        //per tots els arrayResets faig OutUp
        for (var i = 0; i < arrayResets.length; i++) {
            var connections = GetConnectionsOutUp(arrayResets[i]);
            var signalsToReset = [];
            var signalName = GetBlocById(arrayResets[i].sourceId).ExecutingSignal;
            if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                signalsToReset.push(signalName);
            }
            if (connections.length) {
                for (var j = 0; j < connections.length; j++) {
                    signalName = GetBlocById(connections[j].sourceId).ExecutingSignal;
                    if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                        signalsToReset.push(signalName);
                    }
                }
            }
            var actPoint = GetBoPById(arrayResets[i].endId);
            //Buscar dins dels triggs del punt si existeix un trigg que la description sigui == s  XXX
            //borrem aquest trigg i el tornem a generat amb una crida a la Action De ResetSatety enviant com a parametre
            //cada un dels strings dins de SignalsToReset.
            if (GetiActionBindFromProcessPointByDescription(actPoint, "ResetBlocSafety") == "noexist") {
                iActBind = CreateTrigger(actPoint, "ResetBlocSafety");
                for (var k = 0; k < signalsToReset.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToReset[k]);
                }
            } else {
                DeleteTrigger(actPoint, "ResetBlocSafety");
                iActBind = CreateTrigger(actPoint, "ResetBlocSafety");
                for (var k = 0; k < signalsToReset.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToReset[k]);
                }
            }
        }
        //per tots els arraySets faig OutDown
        for (var i = 0; i < arraySets.length; i++) {
            var connections = GetConnectionsOutDown(arraySets[i]);
            var signalsToSet = [];
            var signalName = GetBlocById(arraySets[i].endId).ExecutingSignal;
            if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                signalsToSet.push(signalName);
            }
            if (connections.length) {
                for (var j = 0; j < connections.length; j++) {
                    signalName = GetBlocById(connections[j].endId).ExecutingSignal;
                    if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                        signalsToSet.push(signalName);
                    }
                }
            }
            var actPoint = GetBoPById(arraySets[i].sourceId);

            if (GetiActionBindFromProcessPointByDescription(actPoint, "SetBlocSafety") == "noexist") {
                iActBind = CreateTrigger(actPoint, "SetBlocSafety");
                for (var k = 0; k < signalsToSet.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToSet[k]);
                }
            } else {
                DeleteTrigger(actPoint, "SetBlocSafety");
                iActBind = CreateTrigger(actPoint, "SetBlocSafety");
                for (var k = 0; k < signalsToSet.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToSet[k]);
                }
            }
        }
    }
}

function OnConnectionDeleteCBC(arrConnectionGiv, t) {
    var protConnection = arrConnectionGiv[t];
    var arrayResets = [];
    var arraySets = [];
    if (GetBoPById(protConnection.sourceId).parentID != GetBoPById(protConnection.endId).parentID) {
        if (IsBlocOrPoint(protConnection.sourceId) == "point") {
            actPoint = GetPointById(protConnection.sourceId);
            DeleteTrigger(actPoint, "SetBlocSafety");
        } else if (IsBlocOrPoint(protConnection.endId) == "point") {
            actPoint = GetPointById(protConnection.endId);
            DeleteTrigger(actPoint, "ResetBlocSafety");
        } else if (IsBlocOrPoint(protConnection.sourceId) == "bloc") {
            if (GetBoPById(protConnection.endId).parentID == protConnection.sourceId) {
                cadenas = GetConnectionsInDown(protConnection);
                //mirar si ultima connection l'endId és un punt:
                //agafar la ultima connection, i l'afegeixo arrayResets
                for (var i = 0; i < cadenas.length; i++) {
                    if (IsBlocOrPoint(cadenas[i][cadenas[i].length - 1].endId) == "point") {
                        arrayResets.push(cadenas[i][cadenas[i].length - 1]);
                    }
                }
            } else if (GetBoPById(protConnection.sourceId).parentID == protConnection.endId) {
                cadenas = GetConnectionsInUp(protConnection);
                //mirar si la primera cadena té el sourceId que és un punt: afegeixo la connexió a la llista arraySet
                for (var i = 0; i < cadenas.length; i++) {
                    if (IsBlocOrPoint(cadenas[i][0].sourceId) == "point") {
                        arraySets.push(cadenas[i][0]);
                    }
                }
            }
        }

        arrConnectionGiv.splice(t, 1);
        //per tots els arrayResets faig OutUp
        for (var i = 0; i < arrayResets.length; i++) {
            var connections = GetConnectionsOutUp(arrayResets[i]);
            var signalsToReset = [];
            var signalName = GetBlocById(arrayResets[i].sourceId).ExecutingSignal;
            if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                signalsToReset.push(signalName);
            }
            if (connections.length) {
                for (var j = 0; j < connections.length; j++) {
                    signalName = GetBlocById(connections[j].sourceId).ExecutingSignal;
                    if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                        signalsToReset.push(signalName);
                    }
                }
            }
            var actPoint = GetBoPById(arrayResets[i].endId);
            //Buscar dins dels triggs del punt si existeix un trigg que la description sigui == s  XXX
            //borrem aquest trigg i el tornem a generat amb una crida a la Action De ResetSatety enviant com a parametre
            //cada un dels strings dins de SignalsToReset.

            if (GetiActionBindFromProcessPointByDescription(actPoint, "ResetBlocSafety") == "noexist") {
                iActBind = CreateTrigger(actPoint, "ResetBlocSafety");
                for (var k = 0; k < signalsToReset.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToReset[k]);
                }
            } else {
                DeleteTrigger(actPoint, "ResetBlocSafety");
                iActBind = CreateTrigger(actPoint, "ResetBlocSafety");
                for (var k = 0; k < signalsToReset.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToReset[k]);
                }
            }
        }
        //per tots els arraySets faig OutDown
        for (var i = 0; i < arraySets.length; i++) {
            var connections = GetConnectionsOutDown(arraySets[i]);
            var signalsToSet = [];
            var signalName = GetBlocById(arraySets[i].endId).ExecutingSignal;
            if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                signalsToSet.push(signalName);
            }
            if (connections.length) {
                for (var j = 0; j < connections.length; j++) {
                    signalName = GetBlocById(connections[j].endId).ExecutingSignal;
                    if ((signalName != "") && (signalName != "undefined") && (signalName != undefined) && (signalName != "null") && (signalName != null)) {
                        signalsToSet.push(signalName);
                    }
                }
            }
            var actPoint = GetBoPById(arraySets[i].sourceId);
            if (GetiActionBindFromProcessPointByDescription(actPoint, "SetBlocSafety") == "noexist") {
                iActBind = CreateTrigger(actPoint, "SetBlocSafety");
                for (var k = 0; k < signalsToSet.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToSet[k]);
                }
            } else {
                DeleteTrigger(actPoint, "SetBlocSafety");
                iActBind = CreateTrigger(actPoint, "SetBlocSafety");
                for (var k = 0; k < signalsToSet.length; k++) {
                    AddActionToActionsTrigg_auto(actPoint.ActionBinds.ActionBind[iActBind], "sAppBaseActions", actPoint.ActionBinds.ActionBind[iActBind].Description, signalsToSet[k]);
                }
            }
        }
    } else {
        //in this case, is connection between level brothers items, so don't need to do the action param algorithm, just delete the connection
        arrConnectionGiv.splice(t, 1);
    }
}

function ExecutingSignalChanged(blocgiv) {
    if (ConfiguratorMode == "CBC") {
        if (blocgiv.Connections) {
            for (var ii = 0; ii < blocgiv.Connections.Connection.length; ii++) {
                if (blocgiv.Connections.Connection[ii].sourceId == blocgiv["@Id"]) {
                    OnConnectionCreateCBC(blocgiv.Connections.Connection[ii]);
                }
                if (blocgiv.Connections.Connection[ii].endId == blocgiv["@Id"]) {
                    OnConnectionCreateCBC(blocgiv.Connections.Connection[ii]);
                }
            }
        }
    }
}

/*
 ################################################################
 buttons click functions
 ################################################################
 */

function OnCtrlMode() {
    if (MenuOption == 'Sequence') {
        if (ConEdiMode == 'Con') {
            OnSwEditionMode();
            document.getElementById("swEdition").checked = true;
        } else if (ConEdiMode == 'Edi') {
            OnSwConnectionMode();
            document.getElementById("swConnection").checked = true;
        } else {
            ConEdiMode = 'NoEdi';
            OnSwEditionMode();
            document.getElementById('swEdition').checked = true;
        }
    }
}

function OnSwEditionMode() {
    if ((ConEdiMode == "NoEdi") || (ConEdiMode == "Con")) {
        ConEdiMode = "Edi";
        document.getElementById("diagramcontainer").className = "diagramcontainer";
        document.getElementById('disablingDiv').style.display = 'none';
        if (document.getElementsByClassName("itemconnectionselected").length > 0) {
            document.getElementsByClassName("itemconnectionselected")[0].className = "item";
        }
        if (document.getElementById("swConnection").checked == true) {
            document.getElementById("swConnection").checked = false;
        }
        alertify.notify(translations.PPUP_EDITION_MODE);
        PlumbGrafic();
    } else if (ConEdiMode == "Edi") {
        ConEdiMode = "NoEdi";
        document.getElementById("diagramcontainer").className = "diagramcontainer";
        document.getElementById('disablingDiv').style.display = 'none';
        if (document.getElementsByClassName("itemconnectionselected").length > 0) {
            document.getElementsByClassName("itemconnectionselected")[0].className = "item";
        }
        if (document.getElementById("swConnection").checked == true) {
            document.getElementById("swConnection").checked = false;
        }
        alertify.notify(translations.PPUP_NO_EDITION_MODE);
        PlumbGrafic();
    }
}
function OnSwConnectionMode() {
    if ((ConEdiMode == "Edi") || (ConEdiMode == "NoEdi")) {
        ConEdiMode = "Con";
        initCon = 0;
        document.getElementById("diagramcontainer").className = "diagramcontainerFocus";
        document.getElementById('disablingDiv').style.display = 'block';
        if (document.getElementById("swEdition").checked == true) {
            document.getElementById("swEdition").checked = false;
        }
        alertify.notify(translations.PPUP_CONNECTION_MODE);
        PlumbGrafic();
        ShowPropertiesFromPoint('empty');
    } else if (ConEdiMode == "Con") {
        ConEdiMode = "Edi";
        document.getElementById("diagramcontainer").className = "diagramcontainer";
        document.getElementById('disablingDiv').style.display = 'none';
        if (document.getElementsByClassName("itemconnectionselected").length > 0) {
            document.getElementsByClassName("itemconnectionselected")[0].className = "item";
        }
        if (document.getElementById("swEdition").checked == false) {
            document.getElementById("swEdition").checked = true;
        }
        alertify.notify(translations.PPUP_NO_CONNECTION_MODE);
        PlumbGrafic();
    }
}

function InfoPointsSwMode() {
    if (InfoEdiMode == "Edi") {
        InfoEdiMode = "Info";
        alertify.notify(translations.PPUP_INFO_MODE);
    } else if (InfoEdiMode == "Info") {
        InfoEdiMode = "Edi";
        alertify.notify(translations.PPUP_NO_INFO_MODE);
    }
}

/* --------- inici multiple selection amb requadre ----- */
function OnMouseDownDiagram(e) {
    if (multipleSelectionMode == true) {
        var multipleSelectorDiv = document.getElementById('multipleSelectorDiv');
        multipleSelectorDiv.hidden = 0;
        x1mDiv = e.screenX - 365;
        y1mDiv = e.screenY - 85;
        reCalc();
    }
}

function OnMouseMoveDiagram(e) {
    if (multipleSelectionMode == true) {
        x2mDiv = e.screenX - 365;
        y2mDiv = e.screenY - 85;
        reCalc();
    }
}

function OnMouseUpDiagram(e) {
    if (multipleSelectionMode == true) {
        //mira quins punts queden dins
        var seqItems = document.getElementsByClassName("item");
        for (var i = 0; i < seqItems.length; i++) {
            if ((seqItems[i].offsetLeft > x3mDiv) && (seqItems[i].offsetLeft < x4mDiv) && (seqItems[i].offsetTop > y3mDiv) && (seqItems[i].offsetTop < y4mDiv) && (seqItems[i].id.replace("item", "") < 9999)) {
                alertify.notify(seqItems[i].innerHTML);
                MakeListIdsMultipleSelection(seqItems[i].id.replace("item", ""));
            }
        }
        var multipleSelectorDiv = document.getElementById('multipleSelectorDiv');
        multipleSelectorDiv.hidden = 1;
    }
}

function reCalc() {
    if (multipleSelectionMode == true) {
        var multipleSelectorDiv = document.getElementById('multipleSelectorDiv');
        x3mDiv = Math.min(x1mDiv, x2mDiv);
        x4mDiv = Math.max(x1mDiv, x2mDiv);
        y3mDiv = Math.min(y1mDiv, y2mDiv);
        y4mDiv = Math.max(y1mDiv, y2mDiv);
        multipleSelectorDiv.style.left = x3mDiv + 'px';
        multipleSelectorDiv.style.top = y3mDiv + 'px';
        multipleSelectorDiv.style.width = x4mDiv - x3mDiv + 'px';
        multipleSelectorDiv.style.height = y4mDiv - y3mDiv + 'px';
    }
}

function MakeListIdsMultipleSelection(idgiv) {
    listIdsMultipleSelection.push(idgiv);
    for (var i = 0; i < listIdsMultipleSelection.length; i++) {
        document.getElementById('item' + listIdsMultipleSelection[i]).style.borderColor = '#AD8282';
    }
    alertify.success(listIdsMultipleSelection);
}

function DeleteMultipleSelectionFromList() {
    for (var i = 0; i < listIdsMultipleSelection.length; i++) {
        DeleteItemById(listIdsMultipleSelection[i]);
    }
}

/*##############################################
 ACTIONS FUNCTIONS
 ################################################*/

function InitializeActions() {
    if (idCurrentBloc == undefined) {
        alertify.warning(translations.ACTIONS_SELECT_A_BLOCK);
    } else if (iCurrentPoint == undefined) {
        alertify.warning(translations.ACTIONS_NO_POINT_INSIDE);
    } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.hasChildNodes) {
            alertify.warning(translations.ACTIONS_NO_POINT_INSIDE);
        } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int) {
            OnClickPoint_Actions("item" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int[0]);
        }
    } else {
        alertify.warning(translations.ACTIONS_NO_POINT_INSIDE);
    }
}

/*################################################################
 trigger, action bind operations	
 ################################################################*/

function TriggerValue(idT) {
    if (document.getElementById("trigg0").style.left.replace("px", "") < 0) {
        document.getElementById("trigg0").style.left = "0px";
    }
    if (document.getElementById("trigg0").style.left.replace("px", "") > 350) {
        document.getElementById("trigg0").style.left = "350px";
    }

    if ((idT == "div0") || (idT == "trigg0")) {
        if (document.getElementById("swTriggerUnits").checked == false) {
            val = document.getElementById("trigg0").style.left;
            val = val.replace("px", "");
            val = val * (10 / 7);
            val = Math.round(val);
            val = 500 - val;
            val = val + "ms";
            document.getElementById("trigg0").innerHTML = "<br><br><b>" + val + "</b>";
        } else if (document.getElementById("swTriggerUnits").checked == true) {
            if (document.getElementById("swTriggerDistMode").checked == true) {

                val = document.getElementById("trigg0").style.left;
                val = val.replace("px", "");

                val = val * (20 / 7);
                val = 1000 - val;
                val = Math.round(val);
                val = val + "mm";
                document.getElementById("trigg0").innerHTML = "<br><br><b>" + val + "</b>";
            } else {
                val = document.getElementById("trigg0").style.left;
                val = val.replace("px", "");
                val = val * (20 / 7);
                val = Math.round(val);
                val = val + "mm";
                document.getElementById("trigg0").innerHTML = "<br><br><b>" + val + "</b>";
            }
        }
    }
    ba = [{
            ActionName: "",
            ActionModule: "",
            ActionParam: "",
            IsTriggAllowed: "true",
            DefaultEnabled: "true",
            VisibleFP: "true"
        }];
    val = val.replace("mm", "");
    val = val.replace("ms", "");
    val = val.replace("px", "");
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = val;
    ActualizeTriggOptionsBtnDescription();
}

function isInteger(data) {
    return !isNaN(data);
}

function SetTriggValue() {//when DoubleClick on trigger, activates this function to ask the value of the trigger
    var val;
    val = prompt(translations.ACTIONS_ENTER_TRIGG_VALUE, "250");
    if ((val) && (isInteger(val))) {
        valraw = JSON.parse(JSON.stringify(val));
        val = val + "px";
        jsPlumb.reset();
        AddPlumbPropertiesToTrigg();
        PositionTriggFromValue(valraw);
        TriggerValue('trigg0');
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = valraw;
        document.getElementById("trigg0").innerHTML = "<br><br><b>" + valraw + "</b>";
        if (document.getElementById("swTriggerUnits").checked == false) {
            document.getElementById("trigg0").innerHTML += "<b>ms</b>";
        } else if (document.getElementById("swTriggerUnits").checked == true) {
            document.getElementById("trigg0").innerHTML += "<b>mm</b>";
        }
        ActualizeTriggOptionsBtnDescription();
    } else {
        alertify.warning(translations.ACTIONS_OPERATION_CANCELED_OR_CONTENT_UNAPROPIATED);
    }
}
function TriggValueFromParameter(triggvalue) {
    val = triggvalue + "px";
    document.getElementById("trigg0").style.left = val;
    TriggerValue('trigg0');
    jsPlumb.reset();
    AddPlumbPropertiesToTrigg();
}

function PositionTriggFromValue(val) {
    if (val == undefined) {
        val = "0";
    }
    valxml = JSON.parse(JSON.stringify(val));
    if (document.getElementById("swTriggerUnits").checked == false) {
        val = val.replace("ms", "");
        val = 500 - val;
        val = val * (7 / 10);
        val = Math.round(val);
        document.getElementById("trigg0").style.left = val + 'px';
        valxml = valxml + "ms";
        document.getElementById("trigg0").innerHTML = "<br><br><b>" + valxml + "</b>";
    } else if (document.getElementById("swTriggerUnits").checked == true) {
        if (document.getElementById("swTriggerDistMode").checked == true) {
            val = val.replace("px", "");
            val = 1000 - val;
            val = val * (7 / 20);
            val = Math.round(val);
            document.getElementById("trigg0").style.left = val + 'px';
            valxml = valxml + "mm";
            document.getElementById("trigg0").innerHTML = "<br><br><b>" + valxml + "</b>";
        } else {
            val = val.replace("px", "");
            val = val * (7 / 20);
            val = Math.round(val);
            document.getElementById("trigg0").style.left = val + 'px';
            valxml = valxml + "mm";
            document.getElementById("trigg0").innerHTML = "<br><br><b>" + valxml + "</b>";
        }
    }
}

function SetValueToTriggActionParam(arrayreturned) {
    var valgiven = "";
    for (var i = 0; i < arrayreturned.length; i++) {//convert the array into a string with values seperated by spaces
        if (i != arrayreturned.length - 1) {
            valgiven += arrayreturned[i] + " ";
        } else {
            valgiven += arrayreturned[i];
        }
    }
    if (currpanel.indexOf("Trigg") > -1) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam = valgiven;
    } else if (currpanel == "PreSeq") {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam = valgiven;
    } else if (currpanel == "PostSeq") {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam = valgiven;
    }
    ActualizeHTMLSelectedActionsPanels();
}
function SetValueToPreSeqActionParam(arrayreturned) {
    valgiven = "";
    for (var i = 0; i < arrayreturned.length; i++) {//convert the array into a string with values seperated by spaces
        if (i != arrayreturned.length - 1) {
            valgiven += arrayreturned[i] + " ";
        } else {
            valgiven += arrayreturned[i];
        }
    }
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam = valgiven;
    ActualizeHTMLSelectedActionsPanels();
}
function SetValueToPostSeqActionParam(arrayreturned) {
    valgiven = "";
    for (var i = 0; i < arrayreturned.length; i++) {//convert the array into a string with values seperated by spaces
        if (i != arrayreturned.length - 1) {
            valgiven += arrayreturned[i] + " ";
        } else {
            valgiven += arrayreturned[i];
        }
    }
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam = valgiven;
    ActualizeHTMLSelectedActionsPanels();
}

function CountActionBindUsed(actionbindsgiv) {
    recompte = 0;
    for (i = 0; i < actionbindsgiv.length; i++) {
        if (actionbindsgiv[i]["@xsi:nil"] == 'true') {
            recompte++;
        }
    }
    return(recompte);
}

function CountBlocActionUsed() {
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "btriggstab") {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions) {
            for (i = 0; i < 5; i++) {
                if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i]["@xsi:nil"] == "true") {
                    nBA = i;
                    return(nBA);
                } else {
                    nBA = 5;
                }
            }
        } else {
            nBA = 0;
            return(nBA);
        }
        return(nBA);
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") {
        for (i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i]["@xsi:nil"] == "true") {
                nBA = i;
                return(nBA);
            } else {
                nBA = 5;
            }
        }
        return(nBA);
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec") {
        for (i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i]["@xsi:nil"] == "true") {
                nBA = i;
                return(nBA);
            } else {
                nBA = 5;
            }
        }
        return(nBA);
    }
}

function CountBlocActionUsedPreSeq() {
    for (i = 0; i < 5; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i]["@xsi:nil"] == "true") {
            nBA = i;
            return(nBA);
        } else {
            nBA = 5;
        }
    }
    return(nBA);
}

function CountBlocActionUsedPostSeq() {
    for (i = 0; i < 5; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i]["@xsi:nil"] == "true") {
            nBA = i;
            return(nBA);
        } else {
            nBA = 5;
        }
    }
    return(nBA);
}

function SearchAndDeleteActionPoint(nameToDelete) {
    if (currpanel.indexOf("Trigg") > -1) {
        for (var i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName == nameToDelete) {
                //now, if the blocAction[] is between 0 and 4, this code moves the next blocActions[] 1 position before
                if (i < 4) {
                    for (var j = i; j < 4; j++) {
                        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1]["@xsi:nil"] == "true") {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].VisibleFP;
                        } else {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionName;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionModule;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionParam;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].DefaultEnabled;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].VisibleFP;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j]["@xsi:nil"];

                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].VisibleFP;
                        }
                    }
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i]["@xsi:nil"] = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionModule;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].DefaultEnabled;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].VisibleFP;
                }
            }
        }
    } else if (currpanel == "PreSeq") {
        for (i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName == nameToDelete) {
                //now, if the blocAction[] is between 0 and 4, this code moves the next blocActions[] 1 position before
                if (i < 4) {
                    for (j = i; j < 4; j++) {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionName;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionModule;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionParam;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].VisibleFP;
                        ///////
                        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1]["@xsi:nil"] == "true") {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP;
                        } else {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionName;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionModule;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionParam;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].VisibleFP;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j]["@xsi:nil"];
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].VisibleFP;
                        }
                    }
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i]["@xsi:nil"] = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP;
                }
            }
        }
    }
    if (currpanel == "PostSeq") {
        //aPS[iCurrentPoint].numBlocActions--;
        for (i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName == nameToDelete) {
                //now, if the blocAction[] is between 0 and 4, this code moves the next blocActions[] 1 position before
                if (i < 4) {
                    for (j = i; j < 4; j++) {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionName;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionModule;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionParam;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].VisibleFP;
                        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1]["@xsi:nil"] == "true") {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP;
                        } else {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionName;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionModule;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionParam;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].VisibleFP;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j]["@xsi:nil"];
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1]["@xsi:nil"] = "true";
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionName;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionModule;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionParam;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].VisibleFP;
                        }
                    }
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i]["@xsi:nil"] = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled;
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP;
                }
            }
        }
    }
}

function SearchAndDeleteActionPointPreSeq(nameToDelete) {
    aPS[iCurrentPoint].numBlocActions--;
    for (i = 0; i < 5; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName == nameToDelete) {
            //now, if the blocAction[] is between 0 and 4, this code moves the next blocActions[] 1 position before
            if (i < 4) {
                for (j = i; j < 4; j++) {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionModule;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionParam;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].VisibleFP;
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1]["@xsi:nil"] == "true") {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP;
                    } else {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionName;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionModule;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionParam;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].DefaultEnabled;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].VisibleFP;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j]["@xsi:nil"];
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[j + 1].VisibleFP;
                    }
                }
            } else {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i]["@xsi:nil"] = "true";
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP;
            }
        }
    }
}
function SearchAndDeleteActionPointPostSeq(nameToDelete) {
    aPS[iCurrentPoint].numBlocActions--;
    for (i = 0; i < 5; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName == nameToDelete) {
            //now, if the blocAction[] is between 0 and 4, this code moves the next blocActions[] 1 position before
            if (i < 4) {
                for (j = i; j < 4; j++) {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionModule;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionParam;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].VisibleFP;
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1]["@xsi:nil"] == "true") {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP;
                    } else {
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionName;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionModule;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].ActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].ActionParam;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].DefaultEnabled = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].DefaultEnabled;
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j].VisibleFP = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[j + 1].VisibleFP;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j]["@xsi:nil"];
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1]["@xsi:nil"] = "true";
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionName;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionModule;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].ActionParam;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].DefaultEnabled;
                        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[j + 1].VisibleFP;
                    }
                }
            } else {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i]["@xsi:nil"] = "true";
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled;
                delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP;
            }
        }
    }
}

function GetBlocActionObjectByActionName(namegiv) {
    if (currpanel.indexOf("Trigg") > -1) {
        iCurrentHook = currpanel.replace("Trigg", "");
        for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction.length; i++) {
            if (namegiv == o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName) {
                return(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i]);
            }
        }
    } else if (currpanel == "PreSeq") {
        for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction.length; i++) {
            if (namegiv == o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName) {
                return(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i]);
            }
        }
    } else if (currpanel == "PostSeq") {
        for (var i = 0; i < o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction.length; i++) {
            if (namegiv == o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName) {
                return(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i]);
            }
        }
    }
    return("notfound");
}

function GetDescriptionFromActionName(actionnamegiv) {
    for (var i = 0; i < arrayValue.length; i = i + 6) {
        if (arrayValue[i + 1] == actionnamegiv) {
            return(arrayValue[i + 3]);
        }
    }
    return("error");
}

function GetiBAByidSelectedActionItem(idcurrentselectedgiv) {
    currpanel = idcurrentselectedgiv.split("_")[0];
    idcurrentselectedgiv = idcurrentselectedgiv.split("_")[1].replace("SelectedActionItem", "");
    if (currpanel.indexOf("Trigg") > -1) {
        iCurrentHook = currpanel.replace("Trigg", "");
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions) {
            for (var i = 0; i < 5; i++) {
                if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName == idcurrentselectedgiv) {
                    iBA = i;
                    globaliBA = iBA;
                    return(iBA);
                } else {
                    iBA = 5;
                }
            }
        } else {
            iBA = 0;
            globaliBA = iBA;
            return(iBA);
        }
        globaliBA = iBA;
        return(iBA);
    } else if (currpanel == "PostSeq") {
        for (var i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName == idcurrentselectedgiv) {
                iBA = i;
                globaliBA = iBA;
                return(iBA);
            } else {
                iBA = 5;
            }
        }
        globaliBA = iBA;
        return(iBA);
    } else if (currpanel == "PreSeq") {
        for (var i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName == idcurrentselectedgiv) {
                iBA = i;
                globaliBA = iBA;
                return(iBA);
            } else {
                iBA = 5;
            }
        }
        globaliBA = iBA;
        return(iBA);
    }
}

function DeleteSelectedActionItem() {
    actionName = idCurrentSelectedActionItem.replace("SelectedActionItem", "");
    SearchAndDeleteActionPoint(actionName);
    alertify.success(translations.PPUP_REMOVED);
    if (document.getElementsByClassName("selecteditemactivat")[0]) {
        CurrentModName = document.getElementsByClassName("selecteditemactivat")[0].id;
        ClickOnModule(CurrentModName);
    }
    ActualizeHTMLSelectedActionsPanels();
}

function DeleteValueFromArray(arrNam, nameDelet) {
    for (i = 0; i < arrNam.length; i++) {
        arTemp = arrNam[i].split('- ')[1]; //here quits the ModuleName of the string
        if (arTemp == nameDelet) {
            arrNam.splice(i, 1);
        }
    }
}

function MouseOverTrigg(idg) {
    iCurrentHook = idg.replace("btrigg", "");
}

function AddTriggerToPoint() {
    idtr = GetNumOfActualTriggs();
    if (idtr < 8) {
        if (val != undefined) {
            valr = val.replace("ms", "");
        } else {
            valr = 0;
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].Anticipation = valr;
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].inUse = "true";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].reference = "End";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].mode = "Distance";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].Anticipation = 0;
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].Description = "trigg" + idtr;
        $("#addtrigbtn").remove();
        if (document.getElementById("triggsPlace")) {
            document.getElementById("triggsPlace").innerHTML += "<div id='btrigg" + idtr + "' oncontextmenu='MouseOverTrigg(this.id)' class='selectedtrigg' onclick='ClickOnBTrigg(this.id);'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].Description + "</div>";
            document.getElementById("triggsPlace").innerHTML += "<div id='addtrigbtn' class='linkrecuadre' onclick='AddTriggerToPoint();'>+</div>";
        }
        act = [5];
        for (i = 0; i < 5; i++) {
            act[i] = {
                "@xsi:nil": "true",
            };
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr].actions = {
            BlocAction: act
        };
        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[idtr]["@xsi:nil"];
        iCurrentHook = idtr;
        if (document.getElementsByClassName("selectedtriggactivat")[0]) {
            document.getElementsByClassName("selectedtriggactivat")[0].className = "selectedtrigg";
        }
        if (document.getElementById("btrigg" + iCurrentHook)) {
            document.getElementById("btrigg" + iCurrentHook).className = "selectedtriggactivat";
        }
        val = 0;
        val = val + "px";
        if (document.getElementById("trigg0")) {
            document.getElementById("trigg0").style.left = val;
        }
        val = 0;
        val = val + "mm";
        if (document.getElementById("trigg0")) {
            document.getElementById("trigg0").innerHTML = "<br><br><b>" + val + "</b>";
            PositionTriggFromValue('0');
            TriggerValue('trigg0');
            PaintTriggerOptions();
            PaintTriggerLine();
            jsPlumb.reset();
            AddPlumbPropertiesToTrigg();
            PositionTriggFromValue('0');
            TriggerValue('trigg0');
            ShowBlocActionsSelectedFromTrigger();
        }
        alertify.success(translations.PPUP_NEW_TRIGGER);

        //unselect boxes
        if (document.getElementsByClassName("selecteditemactivat")[0]) {
            document.getElementsByClassName("selecteditemactivat")[0].className = "selecteditem";
        }
        if (document.getElementById("nameModulesActionsBox")) {
            document.getElementById("nameModulesActionsBox").innerHTML = "";
        }
        if (document.getElementById("auxpannel")) {
            $("#auxpannel").remove();
        }
    } else {
        alertify.error(translations.PPUP_MAX_TRIGGS);
    }
}

function GetNumOfActualTriggs() {
    for (var i = 0; i < 8; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i]["@xsi:nil"] == "true") {
            return(i);
        }
    }
}

function RenameCurrentTrigg() {
    oldvaluetext = document.getElementById('btrigg' + iCurrentHook).innerHTML;
    title = translations.ACTIONS_RENAME_TRIGG;
    var pAnswer = prompt(title, oldvaluetext);
    if (pAnswer == true) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Description = value;
        iCurrentHookAUX = JSON.parse(JSON.stringify(iCurrentHook));
        ActualizeNameTriggerButtons();
        document.getElementById('btrigg0').className = 'selectedtrigg';
        document.getElementById('btrigg' + iCurrentHookAUX).className = 'selectedtriggactivat';
        ShowBlocActionsSelectedFromTrigger();
        alertify.notify(translations.PPUP_TRIGER_RENAMED);
    } else {
        alertify.warning(translations.PPUP_RENAME_CANCELLED);
    }
}

function RenameContextTrigg() {
    var oldNameTrigg = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Description;
    var titlePrompt = translations.ACTIONS_RENAME_TRIGG;
    var pAnswer = prompt(titlePrompt, oldNameTrigg);
    if (pAnswer != null) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Description = pAnswer;
        iCurrentHookAUX = JSON.parse(JSON.stringify(iCurrentHook));
        document.getElementById("Trigg" + iCurrentHook + "_Description").innerHTML = pAnswer;
        alertify.notify(translations.PPUP_TRIGER_RENAMED);
    } else {
        alertify.warning(translations.PPUP_RENAME_CANCELLED);
    }
}

function DelCurrentTrigg() {
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.splice(iCurrentHook, 1);
    actbinaux = {
        ["@xsi:nil"]: "true"
    };
    var cloneOfactbinaux = JSON.parse(JSON.stringify(actbinaux));
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.push(cloneOfactbinaux);
    if (CountActionBindUsed(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind) < 8) {
        PaintTriggerButtons();
    } else {
        $("#btrigg0").remove();
        OnClickPoint_Actions("item" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint]["@Id"]);
        CreateDisablingPannelActions();
    }
    PositionTriggFromValue(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation);
}

function CountUsedBlocActionsFromBlocAction(ba) {
    var exist, nBA;
    exist = "no";
    nBA = 5;
    for (var i = ba.length - 1; i >= 0; i--) {
        if (ba[i]["@xsi:nil"] == "true") {
            nBA = i;
        }
    }
    return(nBA);
}

function GetActionFrommaObj(actionName) {
    for (var i = 0; i < maObj.length; i++) {
        for (var j = 0; j < maObj[i].modActions.length; j++) {
            if (maObj[i].modActions[j].actName == actionName) {
                return(maObj[i].modActions[j]);
            }
        }
    }
    return("not found");
}

function AddActionToBlocAction(blActiongiv, nameMod, nameAction, idBlActParam) {
    var exist;
    var nBA;
    exist = "no";
    nBA = 5;
    for (var i = blActiongiv.length - 1; i >= 0; i--) {
        if ((blActiongiv[i].ActionName == nameAction)) {
            exist = "yes";
        }
        if (blActiongiv[i]["@xsi:nil"] == "true") {
            nBA = i;
        }
    }
    globaliBA = nBA;
    if ((exist == "no") && (nBA < 5)) {
        blActiongiv[nBA].ActionName = nameAction;
        blActiongiv[nBA].ActionModule = nameMod;
        blActiongiv[nBA].ActionParam = idBlActParam;
        blActiongiv[nBA].DefaultEnabled = "true";
        blActiongiv[nBA].VisibleFP = "true";
        delete blActiongiv[nBA]["@xsi:nil"];
    } else if (nBA >= 5) {
        alertify.error(translations.ACTIONS_MAX_5_ACTIONS);
    } else if (exist == "yes") {
        alertify.warning(translations.ACTIONS_CANT_REPEAT_ACTION);
    }
}

function CountUsedTriggs(ab) {
    var numUsedTriggs;
    numUsedTriggs = 0;
    for (var i = 0; i < ab.length; i++) {
        if (ab[i].Anticipation) {
            numUsedTriggs++;
        }
    }
    return(numUsedTriggs);
}

function CountUsedActions(ba) {
    var numUsedActions;
    numUsedActions = 0;
    for (var i = 0; i < ba.length; i++) {
        if (ba[i].ActionName) {
            numUsedActions++;
        }
    }
    return(numUsedActions);
}

function ExistIn_maObj(actnamegiv) {
    var match;
    match = "false";
    for (var i = 0; i < maObj.length; i++) {
        for (var j = 0; j < maObj[i].modActions.length; j++) {
            if (maObj[i].modActions[j].actName == actnamegiv) {
                match = "true";
            }
        }
    }
    return(match);
}

function AddNewTrigg() {
    //create new trigg
    var itrigg = GetNumOfActualTriggs();
    if (itrigg < 8) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].inUse = "true";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].reference = "End";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].mode = "Distance";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].Anticipation = "0";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].Description = "trigg" + itrigg;
        act = [5];
        for (var i = 0; i < 5; i++) {
            act[i] = {
                "@xsi:nil": "true",
            };
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].actions = {
            BlocAction: act
        };
        delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg]["@xsi:nil"];
        $("#AddNewTriggBtn").remove();
        var htmlcontent = document.getElementById("PrePostTriggsPanel").innerHTML;
        htmlcontent += "	<button id='Trigg" + itrigg + "_btn' onclick='CollapsePanel(this.id)' oncontextmenu='OnContextMenuTrigg(this.id)' class='panelBtnUnfolder withOptionsMargin'><b id='Trigg" + itrigg + "_Description'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].Description + "</b>";
        htmlcontent += " - ";
        htmlcontent += "<span class='' id='Anticipation" + itrigg + "'>"; //class='own-badge w3-blue-grey'
        htmlcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].Anticipation;
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].mode == "Distance") {
            htmlcontent += "mm";
        } else {
            htmlcontent += "ms";
        }
        htmlcontent += "</span>";
        htmlcontent += " " + translations.ACTIONS_FROM + " ";
        htmlcontent += "<span class='' id='reference" + itrigg + "'>";
        htmlcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].reference;
        htmlcontent += "</span>";
        htmlcontent += "";
        htmlcontent += "	</button>";
        htmlcontent += "<div class='w3-dropdown-hover' id='Trigg" + itrigg + "_dropdownOptions'>";
        htmlcontent += "	<button id='Trigg" + itrigg + "_option_btn' onmouseover='OnMouseOverTriggOptions(this.id)' class='panelBtnOptions'>";
        htmlcontent += "v";
        htmlcontent += "	</button>";
        htmlcontent += "<div class='w3-dropdown-content triggoptions' id='Trigg" + itrigg + "_option_btn_content'>";
        //here trigg options content
        htmlcontent += "</div>";
        htmlcontent += "</div>";
        htmlcontent += "<div id='Trigg" + itrigg + "' ondrop='dropAction(event, this.id)' ondragover='PanelAllowDropAction(event, this.id)' class='w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show'>";
        htmlcontent += BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[itrigg].actions.BlocAction, "Trigg" + itrigg);
        htmlcontent += "</div>";
        //trigg adder
        htmlcontent += "	<button id='AddNewTriggBtn' onclick='AddNewTrigg()' class='panelBtnUnfolder'><b>+</b>";
        htmlcontent += "	</button>";
        document.getElementById("PrePostTriggsPanel").innerHTML = htmlcontent;
    } else {
        alertify.error(translations.ACTIONS_MAX_8_TRIGGS);
    }
}
/*################################################################
 rapid trigger functions
 ################################################################*/

/**
 * gets and paint in html
 */
function GetActionModulesNameFromRapid() {
    xmlMod = LoadModulesFromRapid("/rw/rapid/modules?task=T_ROB1"); /*"http://" + url.ip +*/
    modName = xmlMod.getElementsByClassName("name");

    arrayModNames = "";
    document.getElementById("nameModulesBox_Sequent").innerHTML = "";
    document.getElementById("nameModulesBox_Trigg").innerHTML = "";
    for (i = 0; i < modName.length; i++) {
        thisModName = modName[i].childNodes[0].nodeValue;
        arrayModNames += thisModName + ",";
        arrayModNames = arrayModNames.split(",");
        if (thisModName.indexOf("Actions") > -1) {
            document.getElementById("nameModulesBox_Sequent").innerHTML += "<div id=" + thisModName + " class='selecteditem' onclick='ClickOnModule(&#39;" + thisModName + "&#39;);'>" + thisModName + "</div>";
            document.getElementById("nameModulesBox_Trigg").innerHTML += "<div id=" + thisModName + " class='selecteditem' onclick='ClickOnModule(&#39;" + thisModName + "&#39;);'>" + thisModName + "</div>";
        }
    }
}

/**
 * gets array raw data for each module in rapid
 */
function ChargeArrayFromModuleRapid() {
    for (h = 0; h < arrayModNames.length - 1; h++) {
        dir2 = "/rw/rapid/symbol/data/RAPID/T_ROB1/" + arrayModNames[h] + "/" + arrayModNames[h] + "Array"; /*"http://" + url.ip + */
        xmlMod2 = LoadModulesFromRapid(dir2);
        rawDataFromArrayModule[h] = xmlMod2.getElementsByClassName("value");
    }
}

/**
 * mira si el nom existeix en les funcions de rapid
 */
function ExistInRapidArray(actName) {
    var match;
    match = "false";
    for (h = 0; h < arrayModNames.length - 1; h++) {
        if (rawDataFromArrayModule[h].length > 0) {
            arrayValue2 = "";
            arrayValue2 += rawDataFromArrayModule[h][0].childNodes[0].nodeValue;
            arrayValue2 = arrayValue2.split(",");
            for (l = 0; l < arrayValue2.length; l++) {
                arrayValue2[l] = arrayValue2[l].replace("[", "");
                arrayValue2[l] = arrayValue2[l].replace("[", "");
                arrayValue2[l] = arrayValue2[l].replace("]", "");
                arrayValue2[l] = arrayValue2[l].replace("]", "");
                arrayValue2[l] = arrayValue2[l].replace("&#34;", "");
                arrayValue2[l] = arrayValue2[l].replace(/"/g, '');
            }
            if (rawDataFromArrayModule.length > 0) {
                if (arrayValue2.length > 0) {
                    for (j = 0; j < arrayValue2.length; j++) {
                        if (arrayValue2[j] == actName) {
                            match = "true";
                        } else {

                        }
                    }
                }
            }
        }
    }
    if ((match == 'false') && (timesRechargingArrayFromRapid < 1)) {
        ChargeArrayFromModuleRapid();
        timesRechargingArrayFromRapid++;
        match = ExistInRapidArray(actName);
    }
    return(match);
}

/*################################################################
 visual trigger functions
 ################################################################*/

function PaintTabsActions() {
    document.getElementById("actionsTabsPlace").innerHTML += "<div id='bpresec' class='selectedseq' onclick='ClickOnBPreSeq(this.id);'>PreSeq.</div> ";
    document.getElementById("actionsTabsPlace").innerHTML += "<div id='bpostsec' class='selectedseq' onclick='ClickOnBPostSeq(this.id);'>PostSeq.</div> ";
    document.getElementById("actionsTabsPlace").innerHTML += "<div id='btriggstab' class='selectedseqactivat' onclick='ClickOnBTriggsTab(this.id);'>Triggs</div> ";
    document.getElementById("actionsTabsPlace").innerHTML += "<div id='verticalSpaceBetweenTabs' class='verticalSpaceBetweenTabs'>" + translations.TXT_TRIGGER_TAB + "</div>";
    if ((iCurrentPoint != undefined) && (iCurrentPoint != 'newpoint') && (o.BlocAssembly.AllPoints.ProcessPoint)) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[0].Description != undefined) {
            document.getElementById("triggsPlace").innerHTML += "<div id='btrigg0' oncontextmenu='MouseOverTrigg(this.id)' class='selectedtriggactivat' onclick='ClickOnBTrigg(this.id);'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[0].Description + "</div>";
        }
    }
}

function ShowActions() {
    if (idCurrentBloc != undefined) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences) {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].PointsReferences.int[0]) {
                idCurrentTab = "Actions";
                iCurrentHook = 0;
                htmlActions();
                HTMLactions();
            } else {
                alertify.warning(translations.ACTIONS_NO_EXISTING_POINTS);
            }
        } else {
            alertify.warning(translations.ACTIONS_NO_EXISTING_POINTS);
        }
    } else {
        alertify.warning(translations.PPUP_SELECT_A_BLOC);
    }
}

function FoldSequentialTriggsPanels() {
    if ((idCurrentBloc != undefined) && (MenuOption == 'Actions') && (iCurrentPoint != undefined)) {
        if (document.getElementsByClassName("w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show").length > 0) {
            while (document.getElementsByClassName("w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show").length > 0) {
                document.getElementsByClassName("w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show")[0].className = "w3-accordion-content w3-container own-borderradius-bottom own-gray";
            }
            alertify.notify(translations.PPUP_ACTIONS_PANELS_FOLDED);
        } else {
            PaintModulesAndActionsAccordion();
            PaintSequentialTriggsPanels();
            alertify.notify(translations.PPUP_ACTIONS_PANELS_UNFOLDED);
        }
    }
}

/**
 * show the flowchart of Points from the xml in the Actions page
 */
function PaintPointsActions() {
    var nom, item, topMargin;
    topMargin = 60; //initial value of topMargin for the first box. This value will increment +50px for each box of the jsplumb.
    var x = o.BlocAssembly.AllPoints.ProcessPoint;
    document.getElementById("diagramcontainer").innerHTML = "";
    for (i = 0; i < x.length; i++) {
        esdelbloc = CompareProcessPointWithPointReferencesBloc(x[i]["@Id"]); //compara l'id del ProcessPoint que vaig a pintar, amb els ids del PointReferences del Bloc on estem. Si està, retorna true
        if (esdelbloc == true) {
            nom = "nom" + i;
            id = x[i]["@Id"];
            item = "item" + id;
            document.getElementById("diagramcontainer").innerHTML += "<div id='" + item + "' class='itemActions' style='top:" + topMargin + "px;' onclick='OnClickPoint_Actions(this.id)' ><strong><p id='" + nom + "'></p></strong></div>";
            document.getElementById(nom).innerHTML = x[i].Alias;
            topMargin += 50;
        }
    }
}

function CreateDisablingPannelActions() {
    if (CountActionBindUsed(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind) == 8) {
        $("#auxpannel").remove();
        oldhtmlaux = JSON.parse(JSON.stringify(document.getElementsByClassName('frameActionsSubTriggTabs')[0].innerHTML));
        pwidth = document.getElementsByClassName("frameActionsSubTriggTabs")[0].offsetWidth - 10;
        pheight = document.getElementsByClassName("frameActionsSubTriggTabs")[0].offsetHeight;
        ptop = document.getElementsByClassName("frameActionsSubTriggTabs")[0].offsetTop;
        pleft = document.getElementsByClassName("frameActionsSubTriggTabs")[0].offsetLeft;
        oldhtmlaux += "<div id='auxpannel' style='background:rgba(255,255,255,0.7); z-index:2000; position:absolute;width:" + pwidth + "px;height:" + pheight + "px;top:" + ptop + "px;text-align:center;font-weight:bold;font-size:24px;color:#79899E;'><br><br><br><br><br>Add new trigg to point to select Actions</div>";
        document.getElementsByClassName('frameActionsSubTriggTabs')[0].innerHTML = "";
        document.getElementsByClassName('frameActionsSubTriggTabs')[0].innerHTML = oldhtmlaux;
    } else {
        if (document.getElementById("auxpannel")) {
            $("#auxpannel").remove();
        }
    }
    if ((document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") || (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec")) {
        if (document.getElementById("auxpannel")) {
            $("#auxpannel").remove();
        }
    }
}

function ShowBlocActionsSelectedFromTrigger() {//posa els noms d' Action que hi ha marcats en el trigger, i si no estan al codi del rapid, els posa de color vermell
    document.getElementById("selectedActions").innerHTML = "";
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "btriggstab") {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction) {
                for (i = 0; i < 5; i++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName != undefined) {
                        exists = ExistInRapidArray(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName);
                        if (exists == "false") {//paint the ActionName color red
                            actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam;
                            gua = "<div class='SelectedActionItem' actparam='" + actparam + "' style='color:red;' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName + "'>"
                            gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionModule;
                            gua += " - ";
                            gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName;
                            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam != null)) {
                                gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam + "</span>";
                            }
                            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].VisibleFP == "true") {
                                gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                            } else {
                                gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                            }
                            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].DefaultEnabled == "true") {
                                gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                            } else {
                                gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                            }
                            gua += "</div>";
                            document.getElementById("selectedActions").innerHTML += gua;
                        } else {
                            actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam;
                            gua = "<div class='SelectedActionItem'  actparam='" + actparam + "' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName + "'>"
                            gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionModule;
                            gua += " - ";
                            gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName;
                            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam != null)) {
                                gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam + "</span>";
                            }
                            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].VisibleFP == "true") {
                                gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                            } else {
                                gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                            }
                            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].DefaultEnabled == "true") {
                                gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                            } else {
                                gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                            }
                            gua += "</div>";
                            gua += "</div>";
                            document.getElementById("selectedActions").innerHTML += gua;
                        }
                    }
                }
            }
        }
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec") {
        document.getElementById("selectedActions").innerHTML = "";
        for (i = 0; i < 5; i++) {
            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != undefined)) {
                exists = ExistInRapidArray(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName);
                if (exists == "false") {//paint the ActionName color red
                    actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam;
                    gua = "<div class='SelectedActionItem' actparam='" + actparam + "' style='color:red;' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName + "'>"
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
                    gua += " - ";
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
                    if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam != null)) {
                        gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam + "</span>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP == "true") {
                        gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled == "true") {
                        gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    }
                    gua += "</div>";
                    document.getElementById("selectedActions").innerHTML += gua;
                } else {
                    actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam;
                    gua = "<div class='SelectedActionItem' actparam='" + actparam + "' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName + "'>"
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
                    gua += " - ";
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
                    if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam != null)) {
                        gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam + "</span>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP == "true") {
                        gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled == "true") {
                        gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    }
                    gua += "</div>";
                    gua += "</div>";
                    document.getElementById("selectedActions").innerHTML += gua;
                }
            }
        }
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") {
        document.getElementById("selectedActions").innerHTML = "";
        for (i = 0; i < 5; i++) {
            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != undefined)) {
                exists = ExistInRapidArray(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName);
                if (exists == "false") {//paint the ActionName color red
                    actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam;
                    gua = "<div class='SelectedActionItem' actparam='" + actparam + "' style='color:red;' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName + "'>"
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
                    gua += " - ";
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
                    if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam != null)) {
                        gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam + "</span>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP == "true") {
                        gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled == "true") {
                        gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    }
                    gua += "</div>";
                    document.getElementById("selectedActions").innerHTML += gua;
                } else {
                    actparam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam;
                    gua = "<div class='SelectedActionItem' actparam='" + actparam + "' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='SelectedActionItem" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName + "'>"
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
                    gua += " - ";
                    gua += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
                    if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam != null)) {
                        gua += "<span class='actionParamBadge'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam + "</span>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP == "true") {
                        gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                    }
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled == "true") {
                        gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    } else {
                        gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                    }
                    gua += "</div>";
                    gua += "</div>";
                    document.getElementById("selectedActions").innerHTML += gua;
                }
            }
        }
    }
}

function ShowBlocActionsFromPreSeq() {
    document.getElementById("selectedActions").innerHTML = "";
    for (i = 0; i < 5; i++) {
        if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != undefined)) {
            document.getElementById("selectedActions").innerHTML += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
            document.getElementById("selectedActions").innerHTML += " - ";
            document.getElementById("selectedActions").innerHTML += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
            document.getElementById("selectedActions").innerHTML += "<br>";
        }
    }
}

function ShowBlocActionsFromPostSeq() {
    document.getElementById("selectedActions").innerHTML = "";
    for (i = 0; i < 5; i++) {
        if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != undefined)) {
            document.getElementById("selectedActions").innerHTML += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
            document.getElementById("selectedActions").innerHTML += " - ";
            document.getElementById("selectedActions").innerHTML += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
            document.getElementById("selectedActions").innerHTML += "<br>";
        }
    }
}

function WriteActionsNamesFromArray(arNam, whereId) {//from the array from the RAPID code
    document.getElementById("selectedActions").innerHTML = "";
    for (i = 0; i < arNam.length; i++) {
        document.getElementById("selectedActions").innerHTML += arNam[i] + "<br>";
    }
}

function PaintTriggerButtons() {
    document.getElementById("actionsTabsPlace").innerHTML = "";
    document.getElementById("triggsPlace").innerHTML = "";
    PaintTabsActions();
    idtr = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.length;
    for (i = 1; i < idtr; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i]["@xsi:nil"] != "true") {
            document.getElementById("triggsPlace").innerHTML += "<div id='btrigg" + i + "' class='selectedtrigg' oncontextmenu='MouseOverTrigg(this.id)' onclick='ClickOnBTrigg(this.id);'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].Description + "</div>";
        }
    }
    document.getElementById("triggsPlace").innerHTML += "<div id='addtrigbtn' class='linkrecuadre' onclick='AddTriggerToPoint();'>+</div>";
    PaintTriggerLine();
    PaintTriggerOptions();
}

function ActualizeNameTriggerButtons() {
    document.getElementById("actionsTabsPlace").innerHTML = "";
    document.getElementById("triggsPlace").innerHTML = "";
    PaintTabsActions();
    idtr = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.length;
    for (i = 1; i < idtr; i++) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i]["@xsi:nil"] != "true") {
            document.getElementById("triggsPlace").innerHTML += "<div id='btrigg" + i + "' class='selectedtrigg' oncontextmenu='MouseOverTrigg(this.id)' onclick='ClickOnBTrigg(this.id);'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].Description + "</div>";
        }
    }
    document.getElementById("triggsPlace").innerHTML += "<div id='addtrigbtn' class='linkrecuadre' onclick='AddTriggerToPoint();'>+</div>";
}

function PaintTriggerLine() {
    document.getElementById("divtriggline").innerHTML = "";
    trigli = "";
    anticipation = 0;
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        anticipation = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation;
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Distance") {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference == "Start") {
                trigli += "    			<div id='triggInit' class='itemtrigglimit' style='left:0px'>";
                trigli += "    			</div>";
                trigli += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
                trigli += "    			</div>";
                trigli += "    			<div id='triggFin' class='itemtrigglimitinvisible' style='left:350px; z-index: 2;'>";
                trigli += "    			</div>";
            } else {
                anticipation = 1000 - anticipation;
                trigli += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
                trigli += "    			</div>";
                trigli += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
                trigli += "    			</div>";
                trigli += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
                trigli += "    			</div>";
            }
        } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Time") {
            anticipation = 500 - anticipation;
            trigli += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
            trigli += "    			</div>";
            trigli += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
            trigli += "    			</div>";
            trigli += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
            trigli += "    			</div>";
        } else {
            trigli += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
            trigli += "    			</div>";
            trigli += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
            trigli += "    			</div>";
            trigli += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
            trigli += "    			</div>";
        }
    } else {
        trigli += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
        trigli += "    			</div>";
        trigli += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
        trigli += "    			</div>";
        trigli += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
        trigli += "    			</div>";
    }

    document.getElementById("divtriggline").innerHTML = trigli;
    AddPlumbPropertiesToTrigg();
}

function AddPlumbPropertiesToTrigg() {
    jsPlumb.ready(function () {
        var tstyle = {/* style for the connections of the flowchart */
            connector: ["Straight"],
            paintStyle: {
                strokeStyle: "#5b9ada",
                lineWidth: 5
            },
            endpoint: ["Rectangle", {width: 1, height: 1}],
        };
        jsPlumb.addEndpoint("triggInit", {
            anchors: ["Right"]
        }, tstyle);
        jsPlumb.addEndpoint("triggFin", {
            anchors: ["Left"]
        }, tstyle);
        jsPlumb.draggable("trigg0", {
            axis: "x",
            containment: "parent"
        });
        jsPlumb.connect({
            source: "triggInit",
            target: "triggFin",
            anchor: ["Right", "Left"],
        }, tstyle);
    });
}

function PaintTriggerOptions() {
    document.getElementById("caixatriggoptions").innerHTML = "";
    triggopt = "<div class='flipswitchUnits' onclick='OnswTriggerUnitsClick()'>";
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == 'Time') {
            triggopt += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs'>";
        } else {
            triggopt += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs' checked>";
        }
    } else {
        triggopt += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs' checked>";
    }
    triggopt += "    <label class='flipswitchUnits-label' for='fs'>";
    triggopt += "        <div class='flipswitchUnits-inner'></div>";
    triggopt += "        <div class='flipswitchUnits-switch'></div>";
    triggopt += "    </label>";
    triggopt += "</div>";
    triggopt += "<div id='idDivSwTriggerDistMode' class='flipswitchUnitsDistanceMode' onclick='OnswTriggerDistanceModeClick()'>";
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference == 'Start') {
            triggopt += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode'>";
        } else {
            triggopt += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode' checked>";
        }
    } else {
        triggopt += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode' checked>";
    }
    triggopt += "    <label class='flipswitchUnitsDistanceMode-label' for='fsDistMode'>";
    triggopt += "        <div class='flipswitchUnitsDistanceMode-inner'></div>";
    triggopt += "        <div class='flipswitchUnitsDistanceMode-switch'></div>";
    triggopt += "    </label>";
    triggopt += "</div>";
    document.getElementById("caixatriggoptions").innerHTML = triggopt;
    if (document.getElementById("swTriggerUnits").checked == true) {
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "1";
    } else {
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "0.4";
    }
}

function ActualizeSWTrigger() {
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Distance") {
        document.getElementById("swTriggerUnits").checked = true;
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "1";
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference == "End") {
            document.getElementById("swTriggerDistMode").checked = true;
        } else {
            document.getElementById("swTriggerDistMode").checked = false;
        }
    } else {
        document.getElementById("swTriggerUnits").checked = false;
        document.getElementById("idDivSwTriggerDistMode").style.opacity = '0.4';
    }
}

function PaintModulesAndActionsAccordion() {
    var htmlcontent = "";
    for (var i = 0; i < maObj.length; i++) {
        htmlcontent += "<button id='" + maObj[i].modName + "_btn' onclick='CollapsePanel(this.id)' class='w3-btn-block w3-left-align own-blue1'><b>" + maObj[i].modName + "</b></button>";
        htmlcontent += "<div id='" + maObj[i].modName + "' class='w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show'>";
        for (var j = 0; j < maObj[i].modActions.length; j++) {
            htmlcontent += "<div draggable='true' id='" + maObj[i].modName + "_" + maObj[i].modActions[j].actName + "' ondragstart='DragStartAction(event, this.id)' ondragend='DragEndAction(event, this.id)' class='selecteditem'>" + maObj[i].modActions[j].actName + "</div>";
        }
        htmlcontent += "</div>"; // </accordion container
    }
    document.getElementById("modulesAccordion").innerHTML = htmlcontent;
}

function ActualizeHTMLSelectedActionsPanels() {
    if (currpanel == "PreSeq") {
        document.getElementById(currpanel).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction, currpanel);
    } else if (currpanel == "PostSeq") {
        document.getElementById(currpanel).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction, currpanel);
    } else {
        document.getElementById(currpanel).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction, currpanel);
    }
}

function PaintSequentialTriggsPanels() {
    var htmlcontent = "";
    //PreSequential
    htmlcontent += "	<button id='PreSeq_btn' onclick='CollapsePanel(this.id)' class='panelBtnUnfolder'><b>PreSequential</b>";
    htmlcontent += "	</button>";
    htmlcontent += "<div id='PreSeq' ondrop='dropAction(event, this.id)' ondragover='PanelAllowDropAction(event, this.id)' class='w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show'>";
    htmlcontent += BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction, "PreSeq");
    htmlcontent += "</div>";
    //PostSequential
    htmlcontent += "	<button id='PostSeq_btn' onclick='CollapsePanel(this.id)' class='panelBtnUnfolder'><b>PostSequential</b>";
    htmlcontent += "	</button>";
    htmlcontent += "<div id='PostSeq' ondrop='dropAction(event, this.id)' ondragover='PanelAllowDropAction(event, this.id)' class='w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show'>";
    htmlcontent += BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction, "PostSeq");
    htmlcontent += "</div>";
    for (var i = 0; i < CountUsedTriggs(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind); i++) {
        htmlcontent += "	<button id='Trigg" + i + "_btn' onclick='CollapsePanel(this.id)' oncontextmenu='OnContextMenuTrigg(this.id)' class='panelBtnUnfolder withOptionsMargin'><b id='Trigg" + i + "_Description'>" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].Description + "</b>";
        htmlcontent += " - ";
        htmlcontent += "<span class='' id='Anticipation" + i + "'>"; //class='own-badge w3-blue-grey'
        htmlcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].Anticipation;
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].mode == "Distance") {
            htmlcontent += "mm";
        } else {
            htmlcontent += "ms";
        }
        htmlcontent += "</span>";
        htmlcontent += " from ";
        htmlcontent += "<span class='' id='reference" + i + "'>";
        htmlcontent += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].reference;
        htmlcontent += "</span>";
        htmlcontent += "";
        htmlcontent += "	</button>";
        htmlcontent += "<div class='w3-dropdown-hover' id='Trigg" + i + "_dropdownOptions'>";
        htmlcontent += "	<button id='Trigg" + i + "_option_btn' onmouseover='OnMouseOverTriggOptions(this.id)' class='panelBtnOptions'>";
        htmlcontent += "v";
        htmlcontent += "	</button>";// </btn image
        htmlcontent += "<div class='w3-dropdown-content triggoptions' id='Trigg" + i + "_option_btn_content'>";
        htmlcontent += "</div>";
        htmlcontent += "</div>";
        htmlcontent += "<div id='Trigg" + i + "' ondrop='dropAction(event, this.id)' ondragover='PanelAllowDropAction(event, this.id)' class='w3-accordion-content w3-container own-borderradius-bottom own-gray w3-show'>";
        htmlcontent += BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction, "Trigg" + i);
        htmlcontent += "</div>";
    }
    htmlcontent += "	<button id='AddNewTriggBtn' onclick='AddNewTrigg()' class='panelBtnUnfolder'><b>+</b>";
    htmlcontent += "	</button>";
    document.getElementById("PrePostTriggsPanel").innerHTML = htmlcontent;
    MakeSortable();
}

function MakeSortable() {
    // make sortable
    //var elPreSeq = document.getElementById('PreSeq');
    var sortable = Sortable.create(document.getElementById('PreSeq'), {
        animation: 150,
        onUpdate: function (/**Event*/evt) {
            var itemEl = JSON.parse(JSON.stringify(evt.item.id));
            GetNewArrangment(itemEl, "PreSeq", evt.oldIndex, evt.newIndex);
        },
    });
    //var elPostSeq = document.getElementById('PostSeq');
    var sortable = Sortable.create(document.getElementById('PostSeq'), {
        animation: 150,
        onUpdate: function (/**Event*/evt) {
            var itemEl = JSON.parse(JSON.stringify(evt.item.id));
            GetNewArrangment(itemEl, "PostSeq", evt.oldIndex, evt.newIndex);
        },
    });
    for (var i = 0; i < CountUsedTriggs(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind); i++) {
        //var elPostSeq = document.getElementById('Trigg'+i);
        var iActual = JSON.parse(JSON.stringify(i));
        var sortable = Sortable.create(document.getElementById('Trigg' + i), {
            animation: 150,
            onUpdate: function (/**Event*/evt) {
                var itemEl = evt.item.id;
                GetNewArrangment(itemEl, "Trigg" + iActual, evt.oldIndex, evt.newIndex);
            },
        });
    }
}

function ActualizeTriggOptionsBtnDescription() {
    document.getElementById("reference" + iCurrentHook).innerHTML = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference;
    var aux = "";
    aux += o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation;
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Distance") {
        aux += "mm";
    } else {
        aux += "ms";
    }
    document.getElementById("Anticipation" + iCurrentHook).innerHTML = aux;
}
function TriggOptions(idgiv) {
    idgiv = idgiv.replace("_optionbtn", "");
    alertify.notify(idgiv);
}

function BlocActionToHTML(ba, currentPanel) {
    var gua = "";
    for (var i = 0; i < ba.length; i++) {
        if ((ba[i].ActionName != "") && (ba[i].ActionName != undefined)) {
            exists = ExistIn_maObj(ba[i].ActionName);
            if (exists == "false") {//paint the ActionName color red

                actparam = ba[i].ActionParam;
                gua += "<div class='SelectedActionItem' currpanel='" + currentPanel + "' actparam='" + actparam + "' style='color:red;' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='" + currentPanel + "_SelectedActionItem" + ba[i].ActionName + "'>";
                gua += ba[i].ActionModule;
                gua += " - ";
                gua += ba[i].ActionName;
                if ((ba[i].ActionParam != "") && (ba[i].ActionParam != null)) {
                    gua += "<span class='actionParamBadge'>" + ba[i].ActionParam + "</span>";
                }
                if (ba[i].VisibleFP == "true") {
                    gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                } else {
                    gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                }
                if (ba[i].DefaultEnabled == "true") {
                    gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                } else {
                    gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                }
                gua += "</div></div>";
            } else {
                actparam = ba[i].ActionParam;
                gua += "<div class='SelectedActionItem' currpanel='" + currentPanel + "' actparam='" + actparam + "' oncontextmenu='OnContextMenuSelectedActionItem(this.id)' id='" + currentPanel + "_SelectedActionItem" + ba[i].ActionName + "'>";
                gua += ba[i].ActionModule;
                gua += " - ";
                gua += ba[i].ActionName;
                if ((ba[i].ActionParam != "") && (ba[i].ActionParam != null)) {
                    gua += "<span class='actionParamBadge'>" + ba[i].ActionParam + "</span>";
                }
                if (ba[i].VisibleFP == "true") {
                    gua += "<div class='imgsactionselected'><img id='eyeicon' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                } else {
                    gua += "<div class='imgsactionselected'><img id='eyeicondisabled' src='appImages/imgtrans.png' onclick='OnActionVisibleClick(this.parentElement.parentElement.id)'/>";
                }
                if (ba[i].DefaultEnabled == "true") {
                    gua += "<img id='enabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                } else {
                    gua += "<img id='disabledicon' src='appImages/imgtrans.png' onclick='OnActionEnableClick(this.parentElement.parentElement.id)'/>";
                }
                gua += "</div></div>";
            }
        }
    }
    return(gua);
}

function OnMouseOverTriggOptions(idgiv) {
    // paints html trigg options when mouse over options button unfolder
    iCurrentHook = idgiv.replace("_option_btn", "").replace("Trigg", "");
    //first, empty all the other triggs options places in html
    for (var i = 0; i < document.getElementsByClassName("w3-dropdown-content triggoptions").length; i++) {
        document.getElementsByClassName("w3-dropdown-content triggoptions")[i].innerHTML = "";
    }
    var triggopt = "";
    document.getElementById(idgiv + "_content").innerHTML = triggopt;
    triggopt += TriggOptionsToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]);
    document.getElementById(idgiv + "_content").innerHTML = triggopt;
    AddPlumbPropertiesToTrigg();
    PositionTriggFromValue(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation);
    if (document.getElementById("swTriggerUnits").checked == false) {
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "0.4";
    }
}
function TriggOptionsToHTML(ab) {
    var aux = "";
    //TRIGGLINE
    aux += "    		<div id='divtriggline' class='caixatriggline'>";
    anticipation = 0;
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        anticipation = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation;
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Distance") {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference == "Start") {
                aux += "    			<div id='triggInit' class='itemtrigglimit' style='left:0px'>";
                aux += "    			</div>";
                aux += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
                aux += "    			</div>";
                aux += "    			<div id='triggFin' class='itemtrigglimitinvisible' style='left:350px; z-index: 2;'>";
                aux += "    			</div>";
            } else {
                anticipation = 1000 - anticipation;
                aux += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
                aux += "    			</div>";
                aux += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
                aux += "    			</div>";
                aux += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
                aux += "    			</div>";
            }
        } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Time") {
            anticipation = 500 - anticipation;
            aux += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
            aux += "    			</div>";
            aux += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
            aux += "    			</div>";
            aux += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
            aux += "    			</div>";
        } else {
            aux += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
            aux += "    			</div>";
            aux += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
            aux += "    			</div>";
            aux += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
            aux += "    			</div>";
        }
    } else {
        aux += "    			<div id='triggInit' class='itemtrigglimitinvisible' style='left:0px'>";
        aux += "    			</div>";
        aux += "    			<div id='trigg0' class='itemtrigg' ondrag='TriggerValue(this.id);' onclick='TriggerValue(this.id);' ondblclick='SetTriggValue();' style='left:" + anticipation + "px; z-index: 5;'>";
        aux += "    			</div>";
        aux += "    			<div id='triggFin' class='itemtrigglimit' style='left:350px; z-index: 2;'>";
        aux += "    			</div>";
    }
    aux += "</div>";

    //TRIGG OPTIONS BUTTONS
    aux += "<div id='caixatriggoptions' class='caixatriggoptions'>";//caixatriggoptions
    aux += "<div class='flipswitchUnits' onclick='OnswTriggerUnitsClick()'>";
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == 'Time') {
            aux += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs'>";
        } else {//distance mode
            aux += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs' checked>";
        }
    } else {
        aux += "    <input id='swTriggerUnits' type='checkbox' name='flipswitchUnits' class='flipswitchUnits-cb' id='fs' checked>";
    }
    aux += "    <label class='flipswitchUnits-label' for='fs'>";
    aux += "        <div class='flipswitchUnits-inner'></div>";
    aux += "        <div class='flipswitchUnits-switch'></div>";
    aux += "    </label></div>";
    aux += "<div id='idDivSwTriggerDistMode' class='flipswitchUnitsDistanceMode' onclick='OnswTriggerDistanceModeClick()'>";
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook]) {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference == 'Start') {
            aux += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode'>";
        } else {
            aux += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode' checked>";
        }
    } else {
        aux += "    <input id='swTriggerDistMode' type='checkbox' name='flipswitchUnits' class='flipswitchUnitsDistanceMode-cb' id='fsDistMode' checked>";
    }
    aux += "    <label class='flipswitchUnitsDistanceMode-label' for='fsDistMode'>";
    aux += "        <div class='flipswitchUnitsDistanceMode-inner'></div>";
    aux += "        <div class='flipswitchUnitsDistanceMode-switch'></div>";
    aux += "    </label></div></div>";
    return(aux);
}

function PaintCurrentPoint_Action() {
    if (document.getElementById("item" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint]["@Id"])) {
        document.getElementById("item" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint]["@Id"]).className = "itemActionsSelected";
    }
}

/*################################################################
 * btn actions functions
 ################################################################*/

function OnClickPoint_Actions(idPointAct) {
    idCurrentPointAttr = idPointAct.replace("item", "");
    iCurrentPoint = GetIFromidCurrentPoint();
    iCurrentHook = 0;
    timesRechargingArrayFromRapid = 0;
    arrayValue = "";
    ShowActions();
}

function OnMouseOverPanel(idpanel) {
    CurrentActionPanel = "_" + idpanel;
}

function ClickOnModule(modNameGiven) {
    GetActionModulesNameFromRapid(); //to repaint the Modules in normal colors
    document.getElementById(modNameGiven).className = "selecteditemactivat"; //to paint the Module with the selected color
    dir = "/rw/rapid/symbol/data/RAPID/T_ROB1/" + modNameGiven + "/" + modNameGiven + "Array"; /*"http://" + url.ip + */
    xmlMod = "";
    xmlMod = LoadModulesFromRapid(dir);
    varValue = xmlMod.getElementsByClassName("value");
    document.getElementById("titleModulesActionsBox" + CurrentActionPanel).innerHTML = modNameGiven;
    document.getElementById("nameModulesActionsBox" + CurrentActionPanel).innerHTML = "";
    arrayValueAll = "";
    arrayValue = "";
    arrayValue += varValue[0].childNodes[0].nodeValue;
    arrayValue = arrayValue.split('"');
    if (iCurrentHook < 10) {
        for (i = 0; i < arrayValue.length - 1; i = i + 6) {
            document.getElementById("nameModulesActionsBox" + CurrentActionPanel).innerHTML += "<div nactionparam='" + arrayValue[i + 5] + "' id='" + arrayValue[i + 1] + "' class='arrayValuesForDrag' draggable='true' onclick='OnClickActionModule(this.id, &#39;" + arrayValue[i + 3] + "&#39;)' ondragend='OnDragEndActionButton(event)' ondragstart='OnDragStartActionButton(event, &#39;" + arrayValue[i + 1] + "&#39;, &#39;" + modNameGiven + "&#39;, this.id, &#39;" + arrayValue[i + 3] + "&#39;)'>" + arrayValue[i + 1] + "</div>";
        }
        ChargeActionsSelected(modNameGiven);
    } else if (iCurrentHook == 10) {//presequential version
        for (i = 0; i < arrayValue.length - 1; i = i + 6) {
            document.getElementById("nameModulesActionsBox" + CurrentActionPanel).innerHTML += "<div nactionparam='" + arrayValue[i + 5] + "' id='" + arrayValue[i + 1] + "' class='arrayValuesForDrag' draggable='true' onclick='OnClickActionModule(this.id, &#39;" + arrayValue[i + 3] + "&#39;)' ondragend='OnDragEndActionButton(event)' ondragstart='OnDragStartActionButton(event, &#39;" + arrayValue[i + 1] + "&#39;, &#39;" + modNameGiven + "&#39;, this.id)'>" + arrayValue[i + 1] + "</div>";
        }
        ChargeActionsSelected(modNameGiven);
    } else if (iCurrentHook == 11) {//postsequential version
        for (i = 0; i < arrayValue.length - 1; i = i + 6) {
            document.getElementById("nameModulesActionsBox" + CurrentActionPanel).innerHTML += "<div nactionparam='" + arrayValue[i + 5] + "' id='" + arrayValue[i + 1] + "' class='arrayValuesForDrag' draggable='true' onclick='OnClickActionModule(this.id, &#39;" + arrayValue[i + 3] + "&#39;)' ondragend='OnDragEndActionButton(event)' ondragstart='OnDragStartActionButton(event, &#39;" + arrayValue[i + 1] + "&#39;, &#39;" + modNameGiven + "&#39;, this.id)'>" + arrayValue[i + 1] + "</div>";
        }
        ChargeActionsSelected(modNameGiven);
    }
}

function ChargeActionsSelected(mName) {
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "btriggstab") {
        for (i = 0; i < 5; i++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions) {
                modNameOfSelectedAction = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionModule;
                if (mName == modNameOfSelectedAction) {
                    idA = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName;
                    if (document.getElementById(idA)) {
                        document.getElementById(idA).className = "arrayValuesForDragSelected";
                    }
                }
            }
        }
        ShowBlocActionsSelectedFromTrigger();
    }
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec") {
        for (i = 0; i < 5; i++) {
            modNameOfSelectedAction = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
            if (mName == modNameOfSelectedAction) {
                idA = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
                document.getElementById(idA).className = "arrayValuesForDragSelected";
            }
        }
        ShowBlocActionsSelectedFromTrigger();
    }
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") {
        for (i = 0; i < 5; i++) {
            modNameOfSelectedAction = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
            if (mName == modNameOfSelectedAction) {
                idA = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
                document.getElementById(idA).className = "arrayValuesForDragSelected";
            }
        }
        ShowBlocActionsSelectedFromTrigger();
    }
}

function ChargeActionsSelectedPreSeq(mName) {
    for (i = 0; i < 5; i++) {
        modNameOfSelectedAction = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule;
        if (mName == modNameOfSelectedAction) {
            idA = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName;
            document.getElementById(idA).className = "selecteditemactivat";
        }
    }
    ShowBlocActionsFromPreSeq();
}

function ChargeActionsSelectedPostSeq(mName) {
    for (i = 0; i < 5; i++) {
        modNameOfSelectedAction = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule;
        if (mName == modNameOfSelectedAction) {
            idA = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName;
            document.getElementById(idA).className = "selecteditemactivat";
        }
    }
    ShowBlocActionsFromPostSeq();
}

function OnDragStartActionButton(event, actionName, modNameGiv, idgiv, actiondescription) {
    event.dataTransfer.setData("Text", event.target.id);
    CurrentActionName = actionName;
    CurrentActionDescription = actiondescription;
    CurrentNActionParam = document.getElementById(idgiv).attributes[6].nodeValue;
    CurrentModName = modNameGiv;
    isdraggingAction = true;
    if (CountBlocActionUsed() < 5) {
        document.getElementById("selectedActions").className = "caixapropertiesFloating";
    } else {
        document.getElementById("selectedActions").className = "caixapropertiesRed";
    }
}

function OnDragEndActionButton(event) {
    document.getElementById("selectedActions").className = "caixaproperties";
}

function EditParameters() {
    if (currpanel.indexOf("Trigg") > -1) {
        iCurrentHook = currpanel.replace("Trigg", "");
        if (CurrentNActionParam > 0) {
            arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam.split(" ");
            mPrompt(CurrentNActionParam, CurrentActionName, CurrentActionDescription, "", arraycontent, SetValueToTriggActionParam);
        } else {
            alertify.notify(translations.ACTIONS_NO_PARAMETERS_IN_ACTION);
        }
    } else if (currpanel == "PreSeq") {
        if (CurrentNActionParam > 0) {
            arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ");
            mPrompt(CurrentNActionParam, CurrentActionName, CurrentActionDescription, "", arraycontent, SetValueToTriggActionParam);
        } else {
            alertify.notify(translations.ACTIONS_NO_PARAMETERS_IN_ACTION);
        }
    } else if (currpanel == "PostSeq") {
        if (CurrentNActionParam > 0) {
            arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ");
            mPrompt(CurrentNActionParam, CurrentActionName, CurrentActionDescription, "", arraycontent, SetValueToTriggActionParam);
        } else {
            alertify.notify(translations.ACTIONS_NO_PARAMETERS_IN_ACTION);
        }
    }
}

function DragEndAction(event, idact) {
    document.getElementById("PreSeq").className = document.getElementById("PreSeq").className.replace(" own-green", "");
    document.getElementById("PreSeq").className = document.getElementById("PreSeq").className.replace(" own-red", "");
    document.getElementById("PostSeq").className = document.getElementById("PostSeq").className.replace(" own-green", "");
    document.getElementById("PostSeq").className = document.getElementById("PostSeq").className.replace(" own-red", "");
    for (var i = 0; i < CountUsedTriggs(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind); i++) {
        document.getElementById("Trigg" + i).className = document.getElementById("Trigg" + i).className.replace(" own-green", "");
        document.getElementById("Trigg" + i).className = document.getElementById("Trigg" + i).className.replace(" own-red", "");
    }
    isdragingAction = false;
}
function DragStartAction(event, idact) {
    event.dataTransfer.setData('text', event.target.id);
    idCurrentActionDragging = idact.split("_")[1];
    idCurrentModuleActionDragging = idact.split("_")[0];

    //paint panels
    if (CountUsedBlocActionsFromBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction) < 5) {
        document.getElementById("PreSeq").className += " own-green";
    } else {
        document.getElementById("PreSeq").className += " own-red";
    }
    if (CountUsedBlocActionsFromBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction) < 5) {
        document.getElementById("PostSeq").className += " own-green";
    } else {
        document.getElementById("PostSeq").className += " own-red";
    }
    for (var i = 0; i < CountUsedTriggs(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind); i++) {
        if (CountUsedBlocActionsFromBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[i].actions.BlocAction) < 5) {
            document.getElementById("Trigg" + i).className += " own-green";
        } else {
            document.getElementById("Trigg" + i).className += " own-red";
        }
    }
    isdraggingAction = true;
}

function OnDragOverActionButton(placeid) {
    var value = "";
    if (isdraggingAction == true) {
        isdraggingAction = false;
        actionName = CurrentActionName;
        modNameGiv = CurrentModName;
        if (document.getElementsByClassName("selectedseqactivat")[0].id == "btriggstab") {
            nBA = CountBlocActionUsed();
            globaliBA = nBA;
            if (document.getElementById(actionName).className == "arrayValuesForDrag") {
                title = translations.PPUP_ENTER_VALUES_ACTION_PARAM + CurrentNActionParam;
                if (nBA == 0) {
                    /* PARÀMETRES QUE POSA L'USER */
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionName = actionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionModule = modNameGiv;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionParam = "";//Math.random();
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].DefaultEnabled = "true";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].VisibleFP = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA]["@xsi:nil"];
                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();

                } else if ((nBA < 5) && (nBA != 0)) {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionName = actionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionModule = modNameGiv;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].ActionParam = "";//Math.random();
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].DefaultEnabled = "true";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA].VisibleFP = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[nBA]["@xsi:nil"];
                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();
                } else {
                    alertify.error(translations.PPUP_MAX_ACTIONBLOCS);
                }
                if ((CurrentNActionParam > 0) && (nBA < 5)) {
                    arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam.split(" ");
                    mPrompt(CurrentNActionParam, actionName, CurrentActionDescription, "", arraycontent, SetValueToTriggActionParam);
                } else {

                }
            }
            ShowBlocActionsSelectedFromTrigger();
        } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec") {
            nBA = CountBlocActionUsed();
            globaliBA = nBA;
            if (document.getElementById(actionName).className == "arrayValuesForDrag") {
                title = translations.PPUP_ENTER_VALUES_ACTION_PARAM + CurrentNActionParam;

                if (nBA == 0) {
                    ba2 = [{
                            ActionName: actionName,
                            ActionModule: modNameGiv,
                            ActionParam: "",
                            DefaultEnabled: "true",
                            VisibleFP: "true"
                        }];
                    ba1 = {
                        BlocAction: ba2
                    };
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions = ba1;
                    baempty = {
                        ["@xsi:nil"]: "true"
                    };
                    for (countA = 1; countA < 5; countA++) {
                        var cloneOfbaempty = JSON.parse(JSON.stringify(baempty));
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction.push(cloneOfbaempty);
                    }
                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();
                } else if ((nBA < 5) && (nBA != 0)) {//OJUU AQUÍ ÉS SEQUENTIAL
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionName = actionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionModule = modNameGiv;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionParam = value;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].DefaultEnabled = "true";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].VisibleFP = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA]["@xsi:nil"];

                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();
                } else {
                    alertify.error(translations.PPUP_ONLY_5_ACTIONBLOCS_INSIDE_HOOK);
                }

                if (CurrentNActionParam > 0) {
                    arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ");
                    mPrompt(CurrentNActionParam, actionName, CurrentActionDescription, "", arraycontent, SetValueToPreSeqActionParam);
                } else {

                }
            }
            ShowBlocActionsSelectedFromTrigger();
        } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") {
            nBA = CountBlocActionUsed();
            globaliBA = nBA;
            if (document.getElementById(actionName).className == "arrayValuesForDrag") {
                title = translations.PPUP_ENTER_VALUES_ACTION_PARAM + CurrentNActionParam;

                if (nBA == 0) {
                    ba2 = [{
                            ActionName: actionName,
                            ActionModule: modNameGiv,
                            ActionParam: value,
                            DefaultEnabled: "true",
                            VisibleFP: "true"
                        }];
                    ba1 = {
                        BlocAction: ba2
                    };
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions = ba1;
                    baempty = {
                        ["@xsi:nil"]: "true"
                    };
                    for (countA = 1; countA < 5; countA++) {
                        var cloneOfbaempty = JSON.parse(JSON.stringify(baempty));
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction.push(cloneOfbaempty);
                    }
                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();
                } else if ((nBA < 5) && (nBA != 0)) {//OJUU AQUÍ ÉS SEQUENTIAL
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionName = actionName;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionModule = modNameGiv;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionParam = value;
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].DefaultEnabled = "true";
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].VisibleFP = "true";
                    delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA]["@xsi:nil"];

                    document.getElementById(actionName).className = "arrayValuesForDragSelected";
                    alertify.success(translations.PPUP_ACTION_ADDED);
                    ShowBlocActionsSelectedFromTrigger();
                } else {
                    alertify.error(translations.PPUP_ONLY_5_ACTIONBLOCS_INSIDE_HOOK);
                }

                if (CurrentNActionParam > 0) {
                    arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ");
                    mPrompt(CurrentNActionParam, actionName, CurrentActionDescription, "", arraycontent, SetValueToPostSeqActionParam);
                }
            }
            ShowBlocActionsSelectedFromTrigger();
        }
    }
}

function ClickedActionButtonPreSeq(actionName, modNameGiv) {// pre sequential version
    if (document.getElementById(actionName).className == "selecteditem") {
        nBA = CountBlocActionUsedPreSeq();
        if (nBA == 0) {
            ba2 = [{
                    ActionName: actionName,
                    ActionModule: modNameGiv,
                    ActionParam: "12",
                    DefaultEnabled: "true",
                    VisibleFP: "true"
                }];
            ba1 = {
                BlocAction: ba2
            };
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions = ba1;
            baempty = {
                ["@xsi:nil"]: "true"
            };
            for (countA = 1; countA < 5; countA++) {
                var cloneOfbaempty = JSON.parse(JSON.stringify(baempty));
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction.push(cloneOfbaempty);
            }
        } else if ((nBA < 5) && (nBA != 0)) {//OJUU AQUÍ ÉS SEQUENTIAL
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionName = actionName;
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionModule = modNameGiv;
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA].ActionParam = "11";
            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[nBA]["@xsi:nil"];
            document.getElementById(actionName).className = "selecteditemactivat";
        } else {
            alert(translations.PPUP_ONLY_5_ACTIONBLOCS_INSIDE_HOOK);
        }
    } else if (document.getElementById(actionName).className == "selecteditemactivat") {
        document.getElementById(actionName).className = "selecteditem";
        if (nBA > 0) {
            SearchAndDeleteActionPointPreSeq(actionName);
        }
    }
    ShowBlocActionsFromPreSeq();
}

function ClickedActionButtonPostSeq(actionName, modNameGiv) {// sequential version
    if (document.getElementById(actionName).className == "selecteditem") {
        nBA = CountBlocActionUsedPostSeq();
        if (nBA < 5) {//OJUU AQUÍ ÉS SEQUENTIAL
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionName = actionName;
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionModule = modNameGiv;
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA].ActionParam = "11";
            delete o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[nBA]["@xsi:nil"];
            document.getElementById(actionName).className = "selecteditemactivat";
        } else {
            alert(translations.PPUP_ONLY_5_ACTIONBLOCS_INSIDE_HOOK);
        }
    } else if (document.getElementById(actionName).className == "selecteditemactivat") {
        document.getElementById(actionName).className = "selecteditem";
        if (nBA > 0) {
            SearchAndDeleteActionPointPostSeq(actionName);
        }
    }
    ShowBlocActionsFromPostSeq();
}

function OnActionVisibleClick(idaction) {
    currpanel = document.getElementById(idaction).getAttribute("currpanel");
    idaction = idaction.split("_")[1].replace("SelectedActionItem", "");
    baobj = GetBlocActionObjectByActionName(idaction);
    if (baobj.VisibleFP == "true") {
        baobj.VisibleFP = "false";
    } else if (baobj.VisibleFP == "false") {
        baobj.VisibleFP = "true";
    }
    alertify.notify(translations.ACTIONS_DEFAULTENABLED_SET_TO + baobj.VisibleFP);
    ActualizeHTMLSelectedActionsPanels();
}
function OnActionEnableClick(idaction) {
    currpanel = document.getElementById(idaction).getAttribute("currpanel");
    idaction = idaction.split("_")[1].replace("SelectedActionItem", "");
    baobj = GetBlocActionObjectByActionName(idaction);
    if (baobj.DefaultEnabled == "true") {
        baobj.DefaultEnabled = "false";
    } else if (baobj.DefaultEnabled == "false") {
        baobj.DefaultEnabled = "true";
    }
    alertify.notify(translations.ACTIONS_DEFAULTENABLED_SET_TO + baobj.DefaultEnabled);
    ActualizeHTMLSelectedActionsPanels();
}

function OnContextMenuSelectedActionItem(idgiv) {
    currpanel = idgiv.split("_")[0];
    idCurrentSelectedActionItem = idgiv.split("_")[1];
    idActionaux = idCurrentSelectedActionItem.replace("SelectedActionItem", "");
    globaliBA = GetiBAByidSelectedActionItem(idgiv);
    if (currpanel.indexOf("Trigg") > -1) {
        iCurrentHook = currpanel.replace("Trigg", "");
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam != null) {
            CurrentNActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam.split(" ").length;
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionParam == "") {/* if no parameters, CurrentNActionParam=0; split of "" counts as 1 parameter */
                CurrentNActionParam = 0;
            }
            CurrentActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionName;
            CurrentActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[globaliBA].ActionModule;
        } else {
            CurrentNActionParam = 0;
        }
    } else if (currpanel == "PreSeq") {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam != null) {
            CurrentNActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ").length;
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam == "") {/* if no parameters, CurrentNActionParam=0; split of "" counts as 1 parameter */
                CurrentNActionParam = 0;
            }
            arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ").length;
            CurrentActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionName;
            CurrentActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[globaliBA].ActionModule;
        } else {
            CurrentNActionParam = 0;
        }
    } else if (currpanel == "PostSeq") {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam != null) {
            CurrentNActionParam = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ").length;
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam == "") {/* if no parameters, CurrentNActionParam=0; split of "" counts as 1 parameter */
                CurrentNActionParam = 0;
            }
            arraycontent = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionParam.split(" ").length;
            CurrentActionName = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionName;
            CurrentActionModule = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[globaliBA].ActionModule;
        } else {
            CurrentNActionParam = 0;
        }
    }
}

function OnswTriggerUnitsClick() {
    if (document.getElementById("swTriggerUnits").checked == false) {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode = "Distance";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
        document.getElementById("swTriggerUnits").checked = true;
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "1";
    } else {
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode = "Time";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference = "End";
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;

        document.getElementById("swTriggerUnits").checked = false;
        document.getElementById("swTriggerDistMode").checked = true;
        document.getElementById("idDivSwTriggerDistMode").style.opacity = "0.4";
    }
    PaintTriggerLine();
    TriggerValue("trigg0");
}
function OnswTriggerDistanceModeClick() {
    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].mode == "Distance") {
        if (document.getElementById("swTriggerDistMode").checked == false) {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference = "End";
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
            document.getElementById("swTriggerDistMode").checked = true;
        } else {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].reference = "Start";
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
            document.getElementById("swTriggerDistMode").checked = false;
        }
        PaintTriggerLine();
        TriggerValue("trigg0");
        ActualizeTriggOptionsBtnDescription();
    }
}


function ClickOnBTrigg(idClicked) {//runs when the button of trigg selection is ClickedActionButton
    if (document.getElementById(idClicked).className == "selectedtrigg") {
        if (document.getElementsByClassName("selectedtriggactivat").length == 1) {//when comes from the button of a trigger
            document.getElementsByClassName("selectedtriggactivat")[0].className = "selectedtrigg";
        }
        document.getElementById(idClicked).className = "selectedtriggactivat";
        document.getElementsByClassName("caixatriggline")[0].style.visibility = "initial";
        document.getElementById("caixatriggoptions").style.visibility = "initial";
    }
    iCurrentHook = idClicked.replace("btrigg", "");
    val = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation;
    PaintTriggerOptions();
    PaintTriggerLine();
    jsPlumb.reset();
    AddPlumbPropertiesToTrigg();
    ShowBlocActionsSelectedFromTrigger();
    PositionTriggFromValue(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation);
    //unselect boxes
    if (document.getElementsByClassName("selecteditemactivat")[0]) {
        document.getElementsByClassName("selecteditemactivat")[0].className = "selecteditem";
    }
    document.getElementById("nameModulesActionsBox").innerHTML = "";
}

function ClickOnBPreSeq(idClicked) {//runs when the button of Seq selection is ClickedActionButton
    if (document.getElementById(idClicked).className == "selectedseq") {
        if (document.getElementsByClassName("selectedseqactivat").length == 1) {//when comes from the button of postseq
            document.getElementsByClassName("selectedseqactivat")[0].className = "selectedseq";
        }
        document.getElementById(idClicked).className = "selectedseqactivat";
    }
    iCurrentHook = 10;
    document.getElementById("verticalSpaceBetweenTabs").innerHTML = translations.TXT_PRESEQ_TAB;
    document.getElementsByClassName("caixatriggline")[0].style.visibility = "hidden";
    document.getElementById("caixatriggoptions").style.visibility = "hidden";
    document.getElementById("triggsPlace").style.visibility = "hidden";
    ShowBlocActionsSelectedFromTrigger();
    if (document.getElementsByClassName("selecteditemactivat")[0]) {
        document.getElementsByClassName("selecteditemactivat")[0].className = "selecteditem";
    }
    document.getElementById("nameModulesActionsBox").innerHTML = "";
    CreateDisablingPannelActions();
}
function ClickOnBPostSeq(idClicked) {//runs when the button of Seq selection is ClickedActionButton
    if (document.getElementById(idClicked).className == "selectedseq") {
        if (document.getElementsByClassName("selectedseqactivat").length == 1) {//when comes from the button of postseq
            document.getElementsByClassName("selectedseqactivat")[0].className = "selectedseq";
        }
        document.getElementById(idClicked).className = "selectedseqactivat";
    }
    iCurrentHook = 11;
    document.getElementById("verticalSpaceBetweenTabs").innerHTML = translations.TXT_POSTSEQ_TAB;
    document.getElementsByClassName("caixatriggline")[0].style.visibility = "hidden";
    document.getElementById("caixatriggoptions").style.visibility = "hidden";
    document.getElementById("triggsPlace").style.visibility = "hidden";
    ShowBlocActionsSelectedFromTrigger();
    if (document.getElementsByClassName("selecteditemactivat")[0]) {
        document.getElementsByClassName("selecteditemactivat")[0].className = "selecteditem";
    }
    document.getElementById("nameModulesActionsBox").innerHTML = "";
    CreateDisablingPannelActions();
}

function ClickOnBTriggsTab(idClicked) {
    if (document.getElementById(idClicked).className == "selectedseq") {
        if (document.getElementsByClassName("selectedseqactivat").length == 1) {//when comes from the button of postseq
            document.getElementsByClassName("selectedseqactivat")[0].className = "selectedseq";
        }
        document.getElementById(idClicked).className = "selectedseqactivat";
    }
    iCurrentHook = 0;
    document.getElementById("verticalSpaceBetweenTabs").innerHTML = translations.TXT_TRIGGER_TAB;
    document.getElementsByClassName("caixatriggline")[0].style.visibility = "initial";
    document.getElementById("caixatriggoptions").style.visibility = "initial";
    document.getElementById("triggsPlace").style.visibility = "initial";
    if (document.getElementsByClassName("selectedtriggactivat")[0]) {
        document.getElementsByClassName("selectedtriggactivat")[0].className = "selectedtrigg";
        document.getElementById("btrigg0").className = "selectedtriggactivat";
    }
    if (document.getElementsByClassName("selecteditemactivat")[0]) {
        document.getElementsByClassName("selecteditemactivat")[0].className = "selecteditem";
    }
    document.getElementById("nameModulesActionsBox").innerHTML = "";
    CreateDisablingPannelActions();
}

function OnClickActionModule(idgiv, descr) {
    if (descr != "") {
        var offsets = document.getElementById(idgiv).getBoundingClientRect();
        document.getElementById("dialogBoxInfo").style.display = 'block';
        if (PinButton == true) {
            document.getElementById("dialogBoxInfo").style.left = offsets.left - 300 + "px";
        } else {
            document.getElementById("dialogBoxInfo").style.left = offsets.left - 80 + "px";
        }
        document.getElementById("dialogBoxInfo").style.top = offsets.top + "px";
        document.getElementById("dialogBoxInfo").innerHTML = "";
        document.getElementById("dialogBoxInfo").innerHTML += descr;
    }
}

function CollapsePanel(id) {
    id = id.replace("_btn", "");
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function PanelAllowDropAction(event, idpan) {
    event.preventDefault();
}

function dropAction(event, idpan) {
    event.preventDefault();
    if (isdraggingAction == true) {
        currpanel = idpan;
        alertify.notify(idpan + " - " + idCurrentActionDragging);
        var actObj;
        actObj = GetActionFrommaObj(idCurrentActionDragging);

        //adds action to object o, and paint it to html
        if (idpan == "PreSeq") {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction));
            AddActionToBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction, idCurrentModuleActionDragging, idCurrentActionDragging, "");
            document.getElementById(idpan).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction, idpan);
            if (actObj.actParam > 0) {
                mPrompt(actObj.actParam, idCurrentActionDragging, actObj.actDescr, "", "", SetValueToPreSeqActionParam);
            }
        } else if (idpan == "PostSeq") {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction));
            AddActionToBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction, idCurrentModuleActionDragging, idCurrentActionDragging, "");
            document.getElementById(idpan).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction, idpan);
            if (actObj.actParam > 0) {
                mPrompt(actObj.actParam, idCurrentActionDragging, actObj.actDescr, "", "", SetValueToPostSeqActionParam);
            }
        } else {
            iCurrentHook = idpan.replace("Trigg", "");
            AddActionToBlocAction(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction, idCurrentModuleActionDragging, idCurrentActionDragging, "");
            document.getElementById(idpan).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction, idpan);
            if (actObj.actParam > 0) {
                mPrompt(actObj.actParam, idCurrentActionDragging, actObj.actDescr, "", "", SetValueToTriggActionParam);
            }
        }
        MakeSortable();
    }
    isdraggingAction = false;
}

function OnContextMenuTrigg(idgiv) {
    iCurrentHook = idgiv.split("_")[0].replace("Trigg", "");
}

function DeleteContextClickedTrigg() {
    // eliminate from the o object
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.splice(iCurrentHook, 1);
    actbinaux = {
        ["@xsi:nil"]: "true"
    };
    var cloneOfactbinaux = JSON.parse(JSON.stringify(actbinaux));
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind.push(cloneOfactbinaux);

    PaintSequentialTriggsPanels();
}

function GetNewArrangment(itemDragged, currpanelgiv, oldindex, newindex) {
    currpanel = currpanelgiv;
    if (currpanel.indexOf("Trigg") > -1) {
        iCurrentHook = currpanel.replace("Trigg", "");
        var movingElem = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[oldindex]));
        if (oldindex < newindex) {
            for (var i = oldindex; i < newindex; i++) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i + 1];
            }
        } else {
            for (var i = oldindex; i > newindex; i--) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i - 1];
            }
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[newindex] = movingElem;
        document.getElementById('Trigg' + currpanel.replace("Trigg", "")).innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[currpanel.replace("Trigg", "")].actions.BlocAction, currpanel);
    } else if (currpanel == "PreSeq") {
        var movingElem = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[oldindex]));
        if (oldindex < newindex) {
            for (var i = oldindex; i < newindex; i++) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i + 1];
            }
        } else {
            for (var i = oldindex; i > newindex; i--) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i - 1];
            }
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[newindex] = movingElem;
        document.getElementById("PreSeq").innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction, currpanel);
    } else if (currpanel == "PostSeq") {
        var movingElem = JSON.parse(JSON.stringify(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[oldindex]));
        if (oldindex < newindex) {
            for (var i = oldindex; i < newindex; i++) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i + 1];
            }
        } else {
            for (var i = oldindex; i > newindex; i--) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i] = o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i - 1];
            }
        }
        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[newindex] = movingElem;
        document.getElementById("PostSeq").innerHTML = BlocActionToHTML(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction, currpanel);
    }
}

function OnClickPoint_Actions_OLD(idPointAct) {
    idCurrentPointAttr = idPointAct.replace("item", "");
    iCurrentPoint = GetIFromidCurrentPoint();
    iCurrentHook = 0;
    timesRechargingArrayFromRapid = 0;
    arrayValue = "";

    for (i = 0; i < document.getElementsByClassName("itemActionsSelected").length; i++) {
        document.getElementsByClassName("itemActionsSelected")[i].className = "itemActions";
    }
    document.getElementById("selectedActions").innerHTML = "";
    for (i = 0; i < document.getElementById("nameModulesActionsBox").childNodes.length; i++) {
        document.getElementById("nameModulesActionsBox").childNodes[i].className = "selecteditem";
    }
    document.getElementById("nameModulesActionsBox").innerHTML = "";
    document.getElementById(idPointAct).className = "itemActionsSelected";
    //shows the trigger and sequential buttons
    document.getElementById("actionsTabsPlace").style.visibility = "initial";
    document.getElementById("triggsPlace").style.visibility = "initial";
    document.getElementById("divtriggline").style.visibility = "initial";
    PaintTriggerButtons();
    GetActionModulesNameFromRapid();
    ChargeArrayFromModuleRapid();

    //here code to situate the trigger0 on his position over the trigg line
    PositionTriggFromValue(o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].Anticipation);
    AddPlumbPropertiesToTrigg();
    PaintTriggerOptions();
    ClickOnBTriggsTab('btriggstab');
    ShowBlocActionsSelectedFromTrigger();
    ActualizeSWTrigger();
    CreateDisablingPannelActions();
}

function GetNewArrangment_OLDVERSION() {
    //this function gets the new order of the action selected items
    if (document.getElementsByClassName("selectedseqactivat")[0].id == "btriggstab") {
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction) {
                for (i = 0; i < 5; i++) {
                    if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName != undefined) {
                        //alert(document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' - '));
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionModule = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' - ')[0];
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionName = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' - ')[1];
                        o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].ActionParam = document.getElementsByClassName('SelectedActionItem')[i].getAttribute("actparam");
                        if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[0].id == "eyeicon") {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].VisibleFP = "true";
                        } else {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].VisibleFP = "false";
                        }
                        if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[1].id == "enabledicon") {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].DefaultEnabled = "true";
                        } else {
                            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ActionBinds.ActionBind[iCurrentHook].actions.BlocAction[i].DefaultEnabled = "false";
                        }
                    }
                }
            }
        }
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpresec") {
        for (i = 0; i < 5; i++) {
            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName != undefined)) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionModule = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' - ')[0];
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionName = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' - ')[1];
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].ActionParam = document.getElementsByClassName('SelectedActionItem')[i].getAttribute("actparam");
                if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[0].id == "eyeicon") {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP = "true";
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].VisibleFP = "false";
                }
                if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[1].id == "enabledicon") {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled = "true";
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PreSecuentialActions.BlocAction[i].DefaultEnabled = "false";
                }
            }
        }
    } else if (document.getElementsByClassName("selectedseqactivat")[0].id == "bpostsec") {
        for (i = 0; i < 5; i++) {
            if ((o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != "") && (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName != undefined)) {
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionModule = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split(' -')[0];
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionName = document.getElementsByClassName('SelectedActionItem')[i].innerHTML.split('<div class')[0].split('- ')[1];
                o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].ActionParam = document.getElementsByClassName('SelectedActionItem')[i].getAttribute("actparam");
                if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[0].id == "eyeicon") {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP = "true";
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].VisibleFP = "false";
                }
                if (document.getElementsByClassName('SelectedActionItem')[i].childNodes[1].childNodes[1].id == "enabledicon") {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled = "true";
                } else {
                    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].PostSecuentialActions.BlocAction[i].DefaultEnabled = "false";
                }
            }
        }
    }
}

function OnClickDialogBoxInfo() {
    document.getElementById("dialogBoxInfo").style.display = "none";
}

/* ##############################################
 GUI FUNCTIONS
 ##############################################*/

function InitializeGui() {
    if (idCurrentBloc != undefined) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].IsGUIBloc == 'true') {
            if (idCurrentBloc != undefined) {
                idCurrentTab = "Gui";
                htmlGUI();
                document.getElementById("diagramGUIcontainer").style.width = "300px";
                PaintPointsGUI();
                document.getElementById("imagesPlace").innerHTML = "";
                PaintImageAdder();
                ChargePointsOfTheImage();
            } else {
                alertify.warning(translations.PPUP_SELECT_A_BLOC);
            }
        } else {
            alertify.warning(translations.GUI_NO_GUI_BLOCK);
        }
    } else {
        alertify.warning(translations.PPUP_SELECT_A_BLOC);
    }
}

function InitializeGD() {//function to initialize the array object PD, wich contains the ProfileDescriptions nodes
    var num, i, j, k, m;
    num = xmlDoc.getElementsByTagName("GraphicProfileDescription");
    for (i = 0; i < num.length; i++) {
        numPointGUI = xmlDoc.getElementsByTagName('GraphicProfileDescription')[i].getElementsByTagName("PointGUI").length;
        gPD[i] = {
            PointGUI: [numPointGUI],
            nPointGUI: numPointGUI,
            BackgroundImage: " "
        };
        for (j = 0; j < numPointGUI; j++) {
            gPD[i].PointGUI[j] = {
                pointID: " ",
                x_location: " ",
                y_location: " ",
                shortDescription: " "
            };
        }
    }
}

/*################################################################
 * operations gui functions
 ################################################################ */

function GetItemGUIById(gId) {//you give the ID, and it returns the object of the concret PointGUI
    pg = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].SequenceDescriptions.AllItems.ItemGUI;
    for (var i = 0; i < pg.length; i++) {
        if ((pg[i].itemId) == gId) {
            return pg[i];
        }
    }
}

function GetItemGUIPositionMouseUp(pID) {//when Click over the 'item', the pointsequence
    HideDialogBox();
    //when the user drag the MiniPoint, this function puts the X and Y into the corresponding node of the object 'o'
    idRaw = pID.replace("item", "");
    if (idRaw < 9998) {
        pg = GetItemGUIById(idRaw);
        var middleX;
        middleX = (document.getElementById("diagramcontainer").offsetWidth / 2) - 100;
        posLeft = document.getElementById(pID).style.left;
        posLeft = posLeft.replace("px", "");
        pg.x_location = (+posLeft) - (+middleX);
        pg.x_location = Math.round(pg.x_location);
        posTop = document.getElementById(pID).style.top;
        posTop = posTop.replace("px", "");
        pg.y_location = (+posTop);
        pg.y_location = Math.round(pg.y_location);
        if (multipleSelectionMode == true) {
            MakeListIdsMultipleSelection(idRaw);
        }
    }

    //now the connections Editor
    if (ConEdiMode == "Con") {//Connection edition mode
        ConnectionModePointClick(pID, idRaw);
    }
    if ((IsBlocOrPoint(idRaw) == 'point') && (ConEdiMode == 'Edi')) {
        iCurrentPoint = GetIPointById(idRaw);
        ShowPropertiesFromPoint(idRaw);
    }
}

function SearchPuintGUIAndSplice(idGiven) {
    for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc.length; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions) {
            if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription) {
                for (var j = 0; j < o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.length; j++) {
                    numPG = o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI.length;
                    for (var t = 0; t < numPG; t++) {
                        if (o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI[t].pointId == idGiven) {
                            o.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].pointsDescriptions.PointGUI.splice(t, 1);
                            break;
                        }
                    }
                }
            }
        }
    }
}

function DelPointGUIById(idGiven) {//deletes the PointGUI from the jsonobject
    if (idCurrentImage == undefined) {
        idCurrentImage = 0;
    }
    //first search where is the PointGUI with the idGiven
    SearchPuintGUIAndSplice(idGiven);
}

function FocusProfileNameTB() {
    setTimeout(function () {
        document.getElementById("name" + idCurrentImage).select();
    }, 500);
}
function ChangeImageGUI() {
    idcurrentimageaux = JSON.parse(JSON.stringify(idCurrentImage));
    BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
    idCurrentImage = idcurrentimageaux;
    oldcont = JSON.parse(JSON.stringify(document.getElementById("canvas" + idCurrentImage).innerHTML));
    document.getElementById("canvas" + idCurrentImage).innerHTML = "";
    aux = "";
    blocplusid = "bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
    aux += "<div class='previewserverimagesboxBackPanelDisabled' onclick='BlocClick(blocplusid);'></div>";
    aux += "<div class='previewserverimagesbox'>";
    aux += "<b>" + translations.GUI_PREVIEW_IMAGES_FROM_ROBOT + "</b><br>"; // <img id='deployicon' src='appImages/imgtrans.png' width='20px'/>
    listdir = LoadXMLDoc(url.pathToImages); /*"http://" + url.ip +*/

    //robustness.
    if (!listdir)
    {
        alert("Error: funtions.js - ChargeLangXML() - Coudn't load: " + +url.pathToImages); /*"http://" + url.ip */
        console.log("Error: funtions.js - ChargeLangXML() - Coudn't load: " + url.pathToImages); /*"http://" + url.ip + */
        return;
    }

    ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    for (u = 0; u < listdir.html.body.div.ul.li.length; u++) {
        if ((listdir.html.body.div.ul.li[u]["@title"] != "00noexist.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00noimage.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00uploadimage.png")) {
            aux += "<div class='divimagepreview' id='" + listdir.html.body.div.ul.li[u]["@title"] + "' oncontextmenu='OncontextmenuDivimagepreview(this.id);'>";
            aux += "	<img class='imagepreview' onclick='PreviewImageClickExistingProfileDescription(src);' src='" + url.pathToImages + "/" + listdir.html.body.div.ul.li[u]["@title"] + "'>"; /*'http://" + url.ip + url.pathToImages */
            aux += listdir.html.body.div.ul.li[u]["@title"];
            aux += "</div>";
        }
    }
    aux += "</div>";
    document.getElementById("canvas" + idCurrentImage).innerHTML += aux;
    document.getElementById("canvas" + idCurrentImage).innerHTML += oldcont;
}

function DeleteImageGUI() {
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].BackgroundImage = "";
    PaintImageAdder();
    PaintPointsGUI();
    ChargePointsOfTheImage();
    alertify.success(translations.PPUP_IMAGE_DELETED);

}

function DeleteProfileDescriptionGUI() {
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.splice(idCurrentImage, 1);
    PaintImageAdder();
    PaintPointsGUI();
    ChargePointsOfTheImage();
    alertify.success(translations.PPUP_PROF_DESCR_DELETED);
}

/*################################################################
 * visual gui functions	
 ################################################################*/

function PaintPointsGUI() { //function to show the flowchart of Points from the xml
    var nom, item, topMargin;
    topMargin = 0; //initial value of topMargin for the first box. This value will increment +50px for each box of the jsplumb.
    listIdsBlocABlocs = []; //reset the list
    listIdsBlocAPoints = []; //reset the list
    llistaBlocsTalladors = [];
    llistaBlocsAmbGUI = [];
    MakeListBlocsWithGUI();
    document.getElementById("diagramGUIcontainer").innerHTML = "";
    MakeListIdsBlocs(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]);
    for (i = 0; i < listIdsBlocABlocs.length; i++) {
        BlocOfId = GetBlocById(listIdsBlocABlocs[i]);
        //mirar si el seu parentid té guibloctrue
        parentBlocOfId = GetBlocById(BlocOfId["@Id"]);
        if (((BlocOfId.IsGUIBloc == "false") || (BlocOfId["@Id"] == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"])) && (ShowBlocWithGUI(BlocOfId["@Id"]) == "si")) {
            document.getElementById("diagramGUIcontainer").innerHTML += "<div class='listpointsguiA' id='listpoints" + BlocOfId["@Id"] + "'><b><font color='#3a515f'>" + BlocOfId.BlocName + "</font></b><br><br>";
            if (BlocOfId.PointsReferences) {
                for (j = 0; j < BlocOfId.PointsReferences.int.length; j++) {
                    pointX = GetPointById(BlocOfId.PointsReferences.int[j]);
                    id = pointX["@Id"];
                    item = "item" + id;
                    nom = "nom" + id;
                    surtalgui = ComparaSiPointSurtAlGUI(pointX["@Id"]);//envia l'id i compara si surt al gui
                    if (surtalgui == true) {
                        document.getElementById("listpoints" + BlocOfId["@Id"]).innerHTML += "<div id='" + item + "' class='itemgui' style='top:" + topMargin + "px;' onmouseover='MouseOverPoint(this.id)' onmouseout='MouseOutPoint(this.id)' ondblclick='ChangeAlias(this.id)' ondragstart='dragStartGUI(event, this.id)' draggable='true'><strong><p id='" + nom + "'></p></strong></div>";
                    } else {
                        document.getElementById("listpoints" + BlocOfId["@Id"]).innerHTML += "<div id='" + item + "' class='itemgui_unused' style='top:" + topMargin + "px;' onmouseover='MouseOverPoint(this.id)' onmouseout='MouseOutPoint(this.id)' ondblclick='ChangeAlias(this.id)' ondragstart='dragStartGUI(event, this.id)' draggable='true'><strong><p id='" + nom + "'></p></strong></div>";
                    }
                    document.getElementById(nom).innerHTML = pointX.Alias;
                }
            }
            document.getElementById("diagramGUIcontainer").innerHTML += "</div>";
        }
    }
    jsPlumb.reset();
}

function ChargePointsOfTheImage() {//reads the points from the xml file and paints it over the image
    scrolly = window.pageYOffset;
    var gPD;
    document.getElementById("imagesPlace").innerHTML = "";
    //here puts the images, the filenames gets from the xml file
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
        gpdnum = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.length;
    } else {
        gpdnum = 0;
    }
    for (i = 0; i < gpdnum; i++) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i].BackgroundImage != "") {
            fileImageName = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i].BackgroundImage;
        } else {
            fileImageName = "00noimage.png";
        }
        aux = "";
        aux += "<div class='canvasimatge' id='canvas" + i + "' onmouseover='MouseOverCanvas(this.id)' oncontextmenu='ContextClickCanvas(this.id)'>";
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i] == undefined) {
            aux += "<div style='margin-bottom: 10px;'><input type='text' class='tbProfileName' id='name" + i + "' onchange='ChangeImageRefName(this.id)' placeholder='enter a profile name...'></input></div>"; //"http://"+url.ip+url.pathToImages
        } else if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i]["@RefName"] == "") {
            aux += "<div style='margin-bottom: 10px;'><input type='text' class='tbProfileName' id='name" + i + "' onchange='ChangeImageRefName(this.id)' placeholder='enter a profile name...'></input></div>"; //"http://"+url.ip+url.pathToImages
        } else {
            aux += "<div style='margin-bottom: 10px;'><input type='text' class='tbProfileName' id='name" + i + "' onchange='ChangeImageRefName(this.id)' value='" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i]["@RefName"] + "'></input></div>"; //"http://"+url.ip+url.pathToImages     codi posar icona editar: <img id='name"+i+"_prefname_' onclick='ChangeImageRefName(this.id)' class='editicon' src='appImages/imgtrans.png' width='15px'/>
        }
        aux += "<img onclick='EditBackgroundImage()' id='painticon' title='Edit Background Image' src='appImages/imgtrans.png' style='width: 20px; height: 20px; margin-right:5px; margin-bottom: 10px; float: right;' />"
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i].BackgroundImage != "") {
            exist = imageExists(url.pathToImages + '/' + fileImageName); /*'http://' + url.ip +*/
            if (exist == true) {
                aux += "<div id='drawcanvasbox" + i + "' class='drawcanvasbox'></div>";
                aux += "<img onmousemove='RatoliUp(event)' class='imatgegui' id='imatgefons" + i +
                        "' oncontextmenu='MouseOverImage(this.id)' onmouseover='MouseOverImage(this.id)' \n\
ondrop='drop(event)' ondragover='DragPointToImg(this.id, event)' src='"
                        + url.pathToImages + "/" + fileImageName + "'' width='640px' height='280px' alt='GUI'/>"; /* src='http://" 
                         + url.ip + */
            } else {
                aux += "<div id='drawcanvasbox" + i + "' class='drawcanvasbox'></div>";
                aux += "<img onmousemove='RatoliUp(event)' class='imatgegui' id='imatgefons" + i +
                        "' oncontextmenu='MouseOverImage(this.id)' onmouseover='MouseOverImage(this.id)' \n\
ondrop='drop(event)' ondragover='DragPointToImg(this.id, event)' src='" + url.pathToImages + "/00noexist.png' width='640px' height='280px' alt='GUI'/>"; /* src='http://" + url.ip + url.pathToImages*/
            }
        } else {
            aux += "<div class='previewserverimagesboxNoShow' id='previewserverimagesboxNoImage" + i + "' onclick='ClickNoImage(imatgefons" + i + ")'>";
            aux += "<b>" + translations.GUI_PREVIEW_IMAGES_FROM_ROBOT + "</b><br>"; //<img id='deployicon' src='appImages/imgtrans.png' width='20px'/>
            listdir = LoadXMLDoc(url.pathToImages); /*"http://" + url.ip + */
            //robustness	
            if (!listdir)
            {
                alert("Error: funtions.js- ChargePointsOfTheImage- - Coudn't load: " + url.pathToImages); /*"http://" + url.ip +*/
                console.log("Error: funtions.js - ChargePointsOfTheImage- Coudn't load: " + url.pathToImages); /*"http://" + url.ip +*/
                return;
            }

            ojsonListDir = xml2json(listdir, "");
            listdir = JSON.parse(ojsonListDir);
            for (u = 0; u < listdir.html.body.div.ul.li.length; u++) {
                if ((listdir.html.body.div.ul.li[u]["@title"] != "00noexist.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00noimage.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00uploadimage.png")) {
                    aux += "<div class='divimagepreview' id='" + listdir.html.body.div.ul.li[u]["@title"] + "' oncontextmenu='OncontextmenuDivimagepreview(this.id);'>";

                    aux += "	<img class='imagepreview' onclick='PreviewImageClickExistingProfileDescription(src);' src='/" + listdir.html.body.div.ul.li[u]["@title"] + "'>"; /*http://" + url.ip + url.pathToImages + "*/
                    aux += listdir.html.body.div.ul.li[u]["@title"];
                    aux += "</div>";
                }
            }
            aux += "</div>";

            aux += "<div id='drawcanvasbox" + i + "' class='drawcanvasbox'></div>";
            aux += "<img onmousemove='RatoliUp(event)' class='imatgegui' id='imatgefons" + i +
                    "' onclick='ClickNoImage(this.id)' oncontextmenu='MouseOverImage(this.id)'\n\
 onmouseover='MouseOverImage(this.id)' ondrop='drop(event)' ondragover='DragPointToImg(this.id, event)' \n\
src='/" + url.pathToImages + "/" + fileImageName + "' width='640px' height='280px' style='position:absolue;' alt='GUI'/>"; /* + url.ip */
        }
        aux += "</div>";
        document.getElementById("imagesPlace").innerHTML += aux;
        gPD = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i].pointsDescriptions;
        document.getElementById("name" + i).value = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i]["@RefName"];
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[i].pointsDescriptions) {
            numPointGUI = gPD.PointGUI.length;
            idCurrentImage = i;
            for (var k = 0; k < numPointGUI; k++) {
                PaintMiniPoint(gPD.PointGUI[k].pointId, gPD.PointGUI[k].shortDescrition, gPD.PointGUI[k].x_location, gPD.PointGUI[k].y_location);
            }
        }
    }
    MakePointsGuiDraggable();
    window.scrollBy(0, scrolly);
}

function MakePointsGuiDraggable() {
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
        for (var im = 0; im < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.length; im++) {
            for (var k = 0; k < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[im].pointsDescriptions.PointGUI.length; k++) {
                jsPlumb.draggable(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[im].pointsDescriptions.PointGUI[k].pointId, {
                    containment: "#imatgefons" + im
                });
            }
        }
    }
}

function PaintImageAdder() {//paints the image adder
    document.getElementById("imagesAdderPlace").innerHTML = "";
    aux = "";
    aux += "<div class='canvasimatgeUploader' id='addimage'>";
    aux += "<div class='image-upload'>";
    aux += "<div class='image-upload' title='add new image'><label for='filechange_input'><img src='appImages/newImage.png' class='uploadicon' /></label><input id='filechange_input' type='file' onchange='ChangeImageClicked()'/>";
    aux += "</div>";
    aux += "</div>";
    aux += "<div class='previewserverimagesboxNewImage' id='previewserverimagesbox'>";
    aux += "<b>" + translations.GUI_PREVIEW_IMAGES_FROM_ROBOT + "</b><br>";
    listdir = LoadXMLDoc(url.pathToImages); /*"http://" + url.ip + */
    //robustness	
    if (!listdir)
    {
        alert("Error: funtions.js -  PaintImageAdder -Coudn't load: " + url.pathToImages); /*"http://" + url.ip + */
        console.log("Error: funtions.js -  PaintImageAdder-  Coudn't load: " + url.pathToImages); /*"http://" + url.ip + */
        return;
    }
    ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    for (u = 0; u < listdir.html.body.div.ul.li.length; u++) {
        if ((listdir.html.body.div.ul.li[u]["@title"] != "00noexist.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00noimage.png") && (listdir.html.body.div.ul.li[u]["@title"] != "00uploadimage.png")) {
            aux += "<div class='divimagepreview' id='" + listdir.html.body.div.ul.li[u]["@title"] + "' oncontextmenu='OncontextmenuDivimagepreview(this.id);'>";

            aux += "	<img class='imagepreview' onclick='PreviewImageClick(src);' src='" + url.pathToImages + "/" + listdir.html.body.div.ul.li[u]["@title"] + "'>"; /*http://" + url.ip*/
            aux += listdir.html.body.div.ul.li[u]["@title"];
            aux += "</div>";
        }
    }
    aux += "</div></div>";
    document.getElementById("imagesAdderPlace").innerHTML += aux;
}

function PreviewImageClick(srcpreviewimage) {
    GenerateBaseGraphicProfileDescription();
    imagename = srcpreviewimage.split("/").pop(-1);
    fileImageName = imagename;
    if (fileImageName == "00noimage.png") {
        fileImageName = "";
    }
    pGUIAux = {
        pointId: "defaultP",
        x_location: "0",
        y_location: "0",
        shortDescrition: "defaultP"
    }
    pdAux = {
        PointGUI: []//pGUIAux
    }
    gpdAux = {
        "@RefName": "",
        pointsDescriptions: pdAux,
        BackgroundImage: fileImageName
    }
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.push(gpdAux);
    PaintImageAdder();
    ChargePointsOfTheImage();
    alertify.success(translations.PPUP_PROF_DESCR_ADDED);
    alertify.success(translations.PPUP_IMAGE_ADDED);
}

function PreviewImageClickExistingProfileDescription(srcpreviewimage) {
    imagename = srcpreviewimage.split("/").pop(-1);
    fileImageName = imagename;
    if (fileImageName == "00noimage.png") {
        fileImageName = "";
    }
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].BackgroundImage = fileImageName;
    PaintImageAdder();
    ChargePointsOfTheImage();
    alertify.success(translations.PPUP_IMAGE_ADDED);
}

function ChangeImageClicked() {
    if (document.getElementById("filechange_input").value != "") {
        var rwServiceResource = new XMLHttpRequest();
        rwServiceResource.onreadystatechange = function () {
            if (rwServiceResource.readyState == 4 && rwServiceResource.status == 200) {
                document.write(rwServiceResource.responseText);
            }
        };
        fileImageName =  url.pathToImages + "/" + document.getElementById("filechange_input").value.replace("C:\\fakepath\\", ""); /*"http://" + url.ip +*/
        listdir = LoadXMLDoc(url.pathToImages); /*"http://" + url.ip + */
        //robustness	
        if (!listdir)
        {
            alert("Error: funtions.js - ChangeImageClicked - Coudn't load: " + url.pathToImages); /*"http://" + url.ip +*/
            console.log("Error: funtions.js -  ChangeImageClicked - Coudn't load: "  + url.pathToImages); /*"http://" + url.ip +*/
            return;
        }
        ojsonListDir = xml2json(listdir, "");
        listdir = JSON.parse(ojsonListDir);
        var imageexistsinserver = "no";
        for (u = 0; u < listdir.html.body.div.ul.li.length; u++) {
            if (listdir.html.body.div.ul.li[u]["@title"] == document.getElementById("filechange_input").value) {
                imageexistsinserver = "yes";
            }
        }
        if (imageexistsinserver != "yes") {
            rwServiceResource.open("Put", fileImageName, true);//puts the image name from the name of the upload file
            var fileContents = new Image();
            fileContents = document.getElementById("filechange_input").files[0];
            rwServiceResource.send(fileContents);
            alertify.success(translations.PPUP_IMAGE_ADDED_TO_SERVER);
            BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
            alertify.success(translations.PPUP_IMAGE_CHANGED);
        } else {
            alert(translations.GUI_FILENAME_ALREADY_TAKEN);
        }
    } else {
        alertify.warning(translations.PPUP_NO_FILE_SELECTED);
    }
}

function GenerateBaseGraphicProfileDescription() {
    if (!o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
        pd = {
            GraphicProfileDescription: []
        }
        o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions = pd;
    }
}
function AddImage() {
    GenerateBaseGraphicProfileDescription();
    pGUIAux = {
        pointId: "defaultP",
        x_location: "0",
        y_location: "0",
        shortDescrition: "defaultP"
    }
    pdAux = {
        PointGUI: [pGUIAux]
    }
    gpdAux = {
        "@RefName": "",
        //pointsDescriptions: pdAux,
        pointsDescriptions: pdAux,
        BackgroundImage: ""
    }
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.push(gpdAux);

    PaintImageAdder();
    ChargePointsOfTheImage();
    alertify.success(translations.PPUP_PROF_DESCR_ADDED);
}

/*
 ################################################################
 btn gui functions
 ################################################################*/

function OnClickCBC1000Block() {
    idCurrentBloc = 1;
    InitializeGui();
    BlocClick('bloc1000');
}

function AddPointToImageByMouse() {	//this function adds a point to the image in the position of the mouse
    pointId = Math.random();
    pointId = pointId * 10;
    pointId = Math.round(pointId);
    pointId = pointId.toString();
    var pointName = prompt(translations.PPUP_NEW_POINT, "p" + pointId);
    matchId = IdRepeated(pointId);
    if (matchId == "nomatch") {
        PaintMiniPoint(pointId, pointName, x, y);
    } else {
        AddPointToImageByMouse();
    }
}

function GetPointGUIById(gId) {//you give the ID, and it returns the object of the concret PointGUI
    pg = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI;
    for (var i = 0; i < pg.length; i++) {
        if ((pg[i].pointId) == gId) {
            return pg[i];
        }
    }
}

function GetMiniPointPositionMouseUp(pID) {
    //when the user drag the MiniPoint, this function puts the X and Y into the corresponding node of the object 'o'
    var canvas = document.getElementById("imatgefons" + idCurrentImage);
    pg = GetPointGUIById(pID);
    //x
    posLeft = document.getElementById(pID).style.left;
    posLeft = posLeft.replace("px", "");
    //y
    posTop = document.getElementById(pID).style.top;
    posTop = posTop.replace("px", "");
    pg.x_location = (+posLeft) - (+canvas.offsetLeft);
    pg.y_location = (+posTop) - (+canvas.offsetTop);
    pg.x_location = Math.round(pg.x_location);
    pg.x_location = Math.abs(pg.x_location);
    pg.y_location = Math.round(pg.y_location);
    pg.y_location = Math.abs(pg.y_location);
}

function DeleteItemByClass(namecl) {
    //to eliminate the actual showing image points over the image
    var po = document.getElementsByClassName(namecl);
    if (0 < po.length) {
        for (i = 0; i <= po.length + 3; i++) {
            po[0].parentNode.removeChild(po[0]);
        }
    }
}

function ComparaSiPointSurtAlGUI(idGiv) {
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
        for (var h = 0; h < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.length; h++) {
            for (var n = 0; n < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[h].pointsDescriptions.PointGUI.length; n++) {
                if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[h].pointsDescriptions.PointGUI[n].pointId == idGiv) {
                    return(true);
                }
            }
        }
    }
    return(false);
}

function DragPointToImg(imageid, ev) {
    idCurrentImage = imageid;
    idCurrentImage = idCurrentImage.replace("imatgefons", "");
    match = MatchIdInDocument(iCurrentPoint); //to avoid repeated id's when dragg the Point, to only create one div of pointimage
    if (match == "noExist") {
        cImage = document.getElementById("imatgefons" + idCurrentImage);
        isdragging = true;
    }
}

/**
 * functions to paint and unpaint the MouseOver Points and ImgPoints
 */
function MouseOverPoint(idGiven) {
    idGiven = idGiven.replace("item", "");
    if (document.getElementById(idGiven)) {
        document.getElementById(idGiven).className = "itempointimageselected";
    }
}

function MouseOutPoint(idGiven) {
    idGiven = idGiven.replace("item", "");
    if (document.getElementById(idGiven)) {
        document.getElementById(idGiven).className = "itempointimage";
    }
}

function MouseOverImgPoint(idGiven) {
    idGiven = "item" + idGiven;
    if (document.getElementById(idGiven)) {
        document.getElementById(idGiven).className = "itemselected";
    }
}

function MouseOutImgPoint(idGiven) {//unpaints the Point
    idGiven = "item" + idGiven;
    if (document.getElementById(idGiven)) {
        document.getElementById(idGiven).className = "itemgui";
    }
}

function RightClickImgPoint(idGiven) {
    idImgPoint = idGiven;
}

function MouseDblClickImgPoint(idGiven) {//rename
    var oldText, newText;
    if (idGiven == undefined || typeof idGiven !== "string") {
        idGiven = idImgPoint.replace("item", "");
    }
    if (document.getElementById(idGiven).childNodes[0]) {
        oldText = document.getElementById(idGiven).childNodes[0].data;
    }
    var newText = prompt(translations.GUI_ENTER_3_LETTERS_NAME + " [" + GetPointById(idGiven).Alias + "]", oldText);
    if ((newText != null) && (newText.length < 4) && (newText.length > 0)) {
        if (document.getElementById(idGiven).childNodes[0]) {
            document.getElementById(idGiven).childNodes[0].innerHTML = newText;
        } else {
            document.getElementById(idGiven).innerHTML = newText;
        }
        //now lets put the new name into the jsonobject
        //first search the position in the jsonobject of this idGiven point
        numPG = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI.length;
        for (i = 0; i < numPG; i++) {
            if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI[i].pointId == idGiven) {
                o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].pointsDescriptions.PointGUI[i].shortDescrition = newText;
            }
        }
        PaintPointsGUI();
        PaintImageAdder();
        ChargePointsOfTheImage();
        alertify.success(translations.PPUP_GUI_POINT_RENAMED);
    } else if ((newText != null) && ((newText.length > 3) || (newText.length < 1))) {
        document.getElementById(idGiven).childNodes[0].innerHTML = oldText;
        alertify.error(translations.PPUP_ERROR_NAMING_GUI_POINT);
    }
}

function PaintMiniPoint(pid, pname, px, py) {
    //you give the 'id' 'name/alias' 'x' and 'y', and this function paints the point over the image in the position given
    isPoint = false;
    if (o.BlocAssembly.AllPoints) {
        for (g = 0; g < o.BlocAssembly.AllPoints.ProcessPoint.length; g++) {
            if (o.BlocAssembly.AllPoints.ProcessPoint[g]["@Id"] == pid) {
                pointAlias = o.BlocAssembly.AllPoints.ProcessPoint[g].Alias;
                isPoint = true;
            }
        }
    }

    if (isPoint == true) {
        var cImage = document.getElementById("imatgefons" + idCurrentImage);
        posPLeft = (+px) + (+cImage.offsetLeft);
        posPTop = (+py) + (+cImage.offsetTop);
        varP = "";
        varP += "<div class='itempointimage' id='" + pid + "' onclick='GetMiniPointPositionMouseUp(this.id)' oncontextmenu='RightClickImgPoint(this.id)' onmouseover='MouseOverImgPoint(this.id)' onmouseout='MouseOutImgPoint(this.id)' ondblclick='MouseDblClickImgPoint(this.id)' style='left: " + posPLeft + "px; top:" + posPTop + "px;' >" + pname + "</div>";
        document.getElementById("canvas" + idCurrentImage).innerHTML += varP;
    }
}

function ChangeImageRefName(idtxt) {
    idCurrentImage = idtxt.replace("name", "");
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage]["@RefName"] = document.getElementById(idtxt).value;
}

function ClickNoImage(idimage) {
    if (document.getElementById("previewserverimagesboxNoImage" + idCurrentCanvasOver)) {
        if (document.getElementById("previewserverimagesboxNoImage" + idCurrentCanvasOver).className == "previewserverimagesbox") {
            document.getElementById("previewserverimagesboxNoImage" + idCurrentCanvasOver).className = "previewserverimagesboxNoShow";
        } else if (document.getElementById("previewserverimagesboxNoImage" + idCurrentCanvasOver).className == "previewserverimagesboxNoShow") {
            document.getElementById("previewserverimagesboxNoImage" + idCurrentCanvasOver).className = "previewserverimagesbox";
        }
    }
}

function MouseOverCanvas(idgiv) {
    idCurrentCanvasOver = idgiv.replace("canvas", "");
    idCurrentImage = idgiv.replace("canvas", "");
}

function ContextClickCanvas(idgiv) {
    idCurrentCanvas = idgiv.replace("canvas", "");
}

function imageExists(image_url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

function MouseOverImage(canvasid) {
    idCurrentImage = canvasid.replace("imatgefons", "");
}

function DeletePointGUICntxtMenu() {
    DelPointGUIById(idImgPoint.replace("item", ""));
    PaintPointsGUI();
    ChargePointsOfTheImage();
}

function OncontextmenuDivimagepreview(idgiv) {
    idCurrentImageContextClick = idgiv;
}

function DownloadImageFromRobot() {
    alertify.success(translations.GUI_DOWNLOADING_IMAGE_FROM_ROBOT);
    var fileimg;
    fileimg = url.pathToImages + "/" + idCurrentImageContextClick; /*"http://" + url.ip + */
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileimg, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
        if (this.status == 200) {
            // get binary data as a response
            var blob = this.response;
            saveAs(blob, fileimg);
        }
    };
    xhr.send();
}

function DeleteImageFromRobot() {
    alertify.notify(idCurrentImageContextClick + " " + translations.GUI_DELETED);
    filetodelete = url.pathToImages + "/" + idCurrentImageContextClick; /*"http://" + url.ip + */
    DeleteFile(filetodelete);
    PaintImageAdder();
    PaintPointsGUI();
    ChargePointsOfTheImage();
    alertify.success(translations.GUI_IMAGE_DELETED_FROM_ROBOT);
}

function OpenDrawCanvas() {
    window.open("drawCanvas.html", "MsgWindow", "width=750, height=400");
}

function EditBackgroundImage() {
    if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions) {
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription) {
            for (var i = 0; i < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription.length; i++) {
                document.getElementById("drawcanvasbox" + i).innerHTML = "";
            }
        }
    }
    document.getElementById("drawcanvasbox" + idCurrentImage).innerHTML = CreateDrawCanvasTools(); //functions in the drawCanvas.js library
    document.getElementById("drawcanvasbox" + idCurrentImage).innerHTML += CreateDrawCanvas(); //functions in the drawCanvas.js library
    initDrawCanvas();
}

var idCurrentImageCopy;
function MergeImageCanvas() {
    idCurrentImageCopy = JSON.parse(JSON.stringify(idCurrentImage));
    var c = document.getElementById("can");
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    var fileName;
    imageObj1.src = url.pathToImages + '/' + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].BackgroundImage; /*'http://' + url.ip +*/
    imageObj2.src = document.getElementById("can").toDataURL("image/png");
    imageObj1.onload = function () {
        ctx.drawImage(imageObj1, 0, 0, 640, 280);
        imageObj2.onload = function () {
            ctx.drawImage(imageObj2, 0, 0, 640, 280);
            var imgdata = c.toDataURL("image/png");
            fileName = saveimg(imgdata);
            setTimeout(function () {
                PutImageDrawnToGraphicProfileDescription(fileName);
            }, 200);
    };
    };
}

function saveimg(imggiv) {
    document.getElementById("canvasimg").style.border = "2px solid";
    if (imggiv == null) {
        var dataURL = canvas.toDataURL("image/png");
        document.getElementById("canvasimg").src = dataURL;
        dataURL = document.getElementById("canvasimg").src;
        document.getElementById("canvasimg").style.display = "inline";
    } else {
        dataURL = imggiv;
    }

    var filename = prompt(translations.GUI_ENTER_IMAGE_NAME, o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].BackgroundImage.replace(".png", "") + "_");
    if (filename != null) {
        SaveImageToServer(filename, dataURL);
    } else {
        alertify.warning(translations.PPUP_OPERATION_CANCELED);
        filename = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImage].BackgroundImage.replace(".png", "");
    }
    return(filename + ".png");
}

function SaveImageToServer(filenamegiv, dataURL) {
    filename = JSON.parse(JSON.stringify(filenamegiv)) + ".png";
    fileImageName = url.pathToImages + "/" + filename; /*"http://" + url.ip +*/
    
    /* Checks if the folder exists */
    listdir = LoadXMLDoc(url.pathToImages); /*"http://" + url.ip + */
    //robustness	
    if (!listdir)
    {
        alert("Error: funtions.js - SaveImageToServer - Images folder not found: " + url.pathToImages); /*"http://" + url.ip*/
        console.log("Error: funtions.js - SaveImageToServer -  Images folder not found: " + url.pathToImages); /*"http://" + url.ip +*/
        return;
    }

    ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);

    for (u = 0; u < listdir.html.body.div.ul.li.length; u++) {
        if (listdir.html.body.div.ul.li[u]["@title"] == filename) {
            var imageexistsinserver = "yes";
        }
    }
    
    if (imageexistsinserver != "yes") {

        var blob = dataURLtoBlob(dataURL);

        var xhttp;
        if (window.XMLHttpRequest) {  // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.open("PUT", fileImageName, false); //async to false to force that it will be syncronous.

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201)) {
                alertify.success("Saved successfully");
                alertify.warning(translations.PPUP_IMAGE_CHANGED);
            } else if (xhttp.readyState == 4 && xhttp.status != 200)
            {
                alertify.error("Saved Failed");
                console.log("Saved KO- file: " + xmlfilepaht);
                console.log("Respose status: " + xhttp.status);
                console.log(xhttp.responseText);
            }
        };

        xhttp.send(blob);

    } else {
        alert(translations.GUI_FILENAME_ALREADY_TAKEN);
    }
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function PutImageDrawnToGraphicProfileDescription(fileName) {
    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].ProfilesDescriptions.GraphicProfileDescription[idCurrentImageCopy].BackgroundImage = fileName;
    BlocClick("bloc" + o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]);
}

function ShowPropertiesFromPoint(idpoint) {
    if (idpoint != 'empty') {
        conting = "";
        document.getElementById('pointpropertiesbox').innerHTML = "";
        conting += "<br><b>Point " + translations.SEQUENCE_POINT_PROPERTIES + "</b><br>";
        conting += "id: " + idpoint + "<br>";
        conting += translations.SEQUENCE_ALIAS + " " + "<input class='tbproperties' type='text' id='txtAlias' onchange='ActualizePointProperties();' value='" + o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].Alias + "'> <br>";
        conting += translations.SEQUENCE_ALLOW_AUXPOINTS + ": ";
        conting += "<div class='onoffswitch01'>";
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].AuxRTAllowed == "true") {
            conting += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swAuxRTAllowed();' id='swAuxRTAllowed' checked>";
        } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].AuxRTAllowed == "false") {
            conting += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='swAuxRTAllowed();' id='swAuxRTAllowed'>";
        }
        conting += "    <label class='onoffswitch01-label' for='swAuxRTAllowed'>";
        conting += "       <span class='onoffswitch01-inner'></span>";
        conting += "       <span class='onoffswitch01-switch'></span>";
        conting += "    </label>";
        conting += "</div><br>";
        conting += translations.MODIFIED_WITH_EXTERN_FRAME + ": ";
        conting += "<div class='onoffswitch01'>";
        if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ExtPoseModified == "true") {
            conting += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='ExtPoseModified();' id='ExtPoseModified' checked>";
        } else if (o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ExtPoseModified == "false") {
            conting += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='ExtPoseModified();' id='ExtPoseModified'>";
        } else {
            o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].ExtPoseModified = "false";
            conting += "    <input type='checkbox' name='onoffswitch01' class='onoffswitch01-checkbox' onclick='ExtPoseModified();' id='ExtPoseModified'>";
        }
        conting += "    <label class='onoffswitch01-label' for='ExtPoseModified'>";
        conting += "        <span class='onoffswitch01-inner'></span>";
        conting += "        <span class='onoffswitch01-switch'></span>";
        conting += "    </label></div><br>";
        document.getElementById('pointpropertiesbox').innerHTML = conting;
        if (multipleSelectionMode == false) {
            if (document.getElementsByClassName('item')) {
                for (it = 0; it < document.getElementsByClassName('item').length; it++) {
                    if (document.getElementsByClassName('item')[it]) {
                        document.getElementsByClassName('item')[it].style.borderColor = "";
                    }
                }
            }
        }
        document.getElementById('item' + idpoint).style.borderColor = '#AD8282';

    } else {
        document.getElementById('pointpropertiesbox').innerHTML = "";
        if (document.getElementsByClassName('item')) {
            for (it = 0; it < document.getElementsByClassName('item').length; it++) {
                if (document.getElementsByClassName('item')[it]) {
                    document.getElementsByClassName('item')[it].style.borderColor = "";
                }
            }
        }
    }
}

function ActualizeProperties(idelemgiv) {
    document.getElementById(idelemgiv).style.animationName = 'actualizeiconspin';
    if (idelemgiv == 'pointactualizeiconid') {
        ActualizePointProperties();
    } else if (idelemgiv == 'blocactualizeiconid') {
        ActualizeBlocProperties();
    }
    window.setTimeout(function () {
        RestartActualizeIconAnimation(idelemgiv)
    }, 500);
}

function RestartActualizeIconAnimation(idelemgiv) {
    document.getElementById(idelemgiv).style.animationName = 'noAnim';
}

function ActualizePointProperties() {
    o.BlocAssembly.AllPoints.ProcessPoint[iCurrentPoint].Alias = document.getElementById('txtAlias').value;
    PaintSequence();
}
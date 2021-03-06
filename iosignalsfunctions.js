var llistaSenyals = [];
var url = {
    pathlocation: "",
    ip: ""
};
var signalDragging;
var signalSelected;
var translations = {};
var alertify = window.alertify;
var st = window.st;
var context = window.context;
var Handlebars = window.Handlebars;
var Swag = window.Swag;
var templates = [];
var ioSignalsData;
var unsavedChanges = false;
        
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

function LoadTemplates(){
    Swag.registerHelpers();
    Handlebars.registerHelper('concat', function(prefix, id) {
        return prefix + id;
    });
    Handlebars.registerHelper('var',function(name, value, context){
        this[name] = value;
    });
    Handlebars.registerHelper('SignalExistsInRobot', SignalExistsInRobot);
    Handlebars.registerHelper('eq', function(a, b, options) {
        return (a === b)?options.fn(this):options.inverse(this);
    });
    Handlebars.registerHelper('neq', function(a, b, options) {
        return (a !== b)?options.fn(this):options.inverse(this);
    });
    return $.when( 
        window.LoadTemplate('ioSignalsTemplate'),
        window.LoadTemplate('inputPropsTemplate'),
        window.LoadTemplate('outputPropsTemplate'))
    .done(function (data1,data2,data3) {
        var iosignalsTemplate = Handlebars.compile($(data1[0]).filter("#tpl-iosignals").html());        
        Handlebars.registerPartial('inputsPartial',Handlebars.compile($(data1[0]).filter("#tpl-inputsPartial").html()));
        Handlebars.registerPartial('outputsPartial',Handlebars.compile($(data1[0]).filter("#tpl-outputsPartial").html()));
        templates["iosignalsTemplate"] = iosignalsTemplate;
        
        var inputsPropsTemplate = Handlebars.compile($(data2[0]).filter("#tpl-inputsProps").html());        
        templates["inputsPropsTemplate"] = inputsPropsTemplate;
        
        var outputsPropsTemplate = Handlebars.compile($(data3[0]).filter("#tpl-outputsProps").html());        
        templates["outputsPropsTemplate"] = outputsPropsTemplate;        
    });
}

function OnLoadAppIOSignals() {
    NavBar();
    LoadSettings()
    .then(LoadLanguage)
    .then(loadIOSingalsData)    
    .then(LoadTemplates)    
    .then(function () {        
        prepareContextMenus();
        PaintSignalsFromRobot();
        var load_ok_message = translations.IO_DATA_CHARGED_FROM_ROBOT + " (" + llistaSenyals.length +")";
        alertify.success(load_ok_message);  //reports the number of signals loaded.
        renderIOSignalsTemplate();   
        window.CheckCurrentVersion();
    });
}

function renderIOSignalsTemplate(tabIndex = 0) {
    var template  = templates ["iosignalsTemplate"];
    $("#screenFlexPendand").html(template({data: ioSignalsData}));
    $("#screenFlexPendand").tabs({
        select: function(){
            $("#ioPropertiesBox").empty();            
        }
    }).tabs( "refresh" ).tabs( "option", "active",tabIndex ).addClass("ui-tabs-vertical ui-helper-clearfix");
    $('.vtab').on('dblclick',function(){                
        if (!$(this).find("input.hiddenInput").is(":visible")) {
            var tab = getTabById($(this).attr("id"));        
            $(this).find('input.hiddenInput').val(tab.description).toggle().focus();
            $(this).find('a').toggle();
        }        
    });
    $(".hiddenInput").on('blur',function(e){
        var tab = getTabById($(this).attr("id"));
        tab.description = escapeXml($(this).val());
        setUnsavedChangesState(true);
        if (/[<>&'"]/g.test($(this).val())) {
            alertify.warning(translations.IO_SIGNALS_CHARACTERS_REMOVED);    
        } 
        renderIOSignalsTemplate(tab.id-1);
        e.preventDefault();                   
    }).on('keydown', function(e){
        if(e.which === 13) {  //return
            $(this).blur();
        } else if(e.which === 32 || e.which === 38 || e.which === 40 || e.which === 37 || e.which === 39) { //whitespace and arrows
            e.stopPropagation();
        } 
    });     
    
    for (var key in ioSignalsData.Tabs){
        var id = ioSignalsData.Tabs[key]["id"];        
        Split(['#inputsBox_'+id, '#outputsBox_'+id], {
            sizes: [50, 50]
        });
    }
    translateUserInterface();
}

function renderInputPropsTemplate(led) {
    var template  = templates ["inputsPropsTemplate"];
    $("#ioPropertiesBox").html(template({led: led}));
    translateUserInterface();
}

function renderOutputPropsTemplate(button) {
    var template  = templates ["outputsPropsTemplate"];
    $("#ioPropertiesBox").html(template({button: button}));
    translateUserInterface();
}

function loadIOSingalsData(){
    return window.LoadIOSignalsData().done(function (data) {
        ioSignalsData = data;
    });
}

/****************************************
 * list of robot signals functions
 ****************************************/
function PaintSignalsFromRobot() {
	
	// reference:  http://developercenter.robotstudio.com/webservice/api_reference
	/*
	* There are a number of possible attributes, when working with the RS.
	*
	*	Self: Refers to a resource equivalent to the containing element
	*	Action: Refers to an action resource.
	*	First: First resource (page) in a list of resources
	*	Next: Next resource (page) in a list of resources
	*	Prev: Previous resource (page) in a list of resources
	*	Last: Last resource (page) in a list of resources
	*
	*/
	
    var llistaSenyalsRaw, listLinks, linkNext;
    
    //watch-out! because the var "llistaSenyals" is a global variable
	
	//get initial signal reference:
	var InitialSignasURL = "http://" + url.ip + "/rw/iosystem/signals";
	
    llistaSenyalsRaw = GetDataRobot(InitialSignasURL);
	
	var s = llistaSenyalsRaw;
	
	var v = s.getElementsByClassName("state");
	
	var z = v[0].childNodes; //the lastChild is suppoused to be an <ul></ul> with all the signals inside.
	/*
	* we should obtain something like:
	* 	z[0].href = http:127.0.0.1:1234/rw/iosystems/signals
	*	z[1].href = http:127.0.0.1:1234/rw/iosystems/signals?action=show
	*	z[2].href = http:127.0.0.1:1234/rw/iosystems/signals?start=100&limit=100
	*	z[3].href = undefinded -- this is an <ul>, with all the signals inside of it.
	*/
		
	//we get the signals at the first page:
	var y = MakeArrayFromHTMLCollection(z[(z.length-1)].getElementsByClassName('name'));
	//the signals are defined in html, as: <span class="name">signal_name</span>; so getting the "name" class we can pin-point them.
	
	llistaSenyals = llistaSenyals.concat(y);
		
	var iteration_flag = true;  // to control the iteration throught the different pages that have the signals names. 
	
	var counter = 0; 
	
	while(iteration_flag)
	{  
		counter++;
		if(counter>100) { iteration_flag = false;} //never ever write an infinite loop.
		console.log("while loops: " + counter);
		
		// now we have to iterate through the following links to the remaining signals.
		for( var i=1; i<z.length-1; i++) //i=0 (initial case) is the previous case.
		{
			//links with this parameter: "?action=show", don't do anything, we skip it. 
			if( !z[i].href.endsWith("?action=show") )  
			{
				//we have to check for the next link to follow. It should match a pattern like:
				// <a href="signals?start=100&amp;limit=100" rel="next"> 
				// the attribute: rel = "next", means, that it is the following link, to get the remaining signals names.
				if( z[i].getAttribute("rel") == "next" )
				{
					
					var s2 = GetDataRobot(z[i].href); //this makes the http request.
					
					var v2 = s2.getElementsByClassName("state"); //what we are looking for is inside the "state"
					
					var z2 = v2[0].childNodes; //we get all the child nodes of the "state" element.
					
					if(z2) //faul-save: if it is not null, or undefined ... just in case.
					{
 
						//the signals are defined in html, as: <span class="name">signal_name</span>; so getting the "name" class we can pin-point them.
						//we retrieve all the signals
						var y2 = MakeArrayFromHTMLCollection(z2[(z2.length-1)].getElementsByClassName('name'));
						
						if(y2) //just-in case there aren't any signals:
						{
							// add new signals:
							llistaSenyals = llistaSenyals.concat(y2);
							
							//reasign to the loop variables, to loop around the 'while'
							z = z2;
							
							
							
						} else {
							//if there arent any signals,then we dont continue searching.
							iteration_flag = false;  
						}
						
					} else{
						iteration_flag = false;  //if the "next" link doesn't exit, then we dont continue searching.
					}
				
				} else if( z[i].getAttribute("rel") == "first"){
					
					//we have warp around the signals. this is done!
					iteration_flag = false; 
				}
			}
		}
	}

	//console.log("llistaSenyals");
	//console.log(llistaSenyals);
    
    document.getElementById("leftColumn").innerHTML = "";
    for (var i = 0; i < llistaSenyals.length; i++) {
        document.getElementById("leftColumn").innerHTML += "<div draggable='true' ondragstart='drag(event, this.id)' class='signalFromRobot' id='" +
		llistaSenyals[i] + "'>" + llistaSenyals[i] + "</div>";
    }
    
}


function MakeArrayFromHTMLCollection(HTMLCollectiongiv) {
    var arrayAux = [];
    for (var i = 0; i < HTMLCollectiongiv.length; i++) {
        arrayAux.push(HTMLCollectiongiv[i].innerHTML);
    }
    return(arrayAux);
}

function SignalExistsInRobot(signalgiv) {
    var exists;
    exists = false;
    for (var i = 0; i < llistaSenyals.length; i++) {
        if (llistaSenyals[i] === signalgiv) {
            exists = true;
            return(exists);
        }
    }
    return(exists);
}

function NavBar() {
    url.machine = 'simulator';
    url.ip = window.location.href.replace("http://", "");
    url.ip = url.ip.split("/")[0];
    url.pathToImages = "/fileservice/~home/StampApp/Images/ProfileImages";
    url.pathToXML = "/fileservice/~home/StampApp/BlocTemplates/CurrentAssembly.xml";
    url.pathToXMLCBC = "/fileservice/~home/StampApp/ServiceData/ServiceDataCommon/sAppServiceData.xml";
}

function NavBar() {
    url.ip = window.location.href.replace("http://", "");
    url.ip = url.ip.split("/")[0];
}

function GetDataRobot(mname) {
    //TODO make jquery async version
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", mname, false);
    xhttp.send();
    return xhttp.responseXML;
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, idSignal) {
    ev.dataTransfer.setData("text", ev.target.id);
    signalDragging = idSignal;
}

function dragInput(ev, idSignal) {
    ev.dataTransfer.setData("text", ev.target.id);
    signalDragging = idSignal;
}

function dragOutput(ev, idSignal) {
    ev.dataTransfer.setData("text", ev.target.id);
    signalDragging = idSignal;
}

function dropOnInput(ev, idDrop) {
    ev.preventDefault();
    if ($("#"+signalDragging).hasClass("signalFromRobot")){        
        var led = getTabLedById(idDrop);
        led.InputSignal = signalDragging;
        led.LabelText = signalDragging;
        led.ActiveColour = "Green";
        led.DefaultColour = "Grey";
        setUnsavedChangesState(true);
        renderIOSignalsTemplate(getTabById(idDrop).id-1);
        renderInputPropsTemplate(led);
    }
}

function getTabById(idgiv) {
    var parts = idgiv.split("_");    
    return ioSignalsData.Tabs.find(x => x["id"] === parseInt(parts[1]));
}

function getTabLedById(idgiv) {
    var tab = getTabById(idgiv);
    var parts = idgiv.split("_");
    return tab.Leds.find(x => x["id"] === parseInt(parts[2]));
}

function getTabButtonById(idgiv) {
    var tab = getTabById(idgiv);
    var parts = idgiv.split("_");
    return tab.Buttons.find(x => x["id"] === parseInt(parts[2]));
}

function dropOnOutput(ev, idDrop) {
    ev.preventDefault();
    if ($("#"+signalDragging).hasClass("signalFromRobot")){        
        var button = getTabButtonById(idDrop);
        button.LabelText = signalDragging;
        button.OutputSignal = signalDragging;  
        button.ButtonType = "SwitchButton";
        setUnsavedChangesState(true);
        renderIOSignalsTemplate(getTabById(idDrop).id-1);
        renderOutputPropsTemplate(button);
    }
}

function IOClicked(idgiv) {
    $(".borderSelected").removeClass("borderSelected");
    $("#"+idgiv).addClass("borderSelected");
    signalSelected = idgiv;
    if (signalSelected.indexOf("input") > -1) {
        var led = getTabLedById(idgiv);
        if (led.InputSignal !== null) renderInputPropsTemplate(led);
        else $("#ioPropertiesBox").empty();
    } else {
        var button = getTabButtonById(idgiv);
        if (button.OutputSignal !== null) renderOutputPropsTemplate(button);
        else $("#ioPropertiesBox").empty();
    }
    $("#"+idgiv).find('input').select();
}

function swPropertiesClick() {    
    getTabButtonById(signalSelected).ButtonType = $("#swIsSwitchBtn").is(':checked')?"SwitchButton":"PushButton";    
    setUnsavedChangesState(true);
}

function KeyUp(idgiv) {
    document.getElementById("lblProperties").innerHTML = document.getElementById(idgiv).value;
    OnChangeTB(idgiv);
}

function translateUserInterface() {
    $(".translatable-text").each(function(i, obj) {
        var key = $(this).text();
        if (key in translations) {
            $(this).text(translations[key]);
        }
    });
    $(".translatable-title").each(function(i, obj) {
        var key = $(this).attr("title");
        if (key in translations) {
            $(this).attr("title",translations[key]);
        }
    });
}

function lblPropertiesClick() {
    $("#"+signalSelected + " input").first().focus();
}

function OnChangeTB(idgiv) {
    var value = $("#"+idgiv).val();    
    if (idgiv.indexOf("Input") > -1) {        
        if (!/[<>&'"]/g.test(value)) {
            var led = getTabLedById(idgiv);    
            led.LabelText = escapeXml(value);
            setUnsavedChangesState(true);
            renderInputPropsTemplate(led);
        }         
    } else if (idgiv.indexOf("Output") > -1) {
        if (!/[<>&'"]/g.test(value)) {
            var button = getTabButtonById(idgiv);
            button.LabelText = escapeXml(value);
            setUnsavedChangesState(true);
            renderOutputPropsTemplate(button);
        }
    }
}

function OnBlurTB(idgiv) {
    var value = $("#"+idgiv).val();    
    if (idgiv.indexOf("Input") > -1) {
        var led = getTabLedById(idgiv);    
        led.LabelText = escapeXml(value);
        $("#"+idgiv).val(led.LabelText);
        setUnsavedChangesState(true);
        renderInputPropsTemplate(led);
    } else if (idgiv.indexOf("Output") > -1) {
        var button = getTabButtonById(idgiv);
        button.LabelText = escapeXml(value);
        $("#"+idgiv).val(button.LabelText);
        setUnsavedChangesState(true);
        renderOutputPropsTemplate(button);
    }
    if (/[<>&'"]/g.test(value)) {
        alertify.warning(translations.IO_SIGNALS_CHARACTERS_REMOVED);    
    }
}

function OnApplyBtnClick() {   
    if (unsavedChanges) {
        prepareXml(ioSignalsData)
        .then(function (generatedXml){
            window.SaveIOSignalsData('<?xml version="1.0" encoding="utf-8"?>\n' + generatedXml)
        }).then(function () {
            setUnsavedChangesState(false);
            alertify.success(translations.IO_CHANGES_APPLIED);
        }).fail(function () {
            alertify.error(translations.HOTEDIT_SAVE_ERROR);
        });
    }
}

function SelectColorOnChange(valgiv) {
    var led = getTabLedById(signalSelected);   
    led.ActiveColour = valgiv.value;
    setUnsavedChangesState(true);
    renderInputPropsTemplate(led);
}

function SelectColorOffChange(valgiv) {
    var led = getTabLedById(signalSelected);   
    led.DefaultColour = valgiv.value;
    setUnsavedChangesState(true);
    renderInputPropsTemplate(led);
    renderIOSignalsTemplate(getTabById(signalSelected).id-1);
}

function OnKeyUpTBSearch() {
    var searchingString;
    searchingString = document.getElementById("tbSearch").value.toUpperCase();
    document.getElementById("leftColumn").innerHTML = "";
    for (var i = 0; i < llistaSenyals.length; i++) {
        if (llistaSenyals[i].toUpperCase().indexOf(searchingString) > -1) {
            document.getElementById("leftColumn").innerHTML += "<div draggable='true' ondragstart='drag(event, this.id)' class='signalFromRobot' id='" + llistaSenyals[i] + "'>" + llistaSenyals[i] + "</div>";
        }
    }
}

function RemoveInputAssignedSignal() {
    var led = getTabLedById(signalSelected);    
    led.InputSignal = null;
    setUnsavedChangesState(true);
    renderIOSignalsTemplate(getTabById(signalSelected).id-1);
    $("#ioPropertiesBox").empty();
}

function RemoveOutputAssignedSignal() {
    var button = getTabButtonById(signalSelected);
    button.OutputSignal = null;  
    setUnsavedChangesState(true);
    renderIOSignalsTemplate(getTabById(signalSelected).id-1);
    $("#ioPropertiesBox").empty();
}

function prepareContextMenus(){
    context.init({
        fadeSpeed: 100,
        filter: function ($obj) {},
        above: 'auto',
        preventDoubleContext: true,
        compress: false
    });

    context.attach('.input', [
        {header: 'Input'},
        {text: '<img id="trashicon" src="appImages/imgtrans.png" class="contextMenuItem" />'+translations.IO_SIGNALS_REMOVE_SIGNAL, href: 'javascript:RemoveInputAssignedSignal()', action: function (e) {}}
    ]);

    context.attach('.output', [
        {header: 'Output'},
        {text: '<img id="trashicon" src="appImages/imgtrans.png" class="contextMenuItem" />'+translations.IO_SIGNALS_REMOVE_SIGNAL, href: 'javascript:RemoveOutputAssignedSignal()', action: function (e) {}}
    ]);
        
    for (var key in ioSignalsData.Tabs){
        (function(id) {
            context.attach("#vtab_"+id, [
                {header: 'Tab'},
                {text: '<img id="trashicon" src="appImages/imgtrans.png" class="contextMenuItem" />'+translations.IO_SIGNALS_DISABLE_TAB,action: function (e) {
                       var tab = ioSignalsData.Tabs.find(x => x["id"] === parseInt(id));
                       tab.description = "";
                       $("#tbtab_"+tab.id).val(tab.description).siblings("a").html(tab.description);
                       setUnsavedChangesState(true);                        
                }}
            ]);
        })(ioSignalsData.Tabs[key]["id"]);        
    }
    
    context.settings({compress: true});
    $(document).on('mouseover', '.me-codesta', function () {
        $('.finale h1:first').css({opacity: 0});
        $('.finale h1:last').css({opacity: 1});
    });
    $(document).on('mouseout', '.me-codesta', function () {
        $('.finale h1:last').css({opacity: 0});
        $('.finale h1:first').css({opacity: 1});
    });
}

function disableTab(event){
    var tab = getTabById(event.target.id);
    tab.description = "";
}

function OnMainButtonClick() {
    var exit = true;
    if (unsavedChanges) {
        if (!confirm(translations.IO_EXIT_WITHOUT_APPLY + ", " + translations.IO_ARE_YOU_SURE)) {
            exit = false;
        }
    }
    if (exit) {
        window.location.href = "index.html"
    }
        
}

function prepareXml (signalsData){
    return window.GetCurrentStampAppVersion()
    .then(function (version) {
        var finalData = {
            CustomIOScreenData: {
                '@xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
                '@xmlns:xsd' : "http://www.w3.org/2001/XMLSchema",
                '@StampAppVersion': version,
                Tabs : {
                    HMIButtonLedTabData : []
                }
            }
        };
        for (var key in signalsData.Tabs) {
            var tab = signalsData.Tabs[key];
            var data = {
                '@Id': tab.id,
                Leds : {
                    HMILedData : []
                },
                Buttons : {
                    HMIButtonData: []
                },
                LabelText : tab.description
            }; 
            
            for (var ledkey in signalsData.Tabs[key].Leds) {
                var led = signalsData.Tabs[key].Leds[ledkey];
                var ledData = {
                    '@Id': led.id,
                    DefaultColour: led.DefaultColour,
                    ActiveColour: led.ActiveColour,
                    InputSignal: led.InputSignal,
                    LabelText: led.LabelText
                }; 
                
                data.Leds.HMILedData.push(ledData);
            }
            for (var buttonkey in signalsData.Tabs[key].Buttons) {
                var button = signalsData.Tabs[key].Buttons[buttonkey];
                var buttonData = {
                    '@Id': button.id,
                    ButtonType: button.ButtonType,
                    DefaultColour: button.DefaultColour,
                    ActiveColour: button.ActiveColour,
                    OutputSignal: button.OutputSignal,
                    InputSignal: button.InputSignal,
                    WarningMessage: button.WarningMessage,
                    LabelText: button.LabelText
                };
                
                data.Buttons.HMIButtonData.push(buttonData);
            }        
            finalData.CustomIOScreenData.Tabs.HMIButtonLedTabData.push(data);
        }
        return json2xml(JSON.parse(JSON.stringify(finalData))); 
    });    
}

function setUnsavedChangesState(state) {
    unsavedChanges = state;
    if (unsavedChanges) $(".btnApply").addClass("changesPending");
    else $(".btnApply").removeClass("changesPending");
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, '');
}

function dropOnTrash(ev) {
    ev.preventDefault();
    if (signalDragging.indexOf("input") > -1) {
        var led = getTabLedById(signalDragging);    
        led.InputSignal = null;
        setUnsavedChangesState(true);
        renderIOSignalsTemplate(getTabById(signalDragging).id-1);
        $("#ioPropertiesBox").empty();
    } else if (signalDragging.indexOf("output") > -1) {
        var button = getTabButtonById(signalDragging);
        button.OutputSignal = null;  
        setUnsavedChangesState(true);
        renderIOSignalsTemplate(getTabById(signalDragging).id-1);
        $("#ioPropertiesBox").empty();
    }
}

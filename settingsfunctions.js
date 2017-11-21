var url = {
    machine: "",
    pathlocation: "",
    ip: "",
    pathToImages: "",
    pathToXML: "",
    pathToXMLCBC: "",
    pathToIOSignals: ""
};
var alertify = window.alertify;

function NavBar() {
    url.machine = 'na';
    url.ip = window.location.href.replace("http://", "");
    url.ip = url.ip.split("/")[0];
    url.pathToImages = "/fileservice/~home/StampApp/Images/ProfileImages";
    url.pathToXML = "/fileservice/~home/StampApp/BlocTemplates/CurrentAssembly.xml";
    url.pathToXMLCBC = "/fileservice/~home/StampApp/ServiceData/Common/sAppServData.xml";
    url.pathToIOSignals = "/fileservice/~home/StampApp/sAppData/CustomScreenConfig.xml";
}
var translations = {};

function LoadLanguage() {
//> loadLanguageData is at file: loadxmldoc.js
    return window.LoadLanguageData(st.settings.lang)
            .then(function (data) {
                translations = data;
            });
}

function LoadSettings() {
//> loadSettings is at file: loadxmldoc.js
    return window.LoadSettingsData().done(function (data) {
        st = data;  //the 'st' global variable, will store the app settings.
    });
}

function OnLoadSettings() {
    NavBar();
    
    LoadSettings()
    .then(LoadLanguage)
    .then(function () {
        listdir = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData");
        ojsonListDir = xml2json(listdir, "");
        listdir = JSON.parse(ojsonListDir);
        lang = listdir.html.body.div.ul.li;

        if (!Array.isArray(lang)) {
            var nodeConcret = [{}];
            nodeConcret[0] = JSON.parse(JSON.stringify(lang));
            lang = nodeConcret;
        }

        aux = "";
        aux += "<label for='selectlanguage' id='S_LANGUAGE_SELECTED'></label>";
        aux += "<select id='selectlanguage' onchange='OnChangeLanguage(this.value);' class='selectlanguage'>";
        for (var i = 0; i < lang.length; i++) {
            language = lang[i]["@title"].replace(".xml", "");
            aux += "  <option value='" + language + "'>" + language + "</option>";
        }
        aux += "</select>";
        document.getElementById("languagebox").innerHTML = "";
        document.getElementById("languagebox").innerHTML += aux;
        document.getElementById("selectlanguage").value = st.settings.lang;
        CheckCurrentVersion();
        translateUserInterface();
    });
}

function translateUserInterface() {

    $('#S_LANGUAGE_SELECTED').html(translations.S_LANGUAGE_SELECTED);
    $('#S_EXPORT_PACKAGE_CONFIGURATION').html(translations.S_EXPORT_PACKAGE_CONFIGURATION);
    $('#S_EXPORT_PACKAGE').html(translations.S_EXPORT_PACKAGE);
    $('#S_IMPORT_PACKAGE_CONFIGURATION').html(translations.S_IMPORT_PACKAGE_CONFIGURATION);
    $('#I_SETTINGS').html(translations.I_SETTINGS);
}

function OnChangeLanguage(langgiv) {
    //st is a gloval variable.
    st.settings.lang = langgiv;
    LoadLanguage()
    .then(SaveSettings)
    .then(translateUserInterface);
}

function SaveSettings() {
    return window.GetCurrentStampAppVersion()
            .then(function (version) {
                st.settings['@StampAppVersion'] = version;
                var xmlsettings = json2xml(JSON.parse(JSON.stringify(st)));
                return window.SaveSettngsData('<?xml version="1.0" encoding="utf-8"?>\n' + xmlsettings);
            }).then(function () {
        alertify.success(translations.HOTEDIT_SAVED_SUCCESS);
    }).fail(function () {
        alertify.error(translations.HOTEDIT_SAVE_ERROR);
    });
}

function OnMainButtonClick() {
    document.getElementById('I_SETTINGS').style.animationDuration = '1.2s';
    document.getElementById('I_SETTINGS').style.animationName = 'mainboxanimationCorrect';
    window.setTimeout(ChargePageMain, 1000);
}

function ChargePageMain() {
    window.location.href = "index.html";
}

function w3Dropdown(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

function ConstructDate() {
    var d = new Date();
    return(d.getFullYear() + "-" + (+d.getMonth() + 1) + "-" + d.getDate());
}

function GetImagesNamesFromOjson(arrayofNames, ojson) {
    for (var i = 0; i < ojson.BlocAssembly.AllBlocs.Bloc.length; i++) {
        if (ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions) {
            if (ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription) {
                if (Array.isArray(ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription)) {
                    for (var j = 0; j < ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.length; j++) {
                        arrayofNames.push(JSON.parse(JSON.stringify(ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription[j].BackgroundImage)));
                    }
                } else {
                    arrayofNames.push(JSON.parse(JSON.stringify(ojson.BlocAssembly.AllBlocs.Bloc[i].ProfilesDescriptions.GraphicProfileDescription.BackgroundImage)));
                }
            }
        }
    }
}

var arrayLanguages = [];
function onDropDownExport() {
    var html = "";
    html += "<br><b>Languages:</b><br>";
    for (var i = 0; i < lang.length; i++) {
        html += "<input id='chkLangExport_" + lang[i]["@title"] + "' class='w3-check' type='checkbox' checked='checked'>";
        html += "<label class='w3-validate'>" + lang[i]["@title"] + "</label><br>";
    }
    document.getElementById("divExportLanguages").innerHTML = html;
}

function loadImgAsync(source) {
    return $.ajax({
        url: source,
        type: "GET",
        dataType: "binary",
        responseType: 'arraybuffer',
        processData: false
    });
}

function getAllProfileImages(filenames) {
    var requests = [];
    for (var i = 0; i < filenames.length; i++) {
        requests.push(loadImgAsync(url.pathToImages + "/" + filenames[i]));
    }
    return requests;
}


function createDirectory(dir_name)
{
	//according to RESTfull apps, We create a directory.
	var lang_filepath = "/fileservice/~home/StampApp/LanguageData" + "/" + dir_data.split("/")[1];
	//console.log("try POST at: " + lang_filepath);
	//console.log("datain: " +  dir_data);
	//console.log("split: " +  dir_data.split("/")[1] )
	$.ajax({//generate directory
		type: "POST",
		url: lang_filepath,
		data: {  //reference: http://developercenter.robotstudio.com/webservice/api_reference
			"fs-newname": "/" +  dir_data.name.split("/")[1],
			"fs-action": "create"
		}
	}).done(function ( ) {
		
		//console.log('POST new language directory generated- ' + lang_filepath);
		//after the folder is created, we move the languaje data in it.

	}).fail(function (jqXHR, textStatus, errorThrown) {
		//console.log("ERROR in POST:  path:" + lang_filepath  + " -name.split:: "+  dir_data.name.split("/")[1] + " - " + textStatus);
	});
	
}
//this funtion loads the languaje data.
function loadLanguageData(lang_data, data) {
	

	if( lang_data.indexOf(".xml") > -1) //lets asume the only file type is XML
	{
		var myxmlfilepath = "/fileservice/~home/StampApp/LanguageData/" + lang_data.replace("Languages/", "");
		//console.log("PATH: " + myxmlfilepath);
		$.ajax({
			type: "PUT",
			url: myxmlfilepath,
			data: data,
			dataType: "xml",
		}).done(function ( ) {
			//console.log('Language: PUT ok lang- ' + myxmlfilepath);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			//console.log("Language: fail at PUT the file" + myxmlfilepath, errorThrown, textStatus);
		});
	}
    else{
		
		$.ajax({
		type: "HEAD",
		url: myxmlfilepath,
		}).done(function ( ) {
			//console.log("the " + lang_data+ " already exists");
		}).fail(function (jqXHR, textStatus, errorThrown) {
			//console.log("Language: fail at PUT the file" + myxmlfilepath, errorThrown, textStatus);
			//console.log("this directory don't exist.. .have to be created");
			createDirectory(lang_data);
		});
	}
                              
	
	
	/*
    var load_lang_data_path = "/fileservice/~home/StampApp/LanguageData/" + lang_data.replace("Languages/", "");
    //console.log("PATH: " + load_lang_data_path);
    $.ajax({
        type: "PUT",
        url: load_lang_data_path,
        data: data,
        dataType: "xml",
    }).done(function ( ) {
        //console.log('loaded languaje data OK: '+ lang_data +" - "  + load_lang_data_path);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        //console.log("ERROR in loading languajeData: "+ lang_data + " - " + load_lang_data_path + " - " + textStatus);
    }); */
}

//this function creates the folder for the Languages, and if succed it loads the languaje data.
function zipLanguageData(lang_name) {
	
	
		
    gzipEntry.async("string").then(function (data) {

                loadLanguageData(lang_name, data); //defined above
				
    });	
	
	
    //zipEntry has to exist in the calling funtion.
   /* gzipEntry.async("string").then(function (data) {

        //according to RESTfull apps, We create a directory.
        var lang_filepath = "/fileservice/~home/StampApp/LanguageData" + "/" + lang_name.split("/")[1];
        //console.log("try POST at: " + lang_filepath);
		//console.log("datain: " + lang_name);
		//console.log("split: " + lang_name.split("/")[1] )
        $.ajax({//generate directory
            type: "POST",
            url: lang_filepath,
            data: {  //reference: http://developercenter.robotstudio.com/webservice/api_reference
                "fs-newname": "/" + lang_name.split("/")[1],
                "fs-action": "create"
            }
        }).done(function ( ) {
            
			//console.log('new language directory generated- ' + lang_filepath);
            //after the folder is created, we move the languaje data in it.

        }).fail(function (jqXHR, textStatus, errorThrown) {
            //console.log("ERROR in POST:  path:" + lang_filepath  + " -name.split:: "+ lang_name.split("/")[1] + " - " + textStatus);
        });
    });*/
	

	
}

//this function is for zipping the pngs images.
function zipPNG(png_name) {
    //zipEntry has to exist in the calling funtion.
    gzipEntry.async("blob").then(function (blob) {
        pngfilepath = "/fileservice/~home/StampApp/Images/" + png_name;
        $.ajax({
            type: "PUT",
            url: pngfilepath,
            data: blob,
            contentType: 'image/png', // or compute it
            processData: false
        }).done(function ( ) {
            //console.log('PUT zipped png- ' + png_name);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //console.log("PUT fail png: "  + png_name + errorThrown, textStatus);
        });
    });
}

//this function zipps the .mods
function zipMod(mod_name) {
	
    //a variable named zipEntry has to exist in the calling funtion.
    gzipEntry.async("string").then(function (data) {

        modfilepath = "/fileservice/~home/StampApp/ActionsData/" + mod_name.replace("ActionModules/", "");
        modulesList.push(JSON.parse(JSON.stringify(mod_name.replace("ActionModules/", ""))));

        //console.log("PATH: " + modfilepath);
        $.ajax({
            type: "PUT",
            url: modfilepath,
            data: data,
            dataType: "xml",
        }).done(function ( ) {
            //console.log('MOD: zipped OK mod- : ' + mod_name + " path: "  + modfilepath);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //console.log("MOD: err zip mod: " + mod_name + " - "  + errorThrown, textStatus);
        });
    });
}

//this function zips the S9 file.
function zipS9() {
    //zipEntry has to exist in the calling funtion.
    gzipEntry.async("string").then(function (data) {

        modfilepath = "/fileservice/~home/StampApp/PartData/sAppPart0000/s9.mod";

        //console.log("PATH: " + modfilepath);

        $.ajax({
            type: "PUT",
            url: modfilepath,
            data: data,
            dataType: "xml",
        }).done(function ( ) {
            //console.log('put loaded ok mod- ' + modfilepath);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            //console.log("S9 err mod: " + errorThrown, textStatus);
        });
    });
}

//this function zips the .xml files.
function zipXml(xml_name) {
    //zipEntry has to exist in the calling funtion.
    gzipEntry.async("string").then(function (data) {
        xmlfilepath = "";
		var data2="";
        if ((xml_name == "CurrentAssembly.xml") && (importConfig.assembly)) {
            data2 = data;
            xmlfilepath = "/fileservice/~home/StampApp/BlocTemplates/" + xml_name; //arrFilePath[i]
        } else if ((xml_name == "sAppServData.xml") && (importConfig.common)) {
            data2 = data.replace("LastModifiedFromConf=\"false\"", "LastModifiedFromConf=\"true\"");
            xmlfilepath = "/fileservice/~home/StampApp/ServiceData/Common/" + xml_name;
        } else if ((xml_name == "CustomScreenConfig.xml") && (importConfig.iosignals)) {
            data2 = data;
            xmlfilepath = url.pathToIOSignals;
        } /*else{
			//fail safe fallback. is everything is ok, it never would reach here.
			//console.log("zipXml Warning: unknown .XML");
		}*/
		
        //console.log("PATH: " + xmlfilepath);
		
        if (xmlfilepath != "") {
            $.ajax({
                type: "PUT",
                url: xmlfilepath,
                data: data2,
                dataType: "xml",
            }).done(function ( ) {
                //console.log('put xipped xml- ' + xml_name + " path:" + xmlfilepath);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //console.log("Error zipping xml file name: " + xml_name + " - " +errorThrown, textStatus);
            });
      
		}/* else {
			//fail safe fallback.
			//console.log("WARNING: xmlfile path is empty");
		}*/
		
		}); //end of ZipEntry
	
};


//this function will load the modules, when new parts are imported.
function modulesLoad(){
  //conditional load of modules:
  
    if (importConfig.modules == true) {
      //  setTimeout(function () { its not really needed.
            var loadmodURL = "http://" + window.location.href.replace("http://", "").split("/")[0] + "/rw/rapid/tasks/T_ROB1?action=loadmod";
            var unloadmodURL = "http://" + window.location.href.replace("http://", "").split("/")[0] + "/rw/rapid/tasks/T_ROB1?action=unloadmod";

            //console.log("loadmodURL: " + loadmodURL);

            var rwServiceResource = new XMLHttpRequest();
            rwServiceResource.onreadystatechange = function () {
                if (rwServiceResource.readyState == 4 && (rwServiceResource.status == 204 || rwServiceResource.status == 1223)) {
                    //console.log("UNLOAD -STATUS 204: rapid data value set to = " + "sAppPartData");
                } else if (rwServiceResource.readyState == 4 && rwServiceResource.status != 204) // no content
                {
                    //console.log("UNLOAD -STATUS 204: error rapid data value set status=" + rwServiceResource.status);
                }
            };

            // get the resource
            //console.log(loadmodURL);
            rwServiceResource.open("POST", unloadmodURL, false);
            rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            rwServiceResource.send("module=sAppPartData");

            var rwServiceResource2 = new XMLHttpRequest();
            rwServiceResource2.onreadystatechange = function () {
                //The status 1223 - whas an old unofficial status used by Internet Explorer (Microsoft).
                //status 204 - there is no content in the response payload body.
                if (rwServiceResource2.readyState == 4 && (rwServiceResource2.status == 204 || rwServiceResource2.status == 1223)) {
                    //console.log("LOAD - rapid data value set to= " + "sAppPartData");
                } else if (rwServiceResource2.readyState == 4 && rwServiceResource2.status != 204) // no content
                {
                    //console.log("LOAD - error rapid data value set status=" + rwServiceResource2.status + "sAppPartData");
                }
            };

            // get the resource
            //console.log(loadmodURL);
            rwServiceResource2.open("POST", loadmodURL, false);
            rwServiceResource2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            rwServiceResource2.send("modulepath=$HOME/StampApp/PartData/sAppPart0000/sAppPartData.mod");


            var arrayFileNamesMod = [];
            var xmlModules = LoadModulesFromRapid("http://" + url.ip + "/rw/rapid/modules?task=T_ROB1");
            var modulesName = xmlModules.getElementsByClassName("name");

            for (var i = 0; i < modulesName.length; i++) {//cal filtrar en funció si té actions
                if (modulesName[i].childNodes[0].nodeValue.indexOf("Actions") > -1) {
                    arrayFileNamesMod.push(modulesName[i].childNodes[0].nodeValue);
                }
            }

            for (var i = 0; i < modulesList.length; i++) {
                var rwServiceResource3 = new XMLHttpRequest();

                // the function below, is called when data has been received
                rwServiceResource3.onreadystatechange = function () {
                    // no content, known bug in IE returns 1223 instead of 204
                    if (rwServiceResource3.readyState == 4 && (rwServiceResource3.status == 204 || rwServiceResource3.status == 1223)) {
                        //console.log("UNLOAD - rapid data value set to=" + modulesList[i]);
                    } else if (rwServiceResource3.readyState == 4 && rwServiceResource3.status != 204) // no content
                    {
                        //console.log("UNLOAD - error rapid data value set status=" + rwServiceResource3.status);
                    }
                };

                // get the resource
                if (arrayFileNamesMod.indexOf(modulesList[i].replace(".mod", "")) > -1) {
                    //console.log(loadmodURL);
                    rwServiceResource3.open("POST", unloadmodURL, false);
                    rwServiceResource3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    rwServiceResource3.send("module=" + modulesList[i].replace(".mod", ""));
                }

                //console.log(modulesList[i]);

                var rwServiceResource4 = new XMLHttpRequest();

                // function is called when data has been received
                rwServiceResource4.onreadystatechange = function () {
                    // no content, known bug in IE returns 1223 instead of 204
                    if (rwServiceResource4.readyState == 4 && (rwServiceResource4.status == 204 || rwServiceResource4.status == 1223)) {
                        //console.log("LOAD - rapid data value set to=" + modulesList[i]);
                    } else if (rwServiceResource4.readyState == 4 && rwServiceResource4.status != 204) // no content
                    {
                        //console.log("LOAD - error rapid data value set status=" + rwServiceResource4.status + modulesList[i]);
                    }
                };

                // get the resource
                //console.log(loadmodURL);
                rwServiceResource4.open("POST", loadmodURL, false);
                rwServiceResource4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                rwServiceResource4.send("modulepath=$HOME/StampApp/ActionsData/" + modulesList[i]);

            }

      //  }, 3000); //its not really needed.
    }
}


function onBtnExportPackage() {
    AutoProgressBar();
    var ExportConfig = {
        chkExportAssembly: document.getElementById('chkExportAssembly').checked,
        chkExportCommon: document.getElementById('chkExportCommon').checked,
        chkExportModules: document.getElementById('chkExportModules').checked,
        chkExportIOSignals: document.getElementById('chkExportIOSignals').checked
    };
	
    //console.log(ExportConfig);
    var zip = new JSZip();
    var imagesNamesInXMLAssembly = [];
    var imagesNamesInXMLCommons = [];
    var xmlDocFile = LoadXMLDoc(url.pathToXML);
    var ojsonFile = xml2json(xmlDocFile, "");
    var fileCharged = JSON.parse(ojsonFile);
    GetImagesNamesFromOjson(imagesNamesInXMLAssembly, fileCharged);
    var fileDuplicated = JSON.parse(JSON.stringify(fileCharged));
    assemblyFile = json2xml(fileDuplicated);
    var xmlDocFile = LoadXMLDoc(url.pathToXMLCBC);
    var ojsonFile = xml2json(xmlDocFile, "");
    var fileCharged = JSON.parse(ojsonFile);
    GetImagesNamesFromOjson(imagesNamesInXMLCommons, fileCharged);
    var fileDuplicated = JSON.parse(JSON.stringify(fileCharged));
    commonFile = json2xml(fileDuplicated);
    if (ExportConfig.chkExportAssembly) {
        zip.file("CurrentAssembly.xml", assemblyFile);
    }
    if (ExportConfig.chkExportCommon) {
        zip.file("sAppServData.xml", commonFile);
    }
    if (ExportConfig.chkExportIOSignals) {
        var xmlSignalsText = LoadXMLDocText(url.pathToIOSignals);
        zip.file("CustomScreenConfig.xml", xmlSignalsText);
    }

    var imagesFileNames = [];
    var imagesFolder = zip.folder("ProfileImages");
    if (ExportConfig.chkExportAssembly) {
        for (var u = 0; u < imagesNamesInXMLAssembly.length + 1; u++) {
            if ((imagesNamesInXMLAssembly[u] !== "00noexist.png") && (imagesNamesInXMLAssembly[u] !== "00noimage.png") && (imagesNamesInXMLAssembly[u] !== "00uploadimage.png") && (imagesNamesInXMLAssembly[u] !== undefined)) {
                imagesFileNames.push(imagesNamesInXMLAssembly[u]);
            }
        }
    }

    if (ExportConfig.chkExportCommon) {
        for (var u = 0; u < imagesNamesInXMLCommons.length + 1; u++) {
            if ((imagesNamesInXMLCommons[u] !== "00noexist.png") && (imagesNamesInXMLCommons[u] !== "00noimage.png") && (imagesNamesInXMLCommons[u] !== "00uploadimage.png") && (imagesNamesInXMLCommons[u] !== undefined)) {
                imagesFileNames.push(imagesNamesInXMLCommons[u]);
            }
        }
    }

    var requests = getAllProfileImages(imagesFileNames);
    $.when.apply(null, requests).then(function () {
        $.each(arguments, function (i, row) {
            if (row[1] == 'success') {
                imagesFolder.file(imagesFileNames[i], row[0]);
            }
        });
    }).then(function () {
        var arrayFileNamesMod = [];
        if (ExportConfig.chkExportModules) {
            var modFolder = zip.folder("ActionModules");
            var listdir = LoadXMLDoc("/fileservice/~home/StampApp/ActionsData");
            var ojsonListDir = xml2json(listdir, "");
            listdir = JSON.parse(ojsonListDir);
            for (var u = 0; u < listdir.html.body.div.ul.li.length; u++) {
                arrayFileNamesMod.push(JSON.parse(JSON.stringify(listdir.html.body.div.ul.li[u]["@title"])));
                $.get("/fileservice/~home/StampApp/ActionsData/" + listdir.html.body.div.ul.li[u]["@title"], function (data, status) {
                    for (var k = 0; k < arrayFileNamesMod.length; k++) {
                        if (data.indexOf(arrayFileNamesMod[k].replace(".mod", "")) > -1) {
                            modFolder.file(arrayFileNamesMod[k], data);
                        }
                    }
                });
            }
            $.get("/fileservice/~home/StampApp/PartData/sAppPart0000/sAppPartData.mod", function (data, status) {
                zip.file("PartData0000.mod", data);
            });
        }

        var arrayLanguages = [];
        for (var i = 0; i < lang.length; i++) {
            arrayLanguages.push(document.getElementById('chkLangExport_' + lang[i]["@title"]).checked);
        }
        if (arrayLanguages.length > 0) {
            var languagesFolder = zip.folder("Languages");
            for (var u = 0; u < arrayLanguages.length; u++) {
                if (document.getElementById("chkLangExport_" + lang[u]["@title"]).checked == true) {
                    var foldLang = languagesFolder.folder(lang[u]["@title"]);
                    var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + lang[u]["@title"] + "/sAppFPLiterals.xml");
                    if (xmlDocLangAux)
                    {
	                    var ojsonLang = xml2json(xmlDocLangAux, "");
	                    var langCharged = JSON.parse(ojsonLang);
	                    var langFPDuplicated = JSON.parse(JSON.stringify(langCharged));
	                    xmlDocLangFP = json2xml(langFPDuplicated);
                    }

                    var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + lang[u]["@title"] + "/sAppConfLiterals.xml");
                    var ojsonLang = xml2json(xmlDocLangAux, "");
                    var langCharged = JSON.parse(ojsonLang);
                    var langConfigDuplicated = JSON.parse(JSON.stringify(langCharged));
                    xmlDocLangConfig = json2xml(langConfigDuplicated);
                    
                    if (xmlDocLangFP) {
                    foldLang.file("sAppFPLiterals.xml", xmlDocLangFP);
                    }
                    foldLang.file("sAppConfLiterals.xml", xmlDocLangConfig);
                }
            }
        }
        setTimeout(function () {
            zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        var dateFile;
                        dateFile = ConstructDate();
                        saveAs(content, "packageStampApp_" + dateFile + ".zip");
                        alertify.success("configuration package exported");
                    });
        }, 3000);
    });
}

function AutoProgressBar() {
    document.getElementById('disablingDiv').style.display = 'block';
    var aux = "";
    aux += "<div class='w3-progress-container'>";
    aux += "  <div id='myBar' class='w3-progressbar w3-green' style='width:1%'></div>";
    aux += "</div>";
    document.getElementById('disablingDiv').innerHTML = aux;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 35); //animationframe is better.
    function frame() {
        if (width >= 100) {
            clearInterval(id);
            document.getElementById('disablingDiv').style.display = 'none';
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}


var globalevt; //this gloval variable, is for passing data evt, 
//between the function: OnBtnImportPackageConfiguration()
//to the function: onBtnImportSelectedPackage()

function OnBtnImportPackageConfiguration(evt) {
//this function allows to configure what data to import: [Assembly, Commons,
//IO_signals, Actions_Modules and Languages. 
//It also ask us for the file name to import, showing us a explorer window.

    globalevt = evt;
    if (document.getElementById("zipfile_input").value != "") {
        var files = evt.target.files;
        var f = files[0];
        JSZip.loadAsync(f).then(function (zip) {
            var html = "<div>";
            zip.forEach(function (relativePath, zipEntry) {
                if (zipEntry.name == "CurrentAssembly.xml") {
                    html += "<input id='chkImportAssembly' class='w3-check' type='checkbox' checked='checked'>";
                    html += "<label for='chkImportAssembly' class='w3-validate'>Assembly</label><br>";
                } else if (zipEntry.name == "sAppServData.xml") {
                    html += "<input id='chkImportCommon' class='w3-check' type='checkbox' checked='checked'>";
                    html += "<label for='chkImportCommon' class='w3-validate'>Commons</label><br>";
                } else if (zipEntry.name == "CustomScreenConfig.xml") {
                    html += "<input id='chkImportIOSignals' class='w3-check' type='checkbox' checked='checked'>";
                    html += "<label for='chkImportIOSignals' class='w3-validate'>I/O Signals</label><br>";
                } else if (zipEntry.name == "ActionModules/") {
                    html += "<input id='chkImportModules' class='w3-check' type='checkbox' checked='checked'>";
                    html += "<label for='chkImportModules' class='w3-validate'>Actions Modules</label><br>";
                } else if (zipEntry.name == "Languages/") {
                    html += "Languages:<br>";
                } else if ((zipEntry.name.indexOf("Languages/") > -1) && (zipEntry.name.indexOf("sAppFPLiterals.xml") > -1)) {
                    html += "<input id='chkLangExport_" + zipEntry.name.split("/")[1] + "' class='w3-check' type='checkbox' checked='checked'>";
                    html += "<label class='w3-validate'>" + zipEntry.name.split("/")[1] + "</label><br>";
                }
            });

            html += "<div onclick='onBtnImportSelectedPackage()' class='s-button o-pullright'>" + translations.S_IMPORT_PACKAGE + "</div>";
            html += "</div>";
            document.getElementById("idPackageManagerContentImport").innerHTML = html;
        }, function (e) {
            //console.log("error zip, " + e.message);
        });
    }
}


var importConfig = ""; //this gloval var, will storage the prper values for
//importing data.

var modulesList = []; //gloval variable to keep the modules

var gzipEntry;


function onBtnImportSelectedPackage() {
//this function actually performs the import of selected zip package, selected at
//the previous function:  OnBtnImportPackageConfiguration().

    evt = globalevt; //global varialbe
	gzipEntry= ""; //init clear
	
    //AutoProgressBar();
    
    var modulesImported = false;

    importConfig = {
        assembly: (document.getElementById('chkImportAssembly') !== null && document.getElementById('chkImportAssembly').checked),
        common: (document.getElementById('chkImportCommon') !== null && document.getElementById('chkImportCommon').checked),
        modules: (document.getElementById('chkImportModules') !== null && document.getElementById('chkImportModules').checked),
        iosignals: (document.getElementById('chkImportIOSignals') !== null && document.getElementById('chkImportIOSignals').checked),
    };
    var modulesList = [];
    //console.log("selected import configuration:");
    console.table(importConfig);
    if (document.getElementById("zipfile_input").value != "") {

        ////console.log("--------------------");
        ////console.log("starting importation");
        ////console.log("--------------------");

      var robot_exec_status = "";  //variable to get the response of the following calling.

		//call to get the Rapid execution status.
        //if the status is not 'stopped' then the modules must not be loaded.
        $.ajax({
            url: "/rw/rapid/execution?json=1", //the parameter: '?json=1' is for asking for a json file format.
            tySpe: "GET",
            dataType: "json",
            cache: false, //this is for control the browser cache.
            async: true, //false is for sync calls - this is NON-blocking.(async).
            headers: {'pragma': 'no-cache',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT',
            },
            success: function (data) {
                //if the answer is empty or null- report Failure.
                if (!data) {
                    //console.log("Answer to rapid_execution_status EMPTY!");
                }
                else { //if the data has something.
                   
                    robot_exec_status = data._embedded._state[0].ctrlexecstate;
                    
					if (robot_exec_status != 'stopped')
                    { //IF THE ROBOT IS NOT Stopped
				
                        //console.log("ROBOT EXECUTION STATUS != STOPPED");
                        //console.log("ROBOT EXECUTION STATUS is " + robot_exec_status);
                      
                        //if the execution status of the robot is not stopped, then we
                        //will not enable the load of the scripts. 
                        importConfig.modules = false;
                        //we make a warning - when the warning dialog, is closed
                        //the import process will continue.
                        $('#warningDialog').toggle();
						
						//the process will continue, when the OK button is acknolege at the Warning Dialog.
                        //console.log("file rapid_execution_status GET OK");
						//console.log(data);
						//console.log("rapid status: " + data._embedded._state[0].ctrlexecstate);
						
                    } else  if( robot_exec_status == 'stopped' )//when the execution status is Stopped, the modules can be imported without problem.
                    { //IF THE ROBOT IS stopped.
					
						//console.log("rapid status: " + data._embedded._state[0].ctrlexecstate);
                        onBtnImportSelectedPackage_2();
						
                    } else //fallback. actually it never should reach here.
					{
						//console.log("possible error- robot_exec_status: " + robot_exec_status);
					}
                }
            },
            error: function (jqXHR, Status, error_string) {
                //if the call GET, was not processed ok.
                //console.log("file reapid_execution_status GET KO");
                //console.log("STATUS: " + Status);
                //console.log("Error: " + error_string);
            }
          });
	}
}
		
//function launched, when the Warning dialog is 
function WarnDialogNotStoppedAck(){
	
	//closes the dialog
	 $('#warningDialog').toggle();

	//continue with the import process
	onBtnImportSelectedPackage_2();
}		
		
    
        
        
function onBtnImportSelectedPackage_2() {

	AutoProgressBar();
	
        var importedFileName;
        importedFileName = document.getElementById("zipfile_input").value.replace("C:\\fakepath\\", "");
        //console.log("filename: " + importedFileName);
        var files = evt.target.files;
        var f = files[0];

        var dateBefore = new Date();
        JSZip.loadAsync(f).then(function (zip) {
            var dateAfter = new Date();
            //console.log(" (loaded in " + (dateAfter - dateBefore) + "ms)");

        var i = 0; //TODO: ¿is this even used??

        arrFilePath = []; //intialization of the array that contains all the relative paths.

		//for each zip file we evaluate it:
            zip.forEach(function (relativePath, zipEntry) {
				
			gzipEntry = zipEntry; //gzipEntry is a gloval variable.

            if ((zipEntry.name.indexOf(".xml") > -1)
                    && (zipEntry.name.indexOf("/") == -1)) {

				zipXml(zipEntry.name);
				/*
				//adds the relativePath to the array of paths
                    arrFilePath.push(JSON.parse(JSON.stringify(relativePath)));

                    auxFileName = JSON.parse(JSON.stringify(relativePath));
                    zipEntry.async("string").then(function (data) {
				xmlfilepath = ""; //initialization
                        if ((zipEntry.name == "CurrentAssembly.xml") && (importConfig.assembly)) {
                            data2 = data;
                            xmlfilepath = "/fileservice/~home/StampApp/BlocTemplates/" + zipEntry.name; //arrFilePath[i]
                        } else if ((zipEntry.name == "sAppServData.xml") && (importConfig.common)) {
                            data2 = data.replace("LastModifiedFromConf=\"false\"", "LastModifiedFromConf=\"true\"");
                            xmlfilepath = "/fileservice/~home/StampApp/ServiceData/Common/" + zipEntry.name;
                        } else if ((zipEntry.name == "CustomScreenConfig.xml") && (importConfig.iosignals)) {
                            data2 = data;
                            xmlfilepath = url.pathToIOSignals;
                        }
                        
						//console.log("PATH: " + xmlfilepath);
                        if (xmlfilepath != "") {
                            $.ajax({
                                type: "PUT",
                                url: xmlfilepath,
                                data: data2,
                                dataType: "xml",
                            }).done(function ( ) {
                                //console.log('XML: PUT ok xml- ' + xmlfilepath);
                            }).fail(function (jqXHR, textStatus, errorThrown) {
                                //console.log("XML: fail call to PUT: " + xmlfilepath, errorThrown, textStatus);
                            });
                        }
                        i++;
                    });
					
					*/	
                } else if (zipEntry.name.indexOf(".mod") > -1 && (zipEntry.name.indexOf("/") > -1)) {

					zipMod(zipEntry.name);
					/*
                    zipEntry.async("string").then(function (data) {
                        if (importConfig.modules == true) {
                            modfilepath = "/fileservice/~home/StampApp/ActionsData/" + zipEntry.name.replace("ActionModules/", "");
                            modulesImported = true;
                            modulesList.push(JSON.parse(JSON.stringify(zipEntry.name.replace("ActionModules/", ""))));
                        }
                        //console.log("PATH: " + modfilepath);
                        $.ajax({
                            type: "PUT",
                            url: modfilepath,
                            data: data,
                            dataType: "xml",
                        }).done(function ( ) {
                            //console.log('MOD: PUT ok mod- ' + modfilepath);
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            //console.log("MOD: fail at PUT mod: " + modfilepath,	 errorThrown, textStatus);
                        });
                    });
					*/
                } else if (zipEntry.name.indexOf("PartData0000.mod") > -1) {

					zipS9();
					/*
                    zipEntry.async("string").then(function (data) {
                        if (importConfig.modules == true) {
                            modfilepath = "/fileservice/~home/StampApp/PartData/sAppPart0000/s9.mod";
                        }

                        //console.log("PATH: " + modfilepath);
                        $.ajax({
                            type: "PUT",
                            url: modfilepath,
                            data: data,
                            dataType: "xml",
                        }).done(function ( ) {
                            //console.log('put correctly mod- ' + modfilepath);
                            //            //console.log('put correctly '  + xmlfilepath);
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            //console.log("err mod: " + errorThrown, textStatus);
                        });
                    });
					*/
                } else if (zipEntry.name.indexOf(".png") > -1) {

				
					zipPNG(zipEntry.name);
					/*
                    zipEntry.async("blob").then(function (blob) {
                        pngfilepath = "/fileservice/~home/StampApp/Images/" + zipEntry.name;
                        $.ajax({
                            type: "PUT",
                            url: pngfilepath,
                            data: blob,
                            contentType: 'image/png', // or compute it
                            processData: false
                        }).done(function ( ) {
                            //console.log('PNG: PUT ok png- ' + zipEntry.name);
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            //console.log("PNG: fail at PUT png: " + pngfilepath + " "+ errorThrown, textStatus);
                        });
                    });
					*/
                } else if (zipEntry.name.indexOf("Languages/") > -1) {
                    if (zipEntry.name.split("/")[1] != "") {
                        if (document.getElementById("chkLangExport_" + zipEntry.name.split("/")[1]).checked == true) {
                          
						  zipLanguageData(zipEntry.name);
						/*
                            zipEntry.async("string").then(function (data) {

                                xmlfilepath = "/fileservice/~home/StampApp/LanguageData";
                                //console.log("PATH: " + xmlfilepath);
                                $.ajax({//generate directory
                                    type: "PUT",
                                    url: xmlfilepath,
                                    data: {
                                        "fs-newname": zipEntry.name.split("/")[1],
                                        "fs-action": "create"
                                    }
                                }).done(function ( ) {
                                    //console.log('Language: POST: new directory generated- ' + xmlfilepath);

                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                    //console.log("Language: fail at POST file: " + zipEntry.name, errorThrown, textStatus);
                                });
								
                                setTimeout(function () {
                                    xmlfilepath = "/fileservice/~home/StampApp/LanguageData/" + zipEntry.name.replace("Languages/", "");
                                    //console.log("PATH: " + xmlfilepath);
                                    $.ajax({
                                        type: "PUT",
                                        url: xmlfilepath,
                                        data: data,
                                        dataType: "xml",
                                    }).done(function ( ) {
                                        //console.log('Language: PUT ok lang- ' + xmlfilepath);
                                    }).fail(function (jqXHR, textStatus, errorThrown) {
                                        //console.log("Language: fail at PUT the file" + xmlfilepath, errorThrown, textStatus);
                                    });
                                }, 500);

						

                            });	*/	
                        }
                    }
                }
            });
        }, function (e) {
            //console.log("ZIP - error zip, " + e.message);
        }).then(modulesLoad);
		
		/*
        setTimeout(function () {
            if (importConfig.module == true) {
                var loadmodURL = "http://" + window.location.href.replace("http://", "").split("/")[0] + "/rw/rapid/tasks/T_ROB1?action=loadmod";
                var unloadmodURL = "http://" + window.location.href.replace("http://", "").split("/")[0] + "/rw/rapid/tasks/T_ROB1?action=unloadmod";
                //console.log(loadmodURL);
                var rwServiceResource = new XMLHttpRequest();
                rwServiceResource.onreadystatechange = function () {
                    if (rwServiceResource.readyState == 4 && (rwServiceResource.status == 204 || rwServiceResource.status == 1223)) {
                        //console.log("UNLOAD - rapid data value set to = " + "sAppPartData");
                    } else if (rwServiceResource.readyState == 4 && rwServiceResource.status != 204) // no content
                    {
                        //console.log("UNLOAD - error rapid data value set status=" + rwServiceResource.status);
                    }
                }
                // get the resource
                //console.log(loadmodURL);
                rwServiceResource.open("POST", unloadmodURL, false);
                rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                rwServiceResource.send("module=sAppPartData");
                ////console.log(modulesList[i]);
                var rwServiceResource = new XMLHttpRequest();
                rwServiceResource.onreadystatechange = function () {
                    if (rwServiceResource.readyState == 4 && (rwServiceResource.status == 204 || rwServiceResource.status == 1223)) {
                        //console.log("LOAD - rapid data value set to=" + "sAppPartData");
                    } else if (rwServiceResource.readyState == 4 && rwServiceResource.status != 204) // no content
                    {
                        //console.log("LOAD - error rapid data value set status=" + rwServiceResource.status + "sAppPartData");
                    }
                }
                // get the resource
                //console.log(loadmodURL);
                rwServiceResource.open("POST", loadmodURL, false);
                rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                rwServiceResource.send("modulepath=$HOME/StampApp/PartData/sAppPart0000/sAppPartData.mod");
                var arrayFileNamesMod = [];
                var xmlModules = LoadModulesFromRapid("http://" + url.ip + "/rw/rapid/modules?task=T_ROB1");
                var modulesName = xmlModules.getElementsByClassName("name");
                for (var i = 0; i < modulesName.length; i++) {//cal filtrar en funció si té actions
                    if (modulesName[i].childNodes[0].nodeValue.indexOf("Actions") > -1) {
                        arrayFileNamesMod.push(modulesName[i].childNodes[0].nodeValue);
                    }
                }
                for (var i = 0; i < modulesList.length; i++) {
                    var rwServiceResource = new XMLHttpRequest();
                    // function is called when data has been received
                    rwServiceResource.onreadystatechange = function () {
                        // no content, known bug in IE returns 1223 instead of 204
                        if (rwServiceResource.readyState == 4 && (rwServiceResource.status == 204 || rwServiceResource.status == 1223)) {
                            //console.log("UNLOAD - rapid data value set to=" + modulesList[i]);
                        } else if (rwServiceResource.readyState == 4 && rwServiceResource.status != 204) // no content
                        {
                            //console.log("UNLOAD - error rapid data value set status=" + rwServiceResource.status);
                        }
                    }
                    // get the resource
                    if (arrayFileNamesMod.indexOf(modulesList[i].replace(".mod", "")) > -1) {
                        //console.log(loadmodURL);
                        rwServiceResource.open("POST", unloadmodURL, false);
                        rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        rwServiceResource.send("module=" + modulesList[i].replace(".mod", ""));
                    }
                    ////console.log(modulesList[i]);
                    var rwServiceResource = new XMLHttpRequest();
                    // function is called when data has been received
                    rwServiceResource.onreadystatechange = function () {
                        // no content, known bug in IE returns 1223 instead of 204
                        if (rwServiceResource.readyState == 4 && (rwServiceResource.status == 204 || rwServiceResource.status == 1223)) {
                            //console.log("LOAD - rapid data value set to=" + modulesList[i]);
                        } else if (rwServiceResource.readyState == 4 && rwServiceResource.status != 204) // no content
                        {
                            //console.log("LOAD - error rapid data value set status=" + rwServiceResource.status + modulesList[i]);
                        }
                    }
                    // get the resource
                    //console.log(loadmodURL);
                    rwServiceResource.open("POST", loadmodURL, false);
                    rwServiceResource.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    rwServiceResource.send("modulepath=$HOME/StampApp/ActionsData/" + modulesList[i]);

                }

            }

        }, 3000);   
		*/
   
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function putTXTfile(langR, xmlfilepath) {
    var langRXML = json2xml(langR);

    $.ajax({
        type: "PUT",
        url: xmlfilepath,
        data: langRXML,
        dataType: "html",
    }).done(function ( ) {
        alertify.success('saved correctly');

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alertify.warning(errorThrown, textStatus);
    });
}

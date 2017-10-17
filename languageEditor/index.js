

var lang = [];
var xmlFileName = "sAppFPLiterals.xml";
var sortMode = "default"; // keyAZ, keyZA, engAZ, engZA
var langList;
var StampAppVersion = "";
/*
 English - en
 French - fr
 German - de
 Spanish - es
 Italian - it
 Chinese - zh
 Portuguese - pt
 Dutch - nl
 Swedish - sv
 Danish - da
 Czech - cs
 Finnish - fi
 Korean - ko
 Japanese - ja
 Russian - ru
 Polish - pl
 Turkish - tr
 Hungarian - hu
 Romanian - ro
 Slovenian - sl
 */
var translations = {
    'NEW_VERSION':'New version',
    'RELOAD':'Reload',
};
function Main() {
    
    GetLanguagesList();
    ChargeLanguagesFromXML();
    
    CheckCurrentVersion();
}

function translateUserInterface() {
    //TODO
}

function getArrayLanguagesList() {
    var listdir = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData");
    var ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    langList = listdir.html.body.div.ul.li;
    var arrayLanguages = [];
    for (var i = 0; i < langList.length; i++)
    {
        language = langList[i]["@title"];
        if ((language.length == 2))
        {
            arrayLanguages.push(language);
        }
    }
    return(arrayLanguages);
}
function GetLanguagesList() {
    var listdir = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData");
    ojsonListDir = xml2json(listdir, "");
    listdir = JSON.parse(ojsonListDir);
    langList = listdir.html.body.div.ul.li;
    var htmlaux = "";
    for (var i = 0; i < langList.length; i++)
    {
        language = langList[i]["@title"];
        if ((language.length == 2) && (language != "en"))
        {
            htmlaux += "  <option value='" + language + "'>" + language + "</option>";
        }
    }
    htmlaux += "  <option value='en'>en</option>";
    document.getElementById("langSelect").innerHTML = htmlaux;
}
function ChargeLanguagesFromXML() {
    var lang = [];
    lang = [];
    var langL = "";
    var langR = "";

    if (window.location.protocol == "file:")
    {
        alertify.notify("local files app");
        langL = ReadXML("en");
        langR = ReadXML(document.getElementById('langSelect').value);
    } else {
        alertify.success("remote files editing app");
        langL = LoadXML("en");
        langR = LoadXML(document.getElementById('langSelect').value);
    }
    GenerateLang(langL, langR);

    document.getElementById("tbody").innerHTML = GenerateTable();
    if (langR.LanguageManager)
    {
        document.getElementById("idLangR").innerHTML = getLanguageByLanguageCode(document.getElementById("langSelect").value) + " <span onclick='OnClickSortByLangR()' id='idSortLangRIcon' class='glyphicon glyphicon-sort-by-alphabet own-cursorPointer'></span>";
    } else {
        //alertify.warning("language file no exist or have errors, generating new file");
        document.getElementById("idLangR").innerHTML = getLanguageByLanguageCode(document.getElementById("langSelect").value) + " <span onclick='OnClickSortByLangR()' id='idSortLangRIcon' class='glyphicon glyphicon-sort-by-alphabet own-cursorPointer'></span>";
    }
}

function GenerateLang(langL, langR) {
    lang = [];
    for (var i = 0; i < langL.LanguageManager.ItemsList.Translation.length; i++)
    {

        var auxObj = {
            key: "",
            eng: "",
            aux: ""
        };
        auxObj.key = langL.LanguageManager.ItemsList.Translation[i]["@Key"];
        auxObj.eng = langL.LanguageManager.ItemsList.Translation[i]["@Value"];
        auxObj.aux = GetValueFromLangByKey(langR, auxObj.key);
        lang.push(auxObj);
    }
    if (!langR.LanguageManager)
    {
        alertify.warning("language <b>" + document.getElementById("langSelect").value + "</b> file for " + document.getElementById("fileSelect").value + " not exist or have errors");
        for (var i = 0; i < langL.LanguageManager.ItemsList.Translation.length; i++)
        {
            lang[i].aux = lang[i].eng;
        }
        alertify.warning("lang copied from english");
    }

}

function GetValueFromLangByKey(langR, keygiv) {
    if (langR.LanguageManager)
    {
        for (var i = 0; i < langR.LanguageManager.ItemsList.Translation.length; i++)
        {
            if (langR.LanguageManager.ItemsList.Translation[i]["@Key"] == keygiv)
            {
                return(langR.LanguageManager.ItemsList.Translation[i]["@Value"]);
            }
        }
    }
    return("");
}


/* charging files */
function LoadXML(langgiv) {
    var xmlDocLang = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + langgiv + "/" + xmlFileName);
    var ojsonLang = xml2json(xmlDocLang, "");
    var langCharged = JSON.parse(ojsonLang);
    if (langgiv == "en") {
        if (!langCharged.LanguageManager)
        {
            xmlDocLang = LoadXMLDoc("/fileservice/~home/docs/languages/" + xmlFileName);
            ojsonLang = xml2json(xmlDocLang, "");
            langCharged = JSON.parse(ojsonLang);
            putXML(langCharged, "/fileservice/~home/StampApp/LanguageData/en/" + xmlFileName);
            alertify.notify("generated english configliterals xml file");
        }
    }
    return(langCharged);
}

function ReadXML(langgiv) {

}

function SaveLanguage() {
    //first convert the lang object to the langL and langL
    var langR;
    langR = UnGenerateLang(lang);
    langR.LanguageManager["@StampAppVersion"] = StampAppVersion;
    SaveLanguageToXML(langR);
}

function UnGenerateLang(lang) {
    //from lang generates langL and langR
    var langR = {
        LanguageManager: {
            ItemsList: {
                Translation: []
            },
            Language: "",
            LanguageCode: ""
        }
    };
    for (var i = 0; i < lang.length; i++)
    {
        var auxTranslation = {
            '@Key': "",
            '@Value': ""
        };
        auxTranslation["@Key"] = lang[i].key;
        auxTranslation["@Value"] = lang[i].aux;
        langR.LanguageManager.ItemsList.Translation.push(auxTranslation);
    }
    langR.LanguageManager.LanguageCode = document.getElementById("langSelect").value;
    langR.LanguageManager.Language = getLanguageByLanguageCode(langR.LanguageManager.LanguageCode);
    return(langR);
}
function getLanguageByLanguageCode(langcodegiv) {
    var auxlang = "";
    switch (langcodegiv) {
        case "en":
            auxlang = "English";
            break;
        case "fr":
            auxlang = "French";
            break;
        case "de":
            auxlang = "German";
            break;
        case "es":
            auxlang = "Spanish";
            break;
        case "it":
            auxlang = "Italian";
            break;
        case "zh":
            auxlang = "Chinese";
            break;
        case "pt":
            auxlang = "Portuguese";
            break;
        case "nl":
            auxlang = "Dutch";
            break;
        case "sv":
            auxlang = "Swedish";
            break;
        case "da":
            auxlang = "Danish";
            break;
        case "cs":
            auxlang = "Czech";
            break;
        case "fi":
            auxlang = "Finnish";
            break;
        case "ko":
            auxlang = "Korean";
            break;
        case "ja":
            auxlang = "Japanese";
            break;
        case "ru":
            auxlang = "Russian";
            break;
        case "pl":
            auxlang = "Polish";
            break;
        case "ku":
            auxlang = "Kurdish";
            break;
        case "tr":
            auxlang = "Turkish";
            break;
        case "hu":
            auxlang = "Hungarian";
            break;
        case "ro":
            auxlang = "Romanian";
            break;
        case "sl":
            auxlang = "Slovenian";
            break;
        default:
            auxlang = "no language valid";
    }
    return(auxlang);
}
function SaveLanguageToXML(langR) {
    if (window.location.protocol == "file:")
    {
    } else {
        langgiv = document.getElementById("langSelect").value;
        putXML(langR, "/fileservice/~home/StampApp/LanguageData/" + langgiv + "/" + xmlFileName);
    }
}

function putXML(langR, xmlfilepath) {
    var langRXML = json2xml(langR);

    $.ajax({
        type: "PUT",
        url: xmlfilepath,
        data: langRXML,
        dataType: "html",
        error: function (jqXHR, Status, error_string) {
            console.log("file " + langR + " PUT KO");
            console.log("STATUS: " + Status);
            console.log("Error: putXML " + error_string);
        }
    }).done(function ( ) {
        alertify.success('saved correctly');

    }).fail(function (jqXHR, textStatus, errorThrown) {
        alertify.warning(errorThrown, textStatus);
    });
}



function ExportCurrentLanguage() {
    /*var langR;
     langR=UnGenerateLang(lang);*/

    var confirmedAux;
    //confirmedAux=confirm("to export, will recharge the language files from robot, will loose changes not saved. Continue?");
    SaveLanguage();
    setTimeout(function () {


        confirmedAux = true;
        if (confirmedAux == true) {
            var ConfFile, FPFile;
            /* start one file download */
            var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + document.getElementById("langSelect").value + "/sAppFPLiterals.xml");
            //robustness
            if (!xmlDocLangAux)
            {
                alert("Error: - Coudn't load: " + document.getElementById("langSelect").value + "/sAppConfLiterals.xml");
                console.log("Error- Coudn't load: " + document.getElementById("langSelect").value + "/sAppConfLiterals.xml");
                return;
            }
            var ojsonLang = xml2json(xmlDocLangAux, "");
            var langCharged = JSON.parse(ojsonLang);
            var langFPDuplicated = JSON.parse(JSON.stringify(langCharged));
            xmlDocLangFP = json2xml(langFPDuplicated);
            //saveTextAs(xmlDocLangFP, "sAppFPLiterals.xml");
            /* end one file download */

            var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + document.getElementById("langSelect").value + "/sAppConfLiterals.xml");
            //robustness	
            if (!xmlDocLangAux)
            {
                alert("Error: - Coudn't load: " + document.getElementById("langSelect").value + "/sAppConfLiterals.xml");
                console.log("Error- Coudn't load: " + document.getElementById("langSelect").value + "/sAppConfLiterals.xml");
                return;
            }
            var ojsonLang = xml2json(xmlDocLangAux, "");
            var langCharged = JSON.parse(ojsonLang);
            var langConfigDuplicated = JSON.parse(JSON.stringify(langCharged));
            xmlDocLangConfig = json2xml(langConfigDuplicated);
            //saveTextAs(xmlDocLangConfig, "sAppConfLiterals.xml");

            var zip = new JSZip();
            var languageData = zip.folder("LanguageData");

            var foldLang = languageData.folder(document.getElementById("langSelect").value);

            if (xmlDocLangFP.indexOf("LanguageManager") > -1)
            {
                foldLang.file("sAppFPLiterals.xml", xmlDocLangFP);
            }
            if (xmlDocLangConfig.indexOf("LanguageManager") > -1)
            {
                foldLang.file("sAppConfLiterals.xml", xmlDocLangConfig);
            }
            zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        var dateFile;
                        dateFile = ConstructDate();
                        saveAs(content, "languageExported_" + document.getElementById("langSelect").value + "_" + dateFile + ".zip");
                        alertify.success("language exported");
                    });
        } else {
            alertify.warning("operation canceled");
        }
    }, 700);


}
function ConstructDate() {
    var d = new Date();
    return(d.getFullYear() + "-" + (+d.getMonth() + 1) + "-" + d.getDate());
}
function ExportAllLanguages() {
    /*var langR;
     langR=UnGenerateLang(lang);*/

    var confirmedAux;
    //confirmedAux=confirm("to export, will recharge the language files from robot, will loose changes not saved. Continue?");
    SaveLanguage();
    confirmedAux = true;
    if (confirmedAux == true) {
        var ConfFile, FPFile;

        var zip = new JSZip();
        var languageData = zip.folder("LanguageData");
        for (var i = 0; i < langList.length; i++)
        {
            currentLang = langList[i]["@title"];
            var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + currentLang + "/sAppFPLiterals.xml");
            var ojsonLang = xml2json(xmlDocLangAux, "");
            var langCharged = JSON.parse(ojsonLang);
            var langFPDuplicated = JSON.parse(JSON.stringify(langCharged));
            xmlDocLangFP = json2xml(langFPDuplicated);

            var xmlDocLangAux = LoadXMLDoc("/fileservice/~home/StampApp/LanguageData/" + currentLang + "/sAppConfLiterals.xml");
            //robustness	
            if (!xmlDocLangAux)
            {
                alert("Error: - Coudn't load: " + currentLang + "/sAppConfLiterals.xml");
                console.log("Error- Coudn't load: " + currentLang + "/sAppConfLiterals.xml");
                return;
            }

            var ojsonLang = xml2json(xmlDocLangAux, "");
            var langCharged = JSON.parse(ojsonLang);
            var langConfigDuplicated = JSON.parse(JSON.stringify(langCharged));
            xmlDocLangConfig = json2xml(langConfigDuplicated);



            var foldLang = languageData.folder(currentLang);
            if (xmlDocLangFP.indexOf("LanguageManager") > -1)
            {
                foldLang.file("sAppFPLiterals.xml", xmlDocLangFP);
            }
            if (xmlDocLangConfig.indexOf("LanguageManager") > -1)
            {
                foldLang.file("sAppConfLiterals.xml", xmlDocLangConfig);
            }

        }
        zip.generateAsync({type: "blob"})
                .then(function (content) {
                    var dateFile;
                    dateFile = ConstructDate();
                    saveAs(content, "languagesExported_" + dateFile + ".zip");
                    alertify.success("language exported");
                });
    } else {
        alertify.warning("operation canceled");
    }

}

function ImportAllLanguages(evt) {
    if (document.getElementById("importedFileAllLanguagesInput").value != "")
    {
        var importedFileName;
        importedFileName = document.getElementById("importedFileAllLanguagesInput").value.replace("C:\\fakepath\\", "");
        alertify.notify(importedFileName);

        var files = evt.target.files;
        var f = files[0];

        var dateBefore = new Date();
        JSZip.loadAsync(f)
                .then(function (zip) {
                    var dateAfter = new Date();
                    alertify.success(" (loaded in " + (dateAfter - dateBefore) + "ms)");

                    var i;
                    i = 0;
                    arrFilePath = [];
                    zip.forEach(function (relativePath, zipEntry) {
                        //console.log(zipEntry.name);

                        if (zipEntry.name.indexOf(".xml") > -1)
                        {
                            //auxFileName=JSON.parse(JSON.stringify(zipEntry.name));

                            arrFilePath.push(JSON.parse(JSON.stringify(relativePath)));

                            auxFileName = JSON.parse(JSON.stringify(relativePath));
                            zipEntry.async("string").then(function (data) {
                                // data is "Hello World\n"
                                console.log("data: " + data);
                                xmlfilepath = "/fileservice/~home/StampApp/" + arrFilePath[i];
                                console.log("PATH: " + xmlfilepath);

                                $.ajax({
                                    type: "PUT",
                                    url: xmlfilepath,
                                    data: data,
                                    dataType: "xml",
                                }).done(function ( ) {
                                    alertify.success('put correctly - ' + xmlfilepath);
                                    console.log('put correctly ' + xmlfilepath);
                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                    console.log(errorThrown, textStatus);
                                });
                                i++;
                            });
                        } else {
                            //auxPathImporting=JSON.parse(JSON.stringify(zipEntry.name));
                            if (zipEntry.name != "LanguageData/")
                            {
                                if (zipEntry.name.indexOf(".xml") == -1)
                                {
                                    relativePath = "/fileservice/~home/StampApp/LanguageData";
                                    var idioma = zipEntry.name.split("/")[1];
                                    console.log("error: " + zipEntry.name);
                                    console.log("patherror: " + relativePath);
                                    $.ajax({
                                        type: "POST",
                                        url: relativePath,
                                        error: function (jqXHR, Status, error_string) {
                                            console.log("file " + relativePath + " post KO");
                                            console.log("STATUS: " + Status);
                                            console.log("Error: relativePath " + error_string);
                                        },
                                        data: "fs-newname=" + idioma + "&fs-action=create",
                                    }).done(function ( ) {
                                        alertify.success('put correctly - ' + relativePath);
                                        console.log('put correctly ' + relativePath);
                                    }).fail(function (jqXHR, textStatus, errorThrown) {
                                        console.log(errorThrown, textStatus);
                                    });
                                }
                            }
                        }

                        /*$.ajax({
                         type: "PUT",
                         url:  filepath,
                         data: xmlDoc,
                         dataType: "html",
                         success: function (data) {
                         alertify.success(data);
                         }
                         });*/


                    });

                }, function (e) {
                    alertify.error("error zip, " + e.message);
                });


    } else {
        alertify.warning("operation canceled");
    }
    chargingProgressBar("index.html", "3000", "4CAF50");//green: 4CAF50, blue: 4E97B2
    /*window.setTimeout(function(){
     window.location.href = "index.html";
     }, 3000);*/
}


/* CHARGINGPROGRESSBAR */
function chargingProgressBar(pageToRecharge, durationTime, barColor) {
    document.body.innerHTML += "<div id='disablingDiv' style='display: none; z-index:1001; position: fixed; top: 0%; left: 0%; width: 100%; height: 100%; background-color: #E6E6E6; opacity:.7; filter: alpha(opacity=07); transition:all .15s linear;'></div>";
    window.setTimeout(function () {
        window.location.href = pageToRecharge;
    }, durationTime);
    //poso la progressbar
    document.getElementById('disablingDiv').style.display = 'block';
    aux = "";
    aux += "<div style='width:100%;height:1.5em;position:relative;background-color:#f1f1f1;'>";
    aux += "  <div id='progressBar' style='width:1%; background-color:#757575;height:100%;position:absolute;line-height:inherit;color:#fff!important;background-color:#" + barColor + "!important;'></div>";
    aux += "</div>";
    document.getElementById('disablingDiv').innerHTML = aux;

    var elem = document.getElementById("progressBar");
    var width = 1;
    var id = setInterval(function () {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }, durationTime / 100);
}

/* </CHARGINGPROGRESSBAR */
/* </charging files */

function GenerateTable() {
    /*var transL=langL.LanguageManager.ItemsList.Translation;
     var transR=langR.LanguageManager.ItemsList.Translation;*/

    var aux = "";


    for (var i = 0; i < lang.length; i++)
    {
        aux += "<tr class='own-trHeight'>";
        aux += "<td>";
        aux += lang[i].key;
        aux += "</td>";

        aux += "<td>";
        aux += "<div  class='own-2ndCol'>"
        aux += lang[i].eng;
        aux += "</div>";
        aux += "</td>";
        if (lang[i].aux == "")
        {
            aux += "<td class='own-red'>";
        } else if (lang[i].aux == lang[i].eng)
        {
            aux += "<td class='own-orange'>";
        } else {
            aux += "<td>";
        }
        //aux+="<input type='text' class='own-textBox' id='"+i+"' value='" + lang[i].aux + "' onchange='OnChangeTB(this.id)'>";
        aux += "<textarea id='" + i + "' onfocus='this.select()' onkeyup='OnChangeTB(this.id)' onchange='OnChangeTB(this.id)' rows='2' class='own-textarea'>";
        aux += lang[i].aux;
        aux += "</textarea>";
        aux += "</td>";
        aux += "</tr>";
    }



    return(aux);
}


function OnChangeTB(iTB) {
    if (document.getElementById(iTB).value == "")
    {
        document.getElementById(iTB).parentElement.className = "own-red";
    } else if (document.getElementById(iTB).value == lang[iTB].eng)
    {
        document.getElementById(iTB).parentElement.className = "own-orange";
    } else {
        document.getElementById(iTB).parentElement.className = "";
    }
    lang[iTB].aux = document.getElementById(iTB).value;
}

function OnClickSortByKey() {
    alertify.notify("sort by key");
    if ((sortMode == "default") || (sortMode == "engAZ") || (sortMode == "engZA"))
    {
        lang.sort(function (a, b) {
            if (a.key.toLowerCase() < b.key.toLowerCase())
                return -1;
            if (a.key.toLowerCase() > b.key.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "keyAZ";
        document.getElementById("idSortKeyIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    } else if (sortMode == "keyAZ") {
        lang.sort(function (a, b) {
            if (a.key.toLowerCase() > b.key.toLowerCase())
                return -1;
            if (a.key.toLowerCase() < b.key.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "keyZA";
        document.getElementById("idSortKeyIcon").className = "glyphicon glyphicon-sort-by-alphabet-alt own-cursorPointer";
    } else if (sortMode == "keyZA") {
        lang.sort(function (a, b) {
            if (a.key.toLowerCase() < b.key.toLowerCase())
                return -1;
            if (a.key.toLowerCase() > b.key.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "keyAZ";
        document.getElementById("idSortKeyIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    }
    document.getElementById("tbody").innerHTML = GenerateTable();
}
function OnClickSortByEng() {
    alertify.notify("sort by eng");
    if ((sortMode == "default") || (sortMode == "keyAZ") || (sortMode == "keyZA"))
    {
        lang.sort(function (a, b) {
            if (a.eng.toLowerCase() < b.eng.toLowerCase())
                return -1;
            if (a.eng.toLowerCase() > b.eng.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engAZ";
        document.getElementById("idSortEngIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    } else if (sortMode == "engAZ") {
        lang.sort(function (a, b) {
            if (a.eng.toLowerCase() > b.eng.toLowerCase())
                return -1;
            if (a.eng.toLowerCase() < b.eng.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engZA";
        document.getElementById("idSortEngIcon").className = "glyphicon glyphicon-sort-by-alphabet-alt own-cursorPointer";
    } else if (sortMode == "engZA") {
        lang.sort(function (a, b) {
            if (a.eng.toLowerCase() < b.eng.toLowerCase())
                return -1;
            if (a.eng.toLowerCase() > b.eng.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engAZ";
        document.getElementById("idSortEngIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    }
    document.getElementById("tbody").innerHTML = GenerateTable();
}
function OnClickSortByLangR() {
    alertify.notify("sort by language");
    if ((sortMode == "default") || (sortMode == "keyAZ") || (sortMode == "keyZA"))
    {
        lang.sort(function (a, b) {
            if (a.aux.toLowerCase() < b.aux.toLowerCase())
                return -1;
            if (a.aux.toLowerCase() > b.aux.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engAZ";
        document.getElementById("idSortLangRIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    } else if (sortMode == "engAZ") {
        lang.sort(function (a, b) {
            if (a.aux.toLowerCase() > b.aux.toLowerCase())
                return -1;
            if (a.aux.toLowerCase() < b.aux.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engZA";
        document.getElementById("idSortLangRIcon").className = "glyphicon glyphicon-sort-by-alphabet-alt own-cursorPointer";
    } else if (sortMode == "engZA") {
        lang.sort(function (a, b) {
            if (a.aux.toLowerCase() < b.aux.toLowerCase())
                return -1;
            if (a.aux.toLowerCase() > b.aux.toLowerCase())
                return 1;
            return 0;
        });
        sortMode = "engAZ";
        document.getElementById("idSortLangRIcon").className = "glyphicon glyphicon-sort-by-alphabet own-cursorPointer";
    }
    document.getElementById("tbody").innerHTML = GenerateTable();
}

function OnChangeFileSelect(idSelect) {
    if (document.getElementById(idSelect).value == "FlexPendand")
    {
        document.getElementById(idSelect).className = "form-control input-sm own-blue own-green own-select";
        xmlFileName = "sAppFPLiterals.xml";
        lang = [];
        ChargeLanguagesFromXML();
    } else {
        document.getElementById(idSelect).className = "form-control input-sm own-blue own-blue own-select";
        xmlFileName = "sAppConfLiterals.xml";
        lang = [];
        ChargeLanguagesFromXML();
    }
    alertify.notify("translating strings for: " + document.getElementById(idSelect).value);
}
function OnChangeLangSelect(idSelect) {
    if (document.getElementById(idSelect).value == "FlexPendand")
    {
        lang = [];
        ChargeLanguagesFromXML();
    } else {
        lang = [];
        ChargeLanguagesFromXML();
    }
    alertify.notify("translating strings for: " + document.getElementById(idSelect).value);
}
function OnClickBtnMenu()
{
    var pAnswer = confirm("will lose the changes not saved");
    if (pAnswer == true) {
        window.location.href = "../index.html";
    }
}

var pinButtonHotEditState = true;
var partListData;
var currentPartData;
var currentPoint;
var currentPanel;
var CurrentNActionParam;
var CurrentActionName;
var CurrentActionDescription;
var unsavedChanges = false;
var translations = {};
var settingsData;
var maObj = [];
var isdraggingAction = false;
var idCurrentActionDragging;
var idCurrentModuleActionDragging;
var iCurrentHook;
var globaliBA;
var templates = [];

//global objects just to prevent netbeans intellisence to warn for unknown objects across the file...
var window = window;
var jQuery = window.jQuery;
var Handlebars = window.Handlebars;
var Swag = window.Swag;
var alertify = window.alertify;
var jsPlumb = window.jsPlumb;
var Sortable = window.Sortable;
var context = window.context;

function LoadSettings() {
    return window.LoadSettingsData().done(function (data) {
        settingsData = data.settings;
    });
}

function LoadLanguage() {
    return window.LoadLanguageData(settingsData.lang)
            .done(function (data) {
                translations = data;
            });
}

function prepareTranslationsFromXml(xmldata) {
    var ojsonLang = xml2json(xmldata, "");
    var langData = JSON.parse(ojsonLang);
    for (var key in langData.LanguageManager.ItemsList.Translation) {
        var item = langData.LanguageManager.ItemsList.Translation[key];
        var auxKey = JSON.parse(JSON.stringify(item["@Key"]));
        var auxValue = JSON.parse(JSON.stringify(item["@Value"]));
        translations[auxKey] = auxValue;
    }
}

function OnLoadHotedit() {

    LoadSettings()
            .then(LoadLanguage)
            .then(LoadPartList)
            .then(LoadTemplates)
            .then(GetModulesAndActionsFromRapid)
            .then(function () {
                //after all async data is loaded perform remaining sync actions 
                initializePartList();
                initializeModulesAndActionsAccordion();
                ContextMenus();
                CheckCurrentVersion();
                translateUserInterface();
                $("#hotEditMainBlock").css("animationName", "inicianim2");
                Split(['#partPointsContainer', '#modulesColumn', '#PrePostTriggsPanel'], {
                    sizes: [15, 15, 64]
                });
            });
}

function LoadTemplates() {
    Swag.registerHelpers();
    Handlebars.registerHelper('concat', function (prefix, id) {
        return prefix + id;
    });
    Handlebars.registerHelper('existInMaObj', ExistIn_maObj);
    Handlebars.registerHelper('var', function (name, value, context) {
        this[name] = value;
    });
    return $.when(LoadTemplate('modulesTemplate'),
            LoadTemplate('sequentialTriggPanelsTemplate'),
            LoadTemplate('triggerOptionsTemplate'),
            LoadTemplate('partListTemplate'))
            .done(function (data1, data2, data3, data4) {
                var modulesTemplate = Handlebars.compile($(data1[0]).filter("#tpl-modules").html());
                templates["modulesAccordion"] = modulesTemplate;

                Handlebars.registerPartial('actionPartial', Handlebars.compile($(data2[0]).filter("#tpl-actionPartial").html()));
                var seqtriggersTemplate = Handlebars.compile($(data2[0]).filter("#tpl-sequentialTriggPanels").html());
                templates["sequentialTriggPanels"] = seqtriggersTemplate;

                var triggerOptionsLineTemplate = Handlebars.compile($(data3[0]).filter("#tpl-triggOptionsLine").html());
                Handlebars.registerPartial('triggerLinePartial', triggerOptionsLineTemplate);
                var triggerOptionsSwitchesTemplate = Handlebars.compile($(data3[0]).filter("#tpl-triggOptionsSwitches").html());
                Handlebars.registerPartial('triggerSwitchesPartial', triggerOptionsSwitchesTemplate);
                var triggerOptionsPanelTemplate = Handlebars.compile($(data3[0]).filter("#tpl-triggOptionsPanel").html());
                templates["triggerOptions"] = triggerOptionsPanelTemplate;
                templates["triggerOptionsLine"] = triggerOptionsLineTemplate;

                var partListTemplate = Handlebars.compile($(data4[0]).filter("#tpl-partLib").html());
                templates["partListTemplate"] = partListTemplate;
            });
}

function translateUserInterface() {
    $(".translatable-text").each(function (i, obj) {
        var key = $(this).text();
        if (key in translations) {
            $(this).text(translations[key]);
        }
    });
    $(".translatable-title").each(function (i, obj) {
        var key = $(this).attr("title");
        if (key in translations) {
            $(this).attr("title", translations[key]);
        }
    });
}

function resetModifications() {
    if ($(".partReferenceItem.selected").length === 1) {
        var key = $(".partReferenceItem.selected").first().attr("id").replace("partReference_", "");
        deletePardDataUpdateXml(key)
                .then(loadPardDataXml(key));
    }
}

function setUnsavedChangesState(state) {
    unsavedChanges = state;
    if (unsavedChanges)
        $("#savebutton").addClass("changesPending");
    else
        $("#savebutton").removeClass("changesPending");
}

function ContextMenus() {
    context.init({
        fadeSpeed: 100,
        above: 'auto',
        preventDoubleContext: true,
        compress: false
    });
    context.attach('.partReferenceItem', [
        {header: translations.HOTEDIT_REFERENCE_OPTIONS},
        {text: "<img id='reloadIcon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_RESET_MODIFICATIONS, action: resetModifications},
        {text: "<img id='exporticondark' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_EXPORT_REFERENCE, action: exportReferences},
        {text: "<img id='editicon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_RENAME, action: renamePartReference}
    ]);
    context.attach('.SelectedActionItem', [
        {header: translations.HOTEDIT_ACTION_OPTIONS},
        {text: "<img id='editicon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_EDIT_PARAMETERS, action: EditParameters},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_DELETE_ACTION, action: DeleteSelectedActionItem}
    ]);
    context.attach('.triggerWithContextMenu', [
        {header: translations.HOTEDIT_TRIGGER_OPTIONS},
        {text: "<img id='editicon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_RENAME_TRIGGER, action: RenameCurrentTrigg},
        {text: "<img id='trashicon' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_DELETE_CURRENT_TRIGGER, action: DelCurrentTrigg}
    ]);
    context.attach('#PartListTable', [
        {header: translations.HOTEDIT_IMPORT},
        {text: "<img id='exporticondark' src='appImages/imgtrans.png' class='contextMenuItem' />" + translations.HOTEDIT_IMPORT, action: OnImportReferenceButtonClick}
    ]);
}

function LoadPartList() {
    return window.LoadPartListData().done(function (data) {
        if (!(data.MetaPartLib.PartList.MetaPart instanceof Array)) {
            data.MetaPartLib.PartList.MetaPart = [data.MetaPartLib.PartList.MetaPart];
        }
        partListData = data;
    });
}

function initializePartList() {
    var template = templates ["partListTemplate"];
    $("#PartListTable").html(template({partListData: partListData}));
    $("#PartListTable").html += '<div style=\"margin:auto\"></div>';
}

function deletePardDataUpdateXml(key) {
    var item = partListData.MetaPartLib.PartList.MetaPart[key];
    var idAsString = "0000" + item["@PartId"];
    idAsString = idAsString.substr(idAsString.length - 4);
    return window.DeletePardDataItemUpdateXml(idAsString)
            .done(function () {
                alertify.success(translations.HOTEDIT_UPDATE_PARTS_DELETED);
            }).fail(function () {
        alertify.error(translations.HOTEDIT_UPDATE_PARTS_DELETE_ERROR);
    });
}
function selectPart(key) {
    var performSelect = true;
    if (unsavedChanges)
        performSelect = confirm(translations.HOTEDIT_UNSAVED_CHANGES + " " + translations.IO_ARE_YOU_SURE);
    if (performSelect) {
        var item = partListData.MetaPartLib.PartList.MetaPart[key];
        var idAsString = "0000" + item["@PartId"];
        idAsString = idAsString.substr(idAsString.length - 4);

        return window.LoadPartListItemData(idAsString)
                .then(function (data) {
                    currentPartData = data;
                    preparePartPointsHtml();
                    $(".partReferenceItem").removeClass("selected");
                    $("#partReference_" + key).addClass("selected");
                    $("#modulesAccordion").hide();
                    currentPoint = undefined;
                    PaintSequentialTriggsPanels();
                }).fail(function () {
            alertify.error(translations.HOTEDIT_PARTS_LOAD_ERROR);
        });
    }
    
}

function loadPardDataXml(key) {
    var performLoad = true;
    if (unsavedChanges)
        performLoad = confirm(translations.HOTEDIT_UNSAVED_CHANGES + " " + translations.IO_ARE_YOU_SURE);
    if (performLoad) {
        var item = partListData.MetaPartLib.PartList.MetaPart[key];
        var idAsString = "0000" + item["@PartId"];
        idAsString = idAsString.substr(idAsString.length - 4);

        return window.LoadPartListItemData(idAsString)
                .then(function (data) {
                    currentPartData = data;
                    preparePartPointsHtml();
                    $(".partReferenceItem").removeClass("selected");
                    $("#partReference_" + key).addClass("selected");
                    $("#modulesAccordion").hide();
                    currentPoint = undefined;
                    PaintSequentialTriggsPanels();
                }).fail(function () {
            alertify.error(translations.HOTEDIT_PARTS_LOAD_ERROR);
        });
    } else
        return $.when("do nothing");
}

function SavePartDataUpdate(key) {
    return window.GetCurrentStampAppVersion()
            .then(function (version) {
                currentPartData.BlocAssembly["@StampAppVersion"] = version;
            }).then(function () {
        var item = partListData.MetaPartLib.PartList.MetaPart[key];
        var idAsString = "0000" + item["@PartId"];
        idAsString = idAsString.substr(idAsString.length - 4);
        var currentPartDataAsXml = json2xml(JSON.parse(JSON.stringify(currentPartData)));
        window.SavePartData(idAsString, currentPartDataAsXml)
    }).then(function () {
        setUnsavedChangesState(false);
        alertify.success(translations.HOTEDIT_SAVED_SUCCESS);
    }).fail(function () {
        alertify.error(translations.HOTEDIT_SAVE_ERROR);
    });
}

function OnMainButtonClick() {
    var exit = true;
    if (unsavedChanges && !confirm(translations.PPUP_EXIT_WITHOUT_SAVE + ", " + translations.IO_ARE_YOU_SURE))
        exit = false;
    if (exit) {
        $("body").css("background", "-moz-radial-gradient(right bottom, ellipse farthest-corner, #E9F2FA 20%, #09274F 100%)");
        $("#sidebar").css("animationDuration", "1.5s");
        $("#sidebar").css("animationName", "surtanim1");
        $("#hotEditMainBlock").css("animationDuration", "1.5s");
        $("#hotEditMainBlock").css("animationName", "surtanim2");
        window.setTimeout(ChargePageMain, 1000);
    }
}

function ChargePageMain() {
    window.location.href = "index.html";
}

function SaveHotEdit() {
    if ($(".partReferenceItem.selected").length === 1) {
        var key = $(".partReferenceItem.selected").first().attr("id").replace("partReference_", "");
        SavePartDataUpdate(key);
    }
}

function PinButtonHotEdit() {
    if (pinButtonHotEditState) {
        document.getElementById("pinbuttontreeview").id = "unpinbuttontreeview";
        document.getElementById("sidebar").className = "sidebar";
        $("#hotEditMainBlock").addClass("BlockWithUnpinnedSidebar");
        $("#hotEditMainBlock").removeClass("BlockWithPinnedSidebar");
        pinButtonHotEditState = false;
    } else {
        document.getElementById("unpinbuttontreeview").id = "pinbuttontreeview";
        document.getElementById("sidebar").className = "sidebarfixed";
        $("#hotEditMainBlock").removeClass("BlockWithUnpinnedSidebar");
        $("#hotEditMainBlock").addClass("BlockWithPinnedSidebar");
        pinButtonHotEditState = true;
    }
}

function prepareBlockBreadcrum(id) {
    var html = "";
    var search = $.grep(currentPartData.BlocAssembly.AllBlocs.Bloc, function (e) {
        return e["@Id"] === id;
    });
    var blockItem = search[0];
    if (blockItem["parentID"] !== "0") {
        if (blockItem["parentID"] !== "1") {
            html += "&nbsp; &gt; &nbsp;";
        }
        html += "<a href='#block_" + blockItem["@Id"] + "' class='breadcrum' onclick='shakeBlock(\"block_" + blockItem["@Id"] + "\")'>" + blockItem["BlocName"] + "</a>";
    }
    return (blockItem["parentID"] === "0") ? html : prepareBlockBreadcrum(blockItem["parentID"]) + html;
}

function shakeBlock(id) {
    $("#" + id).addClass("shaking");
    window.setTimeout(function () {
        $("#" + id).removeClass("shaking");
    }, 1000);
}

function preparePartPointsHtml() {
    $("#content-title").text(currentPartData.BlocAssembly.AssemblyName);

    var container = $("#partPointsContainer");
    var html = "";

    for (var key in currentPartData.BlocAssembly.AllBlocs.Bloc) {
        var blockItem = currentPartData.BlocAssembly.AllBlocs.Bloc[key];
        if (blockItem["parentID"] !== "0") {
            html += "<div class='listpointsguiA' id='block_" + blockItem["@Id"] + "'>";
            html += "<div>" + prepareBlockBreadcrum(blockItem["@Id"]) + "</div>";
        }

        if (blockItem.PointsReferences !== null) {
            for (var pointRefKey in blockItem.PointsReferences.int) {
                var id = (blockItem.PointsReferences.int instanceof Array) ? blockItem.PointsReferences.int[pointRefKey] : blockItem.PointsReferences.int;
                var search = $.grep(currentPartData.BlocAssembly.AllPoints.ProcessPoint, function (e) {
                    return e["@Id"] === id;
                });
                var pointItem = search[0];
                if (pointItem["parentID"] === blockItem["@Id"]) {
                    var pointHtml = "<div id='block_" + blockItem["@Id"] + "_point_" + pointItem["@Id"] + "' class='itemgui' style='top:0px;' onClick='setCurrentPoint(" + blockItem["@Id"] + "," + pointItem["@Id"] + ")' title='" + pointItem["Alias"] + "'><strong><p>" + pointItem["Alias"] + "</p></strong></div>";
                    if (html.indexOf(pointHtml) === -1) {
                        html += pointHtml;
                    }
                }
            }
        }
        if (blockItem["parentID"] !== "0") {
            html += "</div>";
        }
    }
    container.html(html);

    var items = $("#partPointsContainer").children();
    items.sort(function (a, b) {
        var paID = ($(a).hasClass("itemgui")) ? $(a).attr("id") : $(a).children(".itemgui").first().attr("id");
        if (typeof paID === 'undefined')
            return 0;
        else
            paID = parseInt(paID.substring(paID.lastIndexOf('_') + 1));

        var pbID = ($(b).hasClass("itemgui")) ? $(b).attr("id") : $(b).children(".itemgui").first().attr("id");
        if (typeof pbID === 'undefined')
            return 0;
        else
            pbID = parseInt(pbID.substring(pbID.lastIndexOf('_') + 1));

        if (paID > pbID)
            return 1;
        else if (paID < pbID)
            return -1;
        else
            return 0;
    });
    $("#partPointsContainer").empty().append(items);
    setUnsavedChangesState(false);
}

function setCurrentPoint(blockId, pointId) {
    var result = $.grep(currentPartData.BlocAssembly.AllPoints.ProcessPoint, function (e) {
        return e["@Id"] === pointId.toString();
    });
    currentPoint = result[0];
    $("#partPointsContainer div.itemgui").removeClass("selected");
    $("#block_" + blockId + "_point_" + pointId + ".itemgui").addClass("selected");
    $("#modulesAccordion").show();
    PaintSequentialTriggsPanels();
}

function GetModulesAndActionsFromRapid() {
    return window.LoadModuleNamesFromRapid()
            .then(function (arrayModNames) {
                var requests = [];
                for (var key in arrayModNames) {
                    requests.push(window.LoadActionsFromRapid(arrayModNames[key].modName));
                }
                var defer = $.when.apply($, requests);
                return defer.done(function () {
                    $.each(arguments, function (index, responseData) {
                        arrayModNames[index].modActions = responseData[0];
                    });
                    maObj = arrayModNames;
                });
            });
}

function initializeModulesAndActionsAccordion() {
    var template = templates ["modulesAccordion"];
    $("#modulesAccordion").html(template({maObj: maObj})).hide();
}

function CollapsePanel(id) {
    if (id.startsWith("Trigg")) {
        $("#" + id).next().next().toggleClass("w3-show");
    } else {
        $("#" + id).next().toggleClass("w3-show");
    }
}

function DragEndAction(event, idact) {
    $("#PreSeq").removeClass("own-green").removeClass("own-red");
    $("#PostSeq").removeClass("own-green").removeClass("own-red");
    for (var i = 0; i < CountUsedTriggs(currentPoint.ActionBinds.ActionBind); i++) {
        $("#Trigg" + i).removeClass("own-green").removeClass("own-red");
    }
    isdraggingAction = false;
}

function CountUsedBlocActionsFromBlocAction(ba) {
    var nBA = 5;
    for (var i = ba.length - 1; i >= 0; i--) {
        if (ba[i]["@xsi:nil"] === "true")
            nBA = i;
    }
    return(nBA);
}

function CountUsedTriggs(ab) {
    var numUsedTriggs = 0;
    for (var i = 0; i < ab.length; i++) {
        if (ab[i].Anticipation)
            numUsedTriggs++;
    }
    return(numUsedTriggs);
}

function CountUsedActions(ba) {
    var numUsedActions;
    numUsedActions = 0;
    for (var i = 0; i < ba.length; i++) {
        if (ba[i].ActionName)
            numUsedActions++;
    }
    return(numUsedActions);
}

function DragStartAction(event, idact) {
    event.dataTransfer.setData('text', event.target.id);
    idCurrentActionDragging = idact.split("_")[1];
    idCurrentModuleActionDragging = idact.split("_")[0];
    $("#PreSeq").addClass((CountUsedBlocActionsFromBlocAction(currentPoint.PreSecuentialActions.BlocAction) < 5) ? "own-green" : "own-red");
    $("#PostSeq").addClass((CountUsedBlocActionsFromBlocAction(currentPoint.PostSecuentialActions.BlocAction) < 5) ? "own-green" : "own-red");
    for (var i = 0; i < CountUsedTriggs(currentPoint.ActionBinds.ActionBind); i++) {
        $("#Trigg" + i).addClass((CountUsedBlocActionsFromBlocAction(currentPoint.ActionBinds.ActionBind[i].actions.BlocAction) < 5) ? "own-green" : "own-red");
    }
    isdraggingAction = true;
}

function AddActionToBlocAction(blActiongiv, nameMod, nameAction, idBlActParam) {
    var exist = "no", nBA = 5;
    for (var i = blActiongiv.length - 1; i >= 0; i--) {
        if ((blActiongiv[i].ActionName === nameAction))
            exist = "yes";
        if (blActiongiv[i]["@xsi:nil"] === "true")
            nBA = i;
    }
    //then, if no exists, put it
    globaliBA = nBA;
    if ((exist === "no") && (nBA < 5)) {
        blActiongiv[nBA].ActionName = nameAction;
        blActiongiv[nBA].ActionModule = nameMod;
        blActiongiv[nBA].ActionParam = idBlActParam;//Math.random();
        blActiongiv[nBA].DefaultEnabled = "true";
        blActiongiv[nBA].VisibleFP = "true";
        delete blActiongiv[nBA]["@xsi:nil"];
        setUnsavedChangesState(true);
    } else if (nBA >= 5) {
        alertify.error(translations.ACTIONS_MAX_5_ACTIONS);
    } else if (exist === "yes") {
        alertify.warning(translations.ACTIONS_CANT_REPEAT_ACTION);
    }
}

function GetActionFrommaObj(actionName) {
    for (var i = 0; i < maObj.length; i++) {
        for (var j = 0; j < maObj[i].modActions.length; j++) {
            if (maObj[i].modActions[j].actName === actionName) {
                return(maObj[i].modActions[j]);
            }
        }
    }
    return("not found");
}

function PanelAllowDropAction(event, idpan) {
    event.preventDefault();
}

function isActionInBlock(actionObject, blockActions) {
    var retval = false;
    for (var key in blockActions) {
        var item = blockActions[key];
        if (item.ActionName === actionObject.actName) {
            retval = true;
        }
    }
    return retval;
}

function dropAction(event, idpan) {
    event.preventDefault();
    if (isdraggingAction === true) {
        currentPanel = idpan;
        var actObj = GetActionFrommaObj(idCurrentActionDragging);
        var actions = getCurrentPanelBlockActions();
        if (CountUsedActions(actions.BlocAction) < 5) {
            var used = isActionInBlock(actObj, actions.BlocAction);
            AddActionToBlocAction(actions.BlocAction, idCurrentModuleActionDragging, idCurrentActionDragging, "");
            PaintSequentialTriggsPanels();
            if (actObj.actParam > 0 && !used) {
                mPrompt(actObj.actParam, idCurrentActionDragging, actObj.actDescr, "", "", SetValueToCurrentBlockActionParam);
            }
        }
        MakeSortable();
    }
    isdraggingAction = false;
}

function ExistIn_maObj(actnamegiv) {
    var match;
    match = "false";
    for (var i = 0; i < maObj.length; i++) {
        for (var j = 0; j < maObj[i].modActions.length; j++) {
            if (maObj[i].modActions[j].actName === actnamegiv)
                match = "true";
        }
    }
    return(match);
}

function GetNumOfActualTriggs() {
    for (var i = 0; i < 8; i++) {
        if (currentPoint.ActionBinds.ActionBind[i]["@xsi:nil"] === "true")
            return(i);
    }
}

function DelCurrentTrigg() {
    var ba = currentPoint.ActionBinds.ActionBind[iCurrentHook].actions.BlocAction;
    var exists = false;
    for (var i = 0; i < ba.length && !exists; i++) {
        if ((ba[i].ActionName !== "") && (ba[i].ActionName !== undefined)) {
            if (ExistIn_maObj(ba[i].ActionName) === "true")
                exists = true;
        }
    }
    if (CountUsedActions(ba) > 0 && !exists) {
        alertify.warning(translations.GENERAL_CANNOT_DELETE_TRIGG);
    } else {
        currentPoint.ActionBinds.ActionBind.splice(iCurrentHook, 1);
        currentPoint.ActionBinds.ActionBind.push(JSON.parse(JSON.stringify({"@xsi:nil": "true"})));
        setUnsavedChangesState(true);
        PaintSequentialTriggsPanels();
    }
}

function RenameCurrentTrigg() {
    title = translations.ACTIONS_RENAME_TRIGG;

    var pAnswer = prompt(title, currentPoint.ActionBinds.ActionBind[iCurrentHook].Description);
    if (pAnswer !== null) {
        currentPoint.ActionBinds.ActionBind[iCurrentHook].Description = pAnswer;
        iCurrentHookAUX = JSON.parse(JSON.stringify(iCurrentHook));
        setUnsavedChangesState(true);
        PaintSequentialTriggsPanels();
    } else {
        alertify.warning(translations.PPUP_RENAME_CANCELLED);
    }
}

function OnContextMenuTrigg(idgiv) {
    iCurrentHook = idgiv.split("_")[0].replace("Trigg", "");
}

function nullOrUndefined(variable) {
    return (typeof (variable) === "undefined" || variable === null);
}

function PaintSequentialTriggsPanels() {
    var template = templates["sequentialTriggPanels"];
    var html = template({
        currentPoint: currentPoint,
        countUsedTriggs: (!nullOrUndefined(currentPoint)) ? CountUsedTriggs(currentPoint.ActionBinds.ActionBind) : 0
    });
    $("#PrePostTriggsPanel").html(html);
    MakeSortable();
}

function AddNewTrigg() {
    if (currentPoint !== undefined) {
        var itrigg = GetNumOfActualTriggs();
        if (itrigg < 8) {
            currentPoint.ActionBinds.ActionBind[itrigg].inUse = "true";
            currentPoint.ActionBinds.ActionBind[itrigg].reference = "End";
            currentPoint.ActionBinds.ActionBind[itrigg].mode = "Distance";
            currentPoint.ActionBinds.ActionBind[itrigg].Anticipation = "0";
            currentPoint.ActionBinds.ActionBind[itrigg].Description = "trigg" + itrigg;
            act = [5];
            for (var i = 0; i < 5; i++) {
                act[i] = {
                    "@xsi:nil": "true"
                };
            }

            currentPoint.ActionBinds.ActionBind[itrigg].actions = {
                BlocAction: act
            };

            delete currentPoint.ActionBinds.ActionBind[itrigg]["@xsi:nil"];
            setUnsavedChangesState(true);
            PaintSequentialTriggsPanels();
        } else {
            alertify.error(translations.ACTIONS_MAX_8_TRIGGS);
        }
    } else {
        alertify.warning("select a point first!");
    }
}

function GetBlocActionObjectByActionName(namegiv) {
    if (currentPanel === "PreSeq" || currentPanel === "PostSeq" || currentPanel.indexOf("Trigg") > -1) {
        var actions = getCurrentPanelBlockActions();
        for (var i = 0; i < actions.BlocAction.length; i++) {
            if (namegiv === actions.BlocAction[i].ActionName) {
                return(actions.BlocAction[i]);
            }
        }
    } else
        return("notfound");
}

function OnActionPropertyClick(idaction, propertyName) {
    currentPanel = $("#" + idaction).attr("currentPanel");
    idaction = idaction.split("_")[1].replace("SelectedActionItem", "");
    baobj = GetBlocActionObjectByActionName(idaction);
    if (baobj.hasOwnProperty(propertyName)) {
        baobj[propertyName] = (baobj[propertyName] === "true") ? "false" : "true";
        alertify.success(translations.ACTIONS_DEFAULTENABLED_SET_TO + baobj[propertyName]);
        setUnsavedChangesState(true);
        PaintSequentialTriggsPanels();
    }
}

function OnActionVisibleClick(idaction) {
    OnActionPropertyClick(idaction, "VisibleFP");
}
function OnActionEnableClick(idaction) {
    OnActionPropertyClick(idaction, "DefaultEnabled");
}

function SetTriggValue() {
    var val;
    val = window.prompt(translations.ACTIONS_ENTER_TRIGG_VALUE, currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation);
    if ((val) && (Number.isInteger(Number.parseInt(val)))) {
        valraw = JSON.parse(JSON.stringify(val));
        val = val + "px";
        jsPlumb.reset();
        AddPlumbPropertiesToTrigg();
        PositionTriggFromValue(valraw);
        TriggerValue('trigg0');
        currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = valraw;
        $("#trigg0").html("<br><br><b>" + valraw + "</b>" + ($("#swTriggerUnits").is(':checked') ? "<b>mm</b>" : "<b>ms</b>"));
        ActualizeTriggOptionsBtnDescription();
    } else {
        alertify.warning(translations.ACTIONS_OPERATION_CANCELED_OR_CONTENT_UNAPROPIATED);
    }
}

function OnswTriggerDistanceModeClick() {
    if (currentPoint.ActionBinds.ActionBind[iCurrentHook].mode === "Distance") {
        if (!$("#swTriggerDistMode").is(':checked')) {
            currentPoint.ActionBinds.ActionBind[iCurrentHook].reference = "End";
            currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
            $("#swTriggerDistMode").prop('checked', true);
        } else {
            currentPoint.ActionBinds.ActionBind[iCurrentHook].reference = "Start";
            currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
            $("#swTriggerDistMode").prop('checked', false);
        }
        PaintTriggOptionsLine();
        TriggerValue("trigg0");
    }
}

function AddPlumbPropertiesToTrigg() {
    jsPlumb.ready(function () {
        var tstyle = {/* style for the connections of the flowchart */
            connector: ["Straight"],
            paintStyle: {
                strokeStyle: "#5b9ada",
                lineWidth: 5
            },
            endpoint: ["Rectangle", {width: 1, height: 1}]
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
            anchor: ["Right", "Left"]
        }, tstyle);
    });
}

function ActualizeTriggOptionsBtnDescription() {
    $("#reference" + iCurrentHook).html(currentPoint.ActionBinds.ActionBind[iCurrentHook].reference);
    var aux = currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation;
    aux += (currentPoint.ActionBinds.ActionBind[iCurrentHook].mode === "Distance") ? "mm" : "ms";
    $("#Anticipation" + iCurrentHook).html(aux);
}

function OnswTriggerUnitsClick() {
    if (!$("#swTriggerUnits").is(':checked')) {
        currentPoint.ActionBinds.ActionBind[iCurrentHook].mode = "Distance";
        currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
        $("#swTriggerUnits").prop("checked", true);
        $("#idDivSwTriggerDistMode").css("opacity", "1");
    } else {
        currentPoint.ActionBinds.ActionBind[iCurrentHook].mode = "Time";
        currentPoint.ActionBinds.ActionBind[iCurrentHook].reference = "End";
        currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = 0;
        $("#swTriggerUnits").prop("checked", false);
        $("#swTriggerDistMode").prop("checked", true);
        $("#idDivSwTriggerDistMode").css("opacity", "0.4");
    }
    PaintTriggOptionsLine();
    TriggerValue("trigg0");
}

function TriggerValue(idT) {
    if ($("#trigg0").css("left").replace("px", "") < 0)
        $("#trigg0").css("left", "0px");
    if ($("#trigg0").css("left").replace("px", "") > 350)
        $("#trigg0").css("left", "350px");
    if ((idT === "div0") || (idT === "trigg0")) {
        var val = $("#trigg0").css("left").replace("px", "");
        if (!$("#swTriggerUnits").is(':checked')) {
            val = 500 - Math.round(val * (10 / 7)) + "ms";
        } else {
            if ($("#swTriggerDistMode").is(':checked')) {
                val = Math.round(1000 - val.replace("px", "") * (20 / 7)) + "mm";
            } else {
                val = Math.round(val.replace("px", "") * (20 / 7)) + "mm";
            }
        }
        $("#trigg0").html("<br><br><b>" + val + "</b>");
    }
    currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation = val.replace(/(mm|ms|px)/g, "");
    setUnsavedChangesState(true);
    ActualizeTriggOptionsBtnDescription();
}

function MakeSortable() {
    if (!nullOrUndefined(currentPoint)) {
        document.querySelectorAll('.sortable').forEach(function (element, index, array) {
            Sortable.create(element, {
                animation: 150,
                onUpdate: function (evt) {
                    if (element.classList.contains("preposttrig-panel")) {
                        GetNewArrangment(element.id, evt.oldIndex, evt.newIndex);
                    }
                }
            });
        });
    }
}

function PositionTriggFromValue(val) {
    if (val === undefined)
        val = "0";
    valxml = JSON.parse(JSON.stringify(val));
    if (!$("#swTriggerUnits").is(':checked')) {
        val = Math.round((500 - val.replace("ms", "")) * (7 / 10));
    } else {
        if ($("#swTriggerDistMode").is(':checked')) {
            val = Math.round((1000 - val.replace("px", "")) * (7 / 20));
        } else {
            val = Math.round(val.replace("px", "") * (7 / 20));
        }
    }
    $("#trigg0").css("left", val + 'px');
    $("#trigg0").html("<br><br><b>" + valxml + ($("#swTriggerUnits").is(':checked') ? "mm" : "ms") + "</b>");
}

function OnMouseOverTriggOptions(idgiv) {
    iCurrentHook = idgiv.replace("_option_btn", "").replace("Trigg", "");
    $(".w3-dropdown-content.triggoptions").empty();
    PaintTriggOptions();
    PositionTriggFromValue(currentPoint.ActionBinds.ActionBind[iCurrentHook].Anticipation);
    if (!$("#swTriggerUnits").is(':checked')) {
        $("#idDivSwTriggerDistMode").css("opacity", "0.4");
    }
}

function PaintTriggOptions() {
    var template = templates["triggerOptions"];
    var html = template({currentTrigger: currentPoint.ActionBinds.ActionBind[iCurrentHook]});
    $("#Trigg" + iCurrentHook + "_option_btn_content").html(html);
    AddPlumbPropertiesToTrigg();
}

function PaintTriggOptionsLine() {
    var template = templates["triggerOptionsLine"];
    var html = template({currentTrigger: currentPoint.ActionBinds.ActionBind[iCurrentHook]});
    $("#Trigg" + iCurrentHook + "_option_btn_content #divtriggline").empty().html(html);
    AddPlumbPropertiesToTrigg();
}

function GetiBAByidSelectedActionItem(idcurrentselectedgiv) {
    currentPanel = idcurrentselectedgiv.split("_")[0];
    idcurrentselectedgiv = idcurrentselectedgiv.split("_")[1].replace("SelectedActionItem", "");
    if (currentPanel.indexOf("Trigg") > -1) {
        iCurrentHook = currentPanel.replace("Trigg", "");
        if (currentPoint.ActionBinds.ActionBind[iCurrentHook].actions) {
            for (var i = 0; i < 5; i++) {
                if (getCurrentPanelBlockActions().BlocAction[i].ActionName === idcurrentselectedgiv) {
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
    } else if (currentPanel === "PostSeq" || currentPanel === "PreSeq") {
        for (var i = 0; i < 5; i++) {
            if (getCurrentPanelBlockActions().BlocAction[i].ActionName === idcurrentselectedgiv) {
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

function OnContextMenuSelectedActionItem(idgiv) {
    currentPanel = idgiv.split("_")[0];
    idCurrentSelectedActionItem = idgiv.split("_")[1];
    globaliBA = GetiBAByidSelectedActionItem(idgiv);
    var actions = getCurrentPanelBlockActions();
    var currentBlockAction = actions.BlocAction[globaliBA];
    if (currentBlockAction.ActionParam !== null) {
        CurrentNActionParam = currentBlockAction.ActionParam.split(" ").length;
        if (currentBlockAction.ActionParam === "") {
            CurrentNActionParam = 0;
        }
        CurrentActionName = currentBlockAction.ActionName;
        CurrentActionModule = currentBlockAction.ActionModule;
    } else {
        CurrentNActionParam = 0;
    }
}

function DeleteSelectedActionItem() {
    actionName = idCurrentSelectedActionItem.replace("SelectedActionItem", "");
    SearchAndDeleteActionPoint(actionName);
    alertify.success(translations.PPUP_REMOVED);
    setUnsavedChangesState(true);
    PaintSequentialTriggsPanels();
}

function SearchAndDeleteActionPoint(nameToDelete) {
    var actions = getCurrentPanelBlockActions();
    for (i = 0; i < 5; i++) {
        if (actions.BlocAction[i].ActionName === nameToDelete) {
            actions.BlocAction.splice(i, 1);
            actions.BlocAction.push({"@xsi:nil": "true"});
        }
    }
}

function SetValueToCurrentBlockActionParam(arrayreturned) {
    var valgiven = "";
    for (var i = 0; i < arrayreturned.length; i++) {
        valgiven += (i !== arrayreturned.length - 1) ? arrayreturned[i] + " " : arrayreturned[i];
    }
    getCurrentPanelBlockActions().BlocAction[globaliBA].ActionParam = valgiven;
    setUnsavedChangesState(true);
    PaintSequentialTriggsPanels();
}

function EditParameters() {
    if (CurrentNActionParam > 0) {
        arraycontent = getCurrentPanelBlockActions().BlocAction[globaliBA].ActionParam.split(" ");
        mPrompt(CurrentNActionParam, CurrentActionName, CurrentActionDescription, "", arraycontent, SetValueToCurrentBlockActionParam);
    } else {
        alertify.warning(translations.ACTIONS_NO_PARAMETERS_IN_ACTION);
    }
}

function GetNewArrangment(currentPanelgiv, oldindex, newindex) {
    currentPanel = currentPanelgiv;
    var actions = getCurrentPanelBlockActions();
    var movingElem = JSON.parse(JSON.stringify(actions.BlocAction[oldindex]));
    if (oldindex < newindex) {
        for (var i = oldindex; i < newindex; i++) {
            actions.BlocAction[i] = actions.BlocAction[i + 1];
        }
    } else {
        for (var i = oldindex; i > newindex; i--) {
            actions.BlocAction[i] = actions.BlocAction[i - 1];
        }
    }
    actions.BlocAction[newindex] = movingElem;
    setUnsavedChangesState(true);
    PaintSequentialTriggsPanels();
}

function getCurrentPanelBlockActions() {
    if (currentPanel.indexOf("Trigg") > -1) {
        iCurrentHook = currentPanel.replace("Trigg", "");
        return currentPoint.ActionBinds.ActionBind[iCurrentHook].actions;
    } else if (currentPanel === "PreSeq") {
        return currentPoint.PreSecuentialActions;
    } else if (currentPanel === "PostSeq") {
        return currentPoint.PostSecuentialActions;
    }
}

function exportReference(key) {
    var item = partListData.MetaPartLib.PartList.MetaPart[key];
    var pAnswer = prompt(translations.PPUP_ENTER_FILENAME, item.PartName);
    if (pAnswer !== null) {
        var idAsString = "0000" + item["@PartId"];
        idAsString = idAsString.substr(idAsString.length - 4);
        $.when(LoadFileData("/fileservice/~home/StampApp/PartData/sAppPart" + idAsString + "/sAppPartData.mod"),
                LoadFileData("/fileservice/~home/StampApp/PartData/sAppPart" + idAsString + "/sAppPartData.xml"),
                LoadFileDataIfExists("/fileservice/~home/StampApp/PartData/sAppPart" + idAsString + "/sAppPartData_Update.xml"))
                .done(function (data1, data2, data3) {
                    var zip = new JSZip();
                    var folder = zip.folder("sAppPart" + idAsString);
                    folder.file("sAppPartData.mod", data1[0]);
                    folder.file("sAppPartData.xml", data2[0]);
                    if (data3 !== null) {
                        folder.file("sAppPartData_Update.xml", data3);
                    }
                    zip.generateAsync({type: "blob"})
                            .then(function (content) {
                                saveAs(content, pAnswer + ".zip");
                                alertify.success(translations.HOTEDIT_EXPORT_REFERENCE_SUCCESS);
                            });
                }).fail(function () {
            alert(translations.HOTEDIT_EXPORT_REFERENCE_ERROR);
        });
    } else {
        alertify.warning(translations.PPUP_OPERATION_CANCELED);
    }
}

function exportReferences() {
    if (unsavedChanges) {
        alertify.warning(translations.HOTEDIT_UNSAVED_CHANGES);
    } else {
         window.GetLoadedPartIdFromRapid()
        .then(function(id){
            if ($(".partReferenceItem.selected").length === 1) {
                var key = $(".partReferenceItem.selected").first().attr("id").replace("partReference_", "");
                if (partListData.MetaPartLib.PartList.MetaPart[key]["@PartId"] != id) {
                    exportReference(key);    
                } else {
                    alertify.warning(translations.HOTEDIT_CANCELLED_PART_LOADED);
                }

            } else {
                alertify.warning(translations.HOTEDIT_SELECT_REFERENCE);
            }
        });
    }
    
}

function renamePartReference() {
    if (unsavedChanges) {
        alertify.warning(translations.HOTEDIT_UNSAVED_CHANGES);
    } else {        
        window.GetLoadedPartIdFromRapid()
        .then(function(id){
            console.log("id = " + id);
            if ($(".partReferenceItem.selected").length === 1) {
                    var key = $(".partReferenceItem.selected").first().attr("id").replace("partReference_", "");
                    var targetId = parseInt(partListData.MetaPartLib.PartList.MetaPart[key]["@PartId"]);
                    if (targetId !== id) {
                        var pAnswer = prompt(translations.HOTEDIT_RENAME, partListData.MetaPartLib.PartList.MetaPart[key].PartName);
                        if (pAnswer !== null) {
                            partListData.MetaPartLib.PartList.MetaPart[key].PartName = pAnswer;
                            currentPartData.BlocAssembly.AssemblyName = pAnswer;
                            setUnsavedChangesState(true);
                            var currentPartDataAsXml = json2xml(JSON.parse(JSON.stringify(currentPartData)));

                            var targetIdAsString = "0000" + targetId;
                            targetIdAsString = targetIdAsString.substr(targetIdAsString.length - 4);

                            window.SavePartListData(json2xml(JSON.parse(JSON.stringify(partListData))))
                            .then(window.SavePartData(targetIdAsString, currentPartDataAsXml))
                            .then(window.SavePartDataNonUpdate(targetIdAsString, currentPartDataAsXml))
                            .then(function () { 
                                initializePartList();
                                translateUserInterface();
                                setUnsavedChangesState(false);
                                alertify.success(translations.PPUP_ITEM_RENAMED);
                            }).fail(function () { 
                                alert(translations.HOTEDIT_ERROR); 
                            });
                        } else {
                            alertify.warning(translations.PPUP_OPERATION_CANCELED);
                        }
                    } else {
                        alertify.warning(translations.HOTEDIT_CANCELLED_PART_LOADED);
                    }

                } else {
                    alertify.warning(translations.HOTEDIT_SELECT_REFERENCE);
                }
        });
    }
}

function OnImportReferenceButtonClick() {
    $("#importDialog form").get(0).reset();
    $("#inportOptionsContainer").hide();
    $("#importDialog").toggle();
}

function onChangeImportId() {
    if (/^([0-9]{1,4})$/.test($("#importId").val())) {
        var zipPartId = window.parseInt($("#importId").val()).toString();
        var data = partListData.MetaPartLib.PartList.MetaPart.find(x => x["@PartId"] === zipPartId);
        var used = ("undefined" !== typeof data) ? true : false;
        var overwrite = $("#importOverwriteId").is(":checked");
        if (!used || (used && overwrite)) {
            window.GetLoadedPartIdFromRapid()
            .then(function(id){
                if (zipPartId != id) {
                    $("#importFileSubmit").prop('disabled', false);
                } else {
                    alertify.warning(translations.HOTEDIT_CANCELLED_PART_LOADED);
                }
            });
            
        } else {
            alertify.warning(translations.HOTEDIT_IMPORT_USED_ID);
            $("#importFileSubmit").prop('disabled', true);
        }
    } else {
        alertify.warning(translations.HOTEDIT_IMPORT_INVALID_ID);
        $("#importFileSubmit").prop('disabled', true);
    }
}

function importFileChanged(event) {
    $("#inportOptionsContainer").slideDown("slow", function () {
        $("#importFileSubmit").prop('disabled', true);
        if ($("#importFileInput").val() !== "") {
            var zipFile = new JSZip();
            zipFile.loadAsync($('#importFileInput').prop('files')[0])                   //load zip
                    .then(function (zip) {
                        zip.forEach(function (relativePath, zipEntry) {
                            if (zipEntry.name.endsWith("/")) {
                                var zipPartId = window.parseInt(zipEntry.name.slice(0, -1).slice(-4)).toString();
                                $("#importId").val(zipPartId);
                                $("#importedFileDataPartId").text(zipPartId);                                
                                $("#importOverwriteId").prop('checked', false);
                                onOverwriteChange();
                            } else {
                                if (zipEntry.name.endsWith(".xml")) {
                                    var promise = zipEntry.async("text").then(function (data) {  
                                        var fileData =  xml2obj(data);
                                        $("#importedFileDataPartName").text(fileData.BlocAssembly.AssemblyName);               
                                    }).catch (function(){
                                        $("#importDialog").toggle();
                                         alertify.error(translations.HOTEDIT_IMPORT_ERROR);
                                    });
                                }
                            }

                        });

                        //put the file in the file-box
                        document.getElementById('file-box').value = ($('#importFileInput').prop('files')[0]).name;

                    }
                    );
        }
    });
}

function onChangeFileBoxInput() {
    document.getElementById('importFileInput').setAttribute('value', document.getElementById('file-box').value);
    console.log(($('#importFileInput')).toString());
}


function onOverwriteChange(event) {
    if ($("#importOverwriteId").is(":checked")) {
        $("#importId").prop('disabled', true);
    } else {
        $("#importId").prop('disabled', false);
    }
    onChangeImportId();
}

function importReference(event) {
    if ($("#importFileInput").val() !== "") {
        LoadFile($('#importFileInput').prop('files')[0]);
    }
}

async function LoadFile(myfile) {
    var zipFile = new JSZip();
    zipFile.loadAsync(myfile)                   //load zip
    .then(function (zip) {
        
        var d = $.Deferred();
 
        zip.forEach(function (relativePath, zipEntry) {
            if (zipEntry.name.endsWith("/")) {
                var overwrite = $("#importOverwriteId").is(":checked");
                var now = new Date();
                var dateString = (now.getDate() < 10 ? ("0" + now.getDate()) : now.getDate()) + "/" +
                        ((now.getMonth() + 1) < 10 ? ("0" + (now.getMonth() + 1)) : (now.getMonth() + 1)) + "/" +
                        now.getFullYear() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                var folderName = "sAppPart" + (('0000' + $("#importId").val()).slice(-4));
                var zipPartId = $("#importId").val().toString();
                var data = partListData.MetaPartLib.PartList.MetaPart.find(x => x["@PartId"] === zipPartId);
                if (!overwrite || typeof data === 'undefined') {                
                    partListData.MetaPartLib.PartList.MetaPart.push({
                        "@PartId": zipPartId,
                        "PartName": $("#importFileInput").val().replace("C:\\fakepath\\", "").slice(0, -4),
                        "CreationDate": dateString,
                        "ModificationDate": dateString
                    });
                } else {
                    data.ModificationDate = dateString;
                }
                 $.when(window.SavePartListData(json2xml(JSON.parse(JSON.stringify(partListData)))))                   
                .then(window.deleteFileData("/fileservice/~home/StampApp/PartData/" + folderName))
                .then(window.CreateFolder("/fileservice/~home/StampApp/PartData/" + folderName))
                .then(function () {
                    d.resolve(zip);
                });
            }
        });
        return d.promise();
    }).then(function (zip) {
        var promises = [];

        zip.forEach(function (relativePath, zipEntry) {        
            var folderName = "sAppPart" + (('0000' + $("#importId").val()).slice(-4));
            var fileName = zipEntry.name.substring(zipEntry.name.lastIndexOf('/') + 1);

            var url = "/fileservice/~home/StampApp/PartData/" + folderName + "/" + fileName;
            if (!zipEntry.name.endsWith("/")) {
                if (zipEntry.name.endsWith(".mod")) {
                    var promise = zipEntry.async("text").then(function (data) {    
                        var data2 = data.replace(/(PERS num nLoadedPart := )(\d{1,4})(;)/, "$1" + $("#importId").val() + "$3");
                        window.PostRapidFileData(url, data2);
                    }).catch (function(){
                        $("#importDialog").toggle();
                         alertify.error(translations.HOTEDIT_IMPORT_ERROR);
                    });
                    promises.push(promise);
                } else {
                    var promise = zipEntry.async("text").then(function (data) {  
                        var zipPartId = $("#importId").val();
                        var datalibitem = partListData.MetaPartLib.PartList.MetaPart.find(x => x["@PartId"] === zipPartId);
                        var fileData =  xml2obj(data);
                        datalibitem.PartName = fileData.BlocAssembly.AssemblyName;
                        window.SavePartListData(json2xml(JSON.parse(JSON.stringify(partListData))))
                        .then(window.PostFileData(url, data));
                    }).catch (function(){
                        $("#importDialog").toggle();
                         alertify.error(translations.HOTEDIT_IMPORT_ERROR);
                    });
                    promises.push(promise);
                }
            }
        });
        
        window.Promise.all(promises)
        .then(function(){
            console.log("all promises finihed"); 
            console.log("calling initializePartList");
            initializePartList();
            translateUserInterface();
            $("#importDialog").toggle();
            alertify.success(translations.HOTEDIT_IMPORT_SUCCESS);
        }).catch (function(){
           $("#importDialog").toggle();
            alertify.error(translations.HOTEDIT_IMPORT_ERROR);
        });
    });
}

function fdragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function fdragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.style.background = "lightyellow";
}

function DragDrop(event) {

    event.preventDefault();


    //var dt = event.dataTransfer;
    var files = event.dataTransfer.files[0].name;

   /* if (event.dataTransfer) {
        files = event.dataTransfer.files;
    } else if (event.target) {
        files = event.target.files;
    }*/

    handleFiles(files);

    event.stopPropagation();
}

function handleFiles(files){
    var file = files;
    file = file[0];
   // importFileChanged(event);
      $("#inportOptionsContainer").slideDown("slow", function () {
        $("#importFileSubmit").prop('disabled', true);
        //$("#importIdContainer").hide();
        if (file.name !== "") {
            var zipFile = new JSZip();
            zipFile.loadAsync(file)                   //load zip
                    .then(function (zip) {
                        zip.forEach(function (relativePath, zipEntry) {
                            if (zipEntry.name.endsWith("/")) {
                                var zipPartId = window.parseInt(zipEntry.name.slice(0, -1).slice(-4)).toString();
                                $("#importId").val(zipPartId);
                                $("#importOverwriteId").prop('checked', false);
                                onOverwriteChange();
                            }

                        });

                        //put the file in the file-box
                        document.getElementById('file-box').value = file.name;
                    }
                    );
        }
    });
}


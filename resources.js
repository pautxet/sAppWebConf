/* resources.js */

function LoadTemplate(templateName) {

    return $.ajax({
        url:  "/fileservice/~home/docs/" + templateName + ".tpl",
        type: "GET",
        cache: false,
        dataType: "html",
        processData: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        }
    });
}

function LoadPartListData() {
    return $.ajax({
        url: "/fileservice/~home/StampApp/PartData/PartDataLib.xml",
        type: "GET",
        cache: false,
        dataType: 'xml',
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text xml": function (xmldata) {
            return xml2obj(xmldata);
        }}
    });
}

function LoadPartListItemDataFile(key, update) {
    return  $.ajax({
        url: "/fileservice/~home/StampApp/PartData/sAppPart" + key + "/sAppPartData" + update + ".xml" ,
        type: "GET",
        cache: false,
        dataType: 'xml',
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text xml": function (xmldata) {
            return xml2obj(xmldata);
        }}
    });
}

function LoadPartListItemModFile(key) {
    return  $.ajax({
        url: "/fileservice/~home/StampApp/PartData/sAppPart" + key + "/sAppPartData.mod" ,
        type: "GET",
        cache: false,
        dataType: 'text',
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        }
    });
}

function LoadPartListItemData(key) {
    var d = $.Deferred();
    $.when(fileExists("/fileservice/~home/StampApp/PartData/sAppPart" + key + "/sAppPartData_Update.xml"))
            .then(function () {
                LoadPartListItemDataFile(key, "_Update").then(function (response) {
                    d.resolve(response);
                });
            }).fail(function () {
        LoadPartListItemDataFile(key, "").then(function (response) {
            d.resolve(response);
        });
    });
    return d.promise();
}

function DeletePardDataItemUpdateXml(key) {
    return $.ajax({
        url: "/fileservice/~home/StampApp/PartData/sAppPart" + key + "/sAppPartData_Update.xml",
        type: "DELETE"
    });
}

function LoadModuleNamesFromRapid() {

    return $.ajax({
        url: "/rw/rapid/modules?task=T_ROB1",
        type: "GET",
        dataType: 'html',
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text html": function (htmldata) {
            return $("li[title*='Actions']", htmldata).map(function () {
                return {
                    modName: $("span:first", this).text(),
                    modActions: []
                };
            }).get();
        }}
    });
}

function GetLoadedPartIdFromRapid() {
    return $.ajax({
        url: "/rw/rapid/symbol/data/RAPID/T_ROB1/sAppPartData/nLoadedPart" ,
        type: "GET",
        dataType: 'html',
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text html": function (htmldata) {
            return JSON.parse($("li.rap-data:first > span.value:first", htmldata).first().text());
        }}
    });
}
    
function LoadActionsFromRapid(modName) {

    return $.ajax({
        url: "/rw/rapid/symbol/data/RAPID/T_ROB1/" + modName + "/" + modName + "Array",
        type: "GET",
        dataType: 'html',
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text html": function (htmldata) {
            var data = [];
            var json = JSON.parse($("li.rap-data:first > span.value:first", htmldata).first().text());
            for (var key in json) {
                var item = json[key];
                data.push({
                    actName: item[0],
                    actParam: item[2],
                    actDescr: item[1]
                });
            }
            return data;
        }}
    });
}

function SavePartData(id, xmldata) {
    return $.ajax({
        url: "/fileservice/~home/StampApp/PartData/sAppPart" + id + "/sAppPartData_Update.xml",
        type: "PUT",
        contentType: 'application/xml',
        processData: false,
        data: xmldata
    });
}

function SavePartDataNonUpdate(id, xmldata) {
    return $.ajax({
        url: "/fileservice/~home/StampApp/PartData/sAppPart" + id + "/sAppPartData.xml",
        type: "PUT",
        contentType: 'application/xml',
        processData: false,
        data: xmldata
    });
}
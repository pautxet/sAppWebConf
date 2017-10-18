//* loadxmldoc.js /
// This file, manage all the functions for loading, getting, putting, even
// deleting, mainly the xml files that store the data of the system.
// 
// This files, needs jQuery, and also the json2xml.js.
//*/

function LoadXMLDoc(dname) {
    var result = "";

    $.ajax({
        url: dname,
        tySpe: "GET",
        dataType: 'xml',
        cache: false,
        async: false, //false is for sync calls
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        success: function (xmldata) {
            result = xmldata;
        }
    });

    return result;
}

function LoadXMLDocText(dname) {
    var resutl = "";
    $.ajax({
        url: dname,
        type: "GET",
        dataType: 'text',
        cache: false,
        async: false, //false is for sync calls
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        convertes: {'text xml': jQuery.ParseXML},
        success: function (xmldata) {
            result = xmldata;
        }
    });
    return result;
}

function LoadModulesFromRapid(mname) {
    return LoadXMLDoc(mname);
}

function LoadVarFromRapid(mname) {
    return LoadXMLDoc(mname);
}

function fileExists(url) {
    return $.ajax({
        url: url, 
        type: "HEAD", 
        cache: false
    });
}

function createLanguageData(lang) {
    var d = $.Deferred();

    return $.ajax({
        url: "/fileservice/~home/StampApp/LanguageData/en/sAppConfLiterals.xml",
        type: "GET",
        dataType: 'xml',
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        success: function (xmldata) {
            $.ajax({
                url: "/fileservice/~home/StampApp/LanguageData/" + lang + "/sAppConfLiterals.xml",
                type: "PUT",
                contentType: 'application/xml',
                cache: false,
                processData: false,
                data: xmldata,
                async: false,
                success: function () {
                    d.resolve();
                },
                error: function (jqXHR, Status, error_string) {
                    d.reject();
                }
            });
        },
        error: function (jqXHR, Status, error_string) {
            d.reject();
        }
    });
    return d.promise();
}

function LoadLanguageData(lang) {    
    var getData = function (lang) {
        return $.ajax({
            url: "/fileservice/~home/StampApp/LanguageData/" + lang + "/sAppConfLiterals.xml" ,
            type: "GET",
            cache: false,
            dataType: 'xml',
            headers: {'pragma': 'no-cache',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
            },
            converters: {"text xml": function (xmldata) {
                    var translations = [];
                    var ojsonLang = xml2json($.parseXML(xmldata), "");
                    var langData = JSON.parse(ojsonLang);
                    for (var key in langData.LanguageManager.ItemsList.Translation) {
                        var item = langData.LanguageManager.ItemsList.Translation[key];
                        var auxKey = JSON.parse(JSON.stringify(item["@Key"]));
                        var auxValue = JSON.parse(JSON.stringify(item["@Value"]));
                        translations[auxKey] = auxValue;
                    }
                    return translations;
                }}
        });
    };

    var d = $.Deferred();
    
    $.when(fileExists("/fileservice/~home/StampApp/LanguageData/" + lang + "/sAppConfLiterals.xml"))
    .then(function () {
        getData(lang).then(function (response) {
            d.resolve(response);
        });
    }).fail(function () {
        createLanguageData(lang)
        .then(function () {
            return getData(lang);
        })
        .then(function (response) {
            d.resolve(response);
        });
    });
    
    return d.promise();
}

function xml2obj(xmldata) {
    var ojsonLang = xml2json($.parseXML(xmldata), "");
    return (JSON.parse(ojsonLang));
}

function LoadXmlData(url) {

    return $.ajax({
        url: url,
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

function LoadSettingsData() {

    return $.ajax({
        url: "/fileservice/~home/docs/settings.xml",
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

function LoadIOSignalsData() {

    return $.ajax({
        url: "/fileservice/~home/StampApp/sAppData/CustomScreenConfig.xml",
        type: "GET",
        dataType: 'xml',
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text xml": function (xmldata) {
                var iosignals = {Tabs: []};
                for (var i = 1; i <= 10; ++i) {
                    var tab = {
                        id: i,
                        description: "",
                        Buttons: [],
                        Leds: []
                    };
                    for (var j = 1; j <= 5; ++j) {
                        var button = {
                            id: j,
                            ActiveColour: "Green",
                            ButtonType: "PushButton",
                            DefaultColour: "Grey",
                            InputSignal: null,
                            LabelText: null,
                            OutputSignal: null,
                            WarningMessage: null
                        };
                        tab.Buttons.push(button);
                    }
                    for (var j = 1; j <= 9; ++j) {
                        var led = {
                            id: j,
                            ActiveColour: "Green",
                            DefaultColour: "Grey",
                            InputSignal: null,
                            LabelText: null
                        };
                        tab.Leds.push(led);
                    }
                    iosignals.Tabs.push(tab);
                }
                var ioSignalsData = JSON.parse(xml2json($.parseXML(xmldata), ""));
                for (var i = 0; i < 10; ++i) {
                    if (!(ioSignalsData.CustomIOScreenData.Tabs.HMIButtonLedTabData instanceof Array)) {
                        ioSignalsData.CustomIOScreenData.Tabs.HMIButtonLedTabData = [ioSignalsData.CustomIOScreenData.Tabs.HMIButtonLedTabData];
                    }
                    var data = ioSignalsData.CustomIOScreenData.Tabs.HMIButtonLedTabData.find(x => x["@Id"] == i + 1);
                    if ("undefined" !== typeof data) {
                        iosignals.Tabs[i].description = data.LabelText;
                        for (var j = 0; j < 5; ++j) {
                            if (!(data.Buttons.HMIButtonData instanceof Array)) {
                                data.Buttons.HMIButtonData = [data.Buttons.HMIButtonData];
                            }
                            var buttonData = data.Buttons.HMIButtonData.find(x => x["@Id"] == j + 1);
                            if ("undefined" !== typeof buttonData) {
                                iosignals.Tabs[i].Buttons[j].ActiveColour = buttonData["ActiveColour"];
                                iosignals.Tabs[i].Buttons[j].ButtonType = buttonData["ButtonType"];
                                iosignals.Tabs[i].Buttons[j].DefaultColour = buttonData["DefaultColour"];
                                iosignals.Tabs[i].Buttons[j].InputSignal = buttonData["InputSignal"];
                                iosignals.Tabs[i].Buttons[j].LabelText = buttonData["LabelText"];
                                iosignals.Tabs[i].Buttons[j].OutputSignal = buttonData["OutputSignal"];
                                iosignals.Tabs[i].Buttons[j].WarningMessage = buttonData["WarningMessage"];
                            }
                        }
                        for (var j = 0; j < 9; ++j) {
                            if (!(data.Leds.HMILedData instanceof Array)) {
                                data.Leds.HMILedData = [data.Leds.HMILedData];
                            }
                            var ledData = data.Leds.HMILedData.find(x => x["@Id"] == j + 1);
                            if ("undefined" !== typeof ledData) {
                                iosignals.Tabs[i].Leds[j].ActiveColour = ledData["ActiveColour"];
                                iosignals.Tabs[i].Leds[j].DefaultColour = ledData["DefaultColour"];
                                iosignals.Tabs[i].Leds[j].InputSignal = ledData["InputSignal"];
                                iosignals.Tabs[i].Leds[j].LabelText = ledData["LabelText"];
                            }
                        }
                    }
                }
                return iosignals;
            }}
    });
}

function LoadTemplate(templateName) {

    var temp_url = "/fileservice/~home/docs/" + templateName + ".tpl";

    return $.ajax({
        url: temp_url,
        type: "GET",
        cache: false,
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        dataType: "html",
        processData: false
    });
}

function SaveIOSignalsData(xmldata) {
    return $.ajax({
        url: "/fileservice/~home/StampApp/sAppData/CustomScreenConfig.xml",
        type: "PUT",
        contentType: 'application/xml; charset=utf-8',
        processData: false,
        data: xmldata
    });
}

function LoadFileData(url) {
    return $.ajax({
        url: url,
        type: "GET",
        cache: false,
        dataType: 'text',
        headers: {'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        }
    });
}

function LoadFileDataIfExists(url) {

    var getData = function (url) {
        return $.ajax({
            url: url,
            type: "GET",
            cache: false,
            dataType: 'text',
            headers: {'pragma': 'no-cache',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
            }
        });
    };

    var d = $.Deferred();
    $.when(fileExists(url))
            .then(function () {
                getData(url).then(function (response) {
                    d.resolve(response);
                });
            }).fail(function () {
        d.resolve(null);
    });
    return d.promise();
}

function deleteFileData(url) {
    return $.ajax({
        url: url,
        type: "DELETE"
    });
}

function PostFileData(url, data) {
    return $.ajax({
        url: url,
        type: "PUT",
        data: data,
        dataType: "xml"
    });
}

function PostRapidFileData(url, data) {
    return $.ajax({
        url: url,
        type: "PUT",
        data: data,
        contentType: 'text/plain'
    });
}

function CreateFolder(url) {
    return $.ajax({
        type: "POST",
        url: url.substring(0, url.lastIndexOf('/')),
        data: {
            "fs-newname": url.substring(url.lastIndexOf('/') + 1),
            "fs-action": "create"
        }
    });
}

function SavePartListData(xmldata) {
    return $.ajax({
        url: "/fileservice/~home/StampApp/PartData/PartDataLib.xml",
        type: "PUT",
        contentType: 'application/xml; charset=utf-8',
        processData: false,
        data: xmldata
    });
}

function SaveSettngsData(xmldata) {
    return $.ajax({
        url: "/fileservice/~home/docs/settings.xml",
        type: "PUT",
        contentType: 'application/xml; charset=utf-8',
        processData: false,
        data: xmldata
    });
}

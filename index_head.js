function GetCurrentStampAppVersion() {
    console.log("GetCurrentStampAppVersion()");
    return $.ajax({
        url: "/fileservice/~System/system.xml",
        type: "GET",
        cache: false,
        dataType: 'xml',
        headers: {
            'pragma': 'no-cache',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Expires': 'Wed, 21 Oct 2015 07:28:00 GMT'
        },
        converters: {"text xml": function (xmldata) {
            var jsonData = xml2json($.parseXML(xmldata.replace(/\\/g, "\\\\")), "");
            var data = JSON.parse(jsonData);
            var stampAppMediaItem = data.SystemProperties.UsedMedia.Media.find(x => x["@name"] === "StampApp");
            return stampAppMediaItem["@version"];
        }}
    });
}

function reloadWindow(e) {
    window.location.reload(true);
}

function showNewVersionDialog(version) {
    window.LoadTemplate('newVersionDialogTemplate')
    .then(function (data) {
        var newVersionDialogTemplate = window.Handlebars.compile($(data).filter("#tpl-newVersionDialog").html());
        $("#newVersionDialog").replaceWith(newVersionDialogTemplate({version:version}));   
        $("#newVersionDialog .translatable-text").each(function(i, obj) {
            var key = $(this).text();
            if (key in window.translations) {
                $(this).text(window.translations[key]);
            }
        });
        $("#newVersionDialog").toggle();
    });
}

function CheckCurrentVersion() {
    window.GetCurrentStampAppVersion()
    .then(function (version){
        var lastStampAppVersion = localStorage.getItem("StampAppVersion");
        if (typeof lastStampAppVersion === "undefined" || version !== lastStampAppVersion) {
            localStorage.setItem("StampAppVersion", version);
            showNewVersionDialog(version);
        } else {
            localStorage.setItem("StampAppVersion", version);
        }
    });
}